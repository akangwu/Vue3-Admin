<!-- 纵向布局 -->
<template>
	<el-container class="layout">
		<el-aside>
			<div class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">
				<div class="logo flx-center">
					<img class="logo-img" src="@/assets/images/logo.svg" alt="logo" />
					<span v-show="!isCollapse" class="logo-text">G</span>
				</div>
				<el-scrollbar>
					<el-menu :default-active="activeMenu" :collapse="isCollapse" :router="false" :unique-opened="true" :collapse-transition="false">
						<SubMenu :menuList="menuList" />
					</el-menu>
				</el-scrollbar>
			</div>
		</el-aside>
		<el-container>
			<!--<el-header>
        <ToolBarLeft />
        <ToolBarRight />
      </el-header>-->
			<Main />
		</el-container>
	</el-container>
</template>

<script setup name="layoutVertical">
//import ToolBarLeft from "@/layouts/components/Header/ToolBarLeft.vue";
//import ToolBarRight from "@/layouts/components/Header/ToolBarRight.vue";
import Main from '@/layouts/components/Main/index.vue'
import SubMenu from '@/layouts/components/Menu/SubMenu.vue'
import { useAuthStore } from '@/stores/modules/auth'
import { useGlobalStore } from '@/stores/modules/global'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const isCollapse = computed(() => globalStore.isCollapse)
const menuList = computed(() => authStore.showMenuListGet)
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path))
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
