<template>
	<el-container class="layout">
		<div class="aside-split">
			<div class="logo flx-center">
				<img class="logo-img" src="@/assets/images/logo.svg" alt="logo" />
			</div>
			<el-scrollbar>
				<div class="split-list">
					<div
						class="split-item"
						:class="{ 'split-active': splitActive === item.path || `/${splitActive.split('/')[1]}` === item.path }"
						v-for="item in menuList"
						:key="item.path"
						@click="changeSubMenu(item)"
					>
						<el-icon>
							<component :is="item.meta.icon" />
						</el-icon>
						<span class="title">{{ item.meta.title }}</span>
					</div>
				</div>
			</el-scrollbar>
		</div>
		<el-aside :class="{ 'not-aside': !subMenuList.length }" :style="{ width: isCollapse ? '65px' : '210px' }">
			<div class="logo flx-center">
				<span v-show="subMenuList.length" class="logo-text">{{ isCollapse ? 'G' : 'G' }}</span>
			</div>
			<el-scrollbar>
				<el-menu :default-active="activeMenu" :router="false" :collapse="isCollapse" :collapse-transition="false" :unique-opened="true">
					<SubMenu :menuList="subMenuList" />
				</el-menu>
			</el-scrollbar>
		</el-aside>
		<el-container>
			<el-header>
				<ToolBarLeft />
				<ToolBarRight />
			</el-header>
			<Main />
		</el-container>
	</el-container>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/modules/auth'
import { useGlobalStore } from '@/stores/modules/global'
import { useRoute, useRouter } from 'vue-router'
import ToolBarLeft from '@/layouts/components/Header/ToolBarLeft.vue'
import ToolBarRight from '@/layouts/components/Header/ToolBarRight.vue'
import Main from '@/layouts/components/Main/index.vue'
import SubMenu from '@/layouts/components/Menu/SubMenu.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const globalStore = useGlobalStore()

const isCollapse = computed(() => globalStore.isCollapse)
const menuList = computed(() => authStore.showMenuListGet)
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path))

const subMenuList = ref([])
const splitActive = ref('')

watch(
	() => [menuList.value, route.path],
	() => {
		if (!menuList.value.length) return

		splitActive.value = route.path
		const menuItem = menuList.value.find(item => {
			return route.path === item.path || `/${route.path.split('/')[1]}` === item.path
		})

		if (menuItem && menuItem.children?.length) {
			subMenuList.value = menuItem.children
		} else {
			subMenuList.value = []
		}
	},
	{ immediate: true }
)

const changeSubMenu = item => {
	splitActive.value = item.path
	if (item.children?.length) {
		subMenuList.value = item.children
	} else {
		subMenuList.value = []
	}
	router.push(item.path)
}
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
