<template>
	<div class="tabs-box">
		<div class="tabs-menu">
			<el-tabs v-model="tabsMenuValue" type="card" @tab-click="tabClick" @tab-remove="tabRemove">
				<el-tab-pane v-for="(item, index) in tabsMenuList" :key="item.path" :label="item.title" :name="item.path" :closable="item.close">
					<template #label>
						<el-dropdown trigger="contextmenu" :id="item.name" @visible-change="handleChange($event, item)" ref="dropdownRef">
							<div style="display: flex; align-items: center">
								<el-icon class="tabs-icon" v-if="item.icon && tabsIcon">
									<component :is="item.icon" />
								</el-icon>
								<span>{{ item.title }}</span>
							</div>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item @click="refresh" v-if="item.name === route.name">
										<el-icon>
											<Refresh />
										</el-icon>
										{{ $t('useTabs.refresh') }}
									</el-dropdown-item>
									<el-dropdown-item @click="maximize" v-if="item.name === route.name">
										<el-icon>
											<FullScreen />
										</el-icon>
										{{ $t('useTabs.maximize') }}
									</el-dropdown-item>
									<el-dropdown-item :divided="item.name === route.name" @click="closeOnSide('left')" v-if="tabsMenuList.length > 1 && item.close && index !== 1">
										<el-icon>
											<DArrowLeft />
										</el-icon>
										{{ $t('useTabs.closeLeft') }}
									</el-dropdown-item>
									<el-dropdown-item @click="closeOnSide('right')" v-if="tabsMenuList.length > 1 && item.close && tabsMenuList.length - 1 !== index">
										<el-icon>
											<DArrowRight />
										</el-icon>
										{{ $t('useTabs.closeRight') }}
									</el-dropdown-item>
									<el-dropdown-item divided @click="closeCurrentTab" v-if="tabsMenuList.length > 1 && item.name === route.name && item.close">
										<el-icon>
											<Remove />
										</el-icon>
										{{ $t('useTabs.closeCurrent') }}
									</el-dropdown-item>
									<el-dropdown-item @click="closeOtherTab" v-if="(tabsMenuList.length > 1 && index !== 0) || (tabsMenuList.length > 1 && index === 0)">
										<el-icon>
											<CircleClose />
										</el-icon>
										{{ $t('useTabs.closeOther') }}
									</el-dropdown-item>
									<el-dropdown-item @click="closeAllTab" v-if="tabsMenuList.length > 1 && item.close">
										<el-icon>
											<FolderDelete />
										</el-icon>
										{{ $t('useTabs.closeAll') }}
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</template>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script setup>
import Sortable from 'sortablejs'
import { HOME_URL } from '@/config'
import { ref, computed, watch, onMounted, inject, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/modules/global'
import { useTabsStore } from '@/stores/modules/tabs'
import { useAuthStore } from '@/stores/modules/auth'
import { useKeepAliveStore } from '@/stores/modules/keepAlive'
import { TabsPaneContext, TabPaneName } from 'element-plus'

const route = useRoute()
const router = useRouter()
const tabStore = useTabsStore()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const keepAliveStore = useKeepAliveStore()

const tabsMenuValue = ref(route.fullPath)
const tabsMenuList = computed(() => tabStore.tabsMenuList)
const tabsIcon = computed(() => globalStore.tabsIcon)

onMounted(() => {
	tabsDrop()
	initTabs()
})

// 监听路由的变化（防止浏览器后退/前进不变化 tabsMenuValue）
watch(
	() => route.fullPath,
	() => {
		if (route.meta.isFull) return
		tabsMenuValue.value = route.fullPath
		const tabsParams = {
			icon: route.meta.icon as string,
			title: route.meta.title as string,
			path: route.fullPath,
			name: route.name as string,
			close: !route.meta.isAffix
		}
		tabStore.addTabs(tabsParams)
		route.meta.isKeepAlive && keepAliveStore.addKeepAliveName(route.name as string)
	},
	{ immediate: true }
)

// useTabs 拖拽排序
const tabsDrop = () => {
	Sortable.create(document.querySelector('.el-tabs__nav') as HTMLElement, {
		draggable: '.el-tabs__item',
		animation: 300,
		onEnd({ newIndex, oldIndex }) {
			const tabsList = [...tabStore.tabsMenuList]
			const currRow = tabsList.splice(oldIndex as number, 1)[0]
			tabsList.splice(newIndex as number, 0, currRow)
			tabStore.setTabs(tabsList)
		}
	})
}

// 初始化需要固定的 useTabs
const initTabs = () => {
	authStore.flatMenuListGet.forEach(item => {
		if (item.meta.isAffix && !item.meta.isHide && !item.meta.isFull) {
			const tabsParams = {
				icon: item.meta.icon,
				title: item.meta.title,
				path: item.path,
				name: item.name,
				close: !item.meta.isAffix
			}
			tabStore.addTabs(tabsParams)
		}
	})
}

// Tab Click
const tabClick = (tabItem: TabsPaneContext) => {
	const fullPath = tabItem.props.name as string
	router.push(fullPath)
}

// Remove Tab
const tabRemove = (fullPath: TabPaneName) => {
	const name = tabStore.tabsMenuList.filter(item => item.path == fullPath)[0].name || ''
	keepAliveStore.removeKeepAliveName(name)
	tabStore.removeTabs(fullPath as string, fullPath == route.fullPath)
}

/*tab 右键下拉*/

const dropdownRef = ref()
const currentClickTag = ref()
const handleChange = (visible: boolean, tag: Object) => {
	if (!visible) return
	currentClickTag.value = tag
	console.log(currentClickTag.value, '555', tag.name)
	dropdownRef.value.forEach((item: { id: string; handleClose: () => void }) => {
		if (item.id === tag.name) return
		item.handleClose()
	})
}

//刷新
const refreshCurrentPage: Function = inject('refresh') as Function
const refresh = () => {
	setTimeout(() => {
		keepAliveStore.removeKeepAliveName(route.name as string)
		refreshCurrentPage(false)
		nextTick(() => {
			keepAliveStore.addKeepAliveName(route.name as string)
			refreshCurrentPage(true)
		})
	}, 0)
}

//最大化当前页
const maximize = () => {
	globalStore.setGlobalState('maximize', true)
}

//关闭两侧
const closeOnSide = (direction: 'left' | 'right') => {
	tabStore.closeTabsOnSide(currentClickTag.value.path, direction)
}
//关闭当前
const closeCurrentTab = () => {
	if (route.meta.isAffix) return
	tabStore.removeTabs(route.fullPath)
	keepAliveStore.removeKeepAliveName(route.name as string)
}

//关闭其他
const closeOtherTab = () => {
	router.push(currentClickTag.value.path)
	tabStore.closeMultipleTab(currentClickTag.value.path)
	keepAliveStore.setKeepAliveName([currentClickTag.value.name] as string[])
}

//关闭所有
const closeAllTab = () => {
	tabStore.closeMultipleTab()
	keepAliveStore.setKeepAliveName()
	router.push(HOME_URL)
}
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
