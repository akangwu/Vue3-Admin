<template>
	<el-drawer v-model="drawerVisible" title="布局设置" size="300px">
		<!-- 布局切换 -->
		<el-divider class="divider" content-position="center">
			<el-icon><Notification /></el-icon>
			布局切换
		</el-divider>
		<div class="layout-box mb30">
			<el-tooltip effect="dark" content="纵向" placement="top" :show-after="200">
				<div :class="['layout-item layout-vertical', { 'is-active': layout == 'vertical' }]" @click="setLayout('vertical')">
					<div class="layout-dark" />
					<div class="layout-container">
						<div class="layout-light" />
						<div class="layout-content" />
					</div>
					<el-icon v-if="layout == 'vertical'"><CircleCheckFilled /></el-icon>
				</div>
			</el-tooltip>
			<el-tooltip effect="dark" content="经典" placement="top" :show-after="200">
				<div :class="['layout-item layout-classic', { 'is-active': layout == 'classic' }]" @click="setLayout('classic')">
					<div class="layout-dark" />
					<div class="layout-container">
						<div class="layout-light" />
						<div class="layout-content" />
					</div>
					<el-icon v-if="layout == 'classic'"><CircleCheckFilled /></el-icon>
				</div>
			</el-tooltip>
			<el-tooltip effect="dark" content="横向" placement="top" :show-after="200">
				<div :class="['layout-item layout-transverse', { 'is-active': layout == 'transverse' }]" @click="setLayout('transverse')">
					<div class="layout-dark" />
					<div class="layout-content" />
					<el-icon v-if="layout == 'transverse'"><CircleCheckFilled /></el-icon>
				</div>
			</el-tooltip>
			<el-tooltip effect="dark" content="分栏" placement="top" :show-after="200">
				<div :class="['layout-item layout-columns', { 'is-active': layout == 'columns' }]" @click="setLayout('columns')">
					<div class="layout-dark" />
					<div class="layout-light" />
					<div class="layout-content" />
					<el-icon v-if="layout == 'columns'"><CircleCheckFilled /></el-icon>
				</div>
			</el-tooltip>
		</div>

		<el-divider class="divider" content-position="center">
			<el-icon><ColdDrink /></el-icon>
			全局设置
		</el-divider>
		<div class="theme-item">
			<span>主题颜色</span>
			<el-color-picker v-model="primary" :predefine="colorList" @change="changePrimary" />
		</div>
		<div class="theme-item">
			<span>面包屑</span>
			<el-switch v-model="breadcrumb" />
		</div>
		<div class="theme-item">
			<span>面包屑图标</span>
			<el-switch v-model="breadcrumbIcon" />
		</div>
		<div class="theme-item">
			<span>标签栏</span>
			<el-switch v-model="tabs" />
		</div>
		<div class="theme-item">
			<span>标签栏图标</span>
			<el-switch v-model="tabsIcon" />
		</div>
	</el-drawer>
</template>

<script setup>
import { DEFAULT_PRIMARY } from '@/config'
import { useTheme } from '@/hooks/useTheme'
import { useGlobalStore } from '@/stores/modules/global'
import mittBus from '@/utils/mittBus'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { changePrimary, setAsideTheme } = useTheme()

const globalStore = useGlobalStore()
const { layout, primary, breadcrumb, breadcrumbIcon, tabs, tabsIcon } = storeToRefs(globalStore)

// 预定义主题颜色
const colorList = [DEFAULT_PRIMARY, '#e1251b', '#e63e44', '#ea3224', '#ee2223', '#f73131', '#a30030', '#ee722e', '#18ae66', '#0028aa', '#1b55d1']

// 设置布局方式
const setLayout = val => {
	globalStore.setGlobalState('layout', val)
	setAsideTheme()
}

// 打开主题设置
const drawerVisible = ref(false)
mittBus.on('openThemeDrawer', () => (drawerVisible.value = true))
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
