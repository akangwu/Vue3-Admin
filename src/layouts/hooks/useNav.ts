import { storeToRefs } from 'pinia'
import { getConfig } from '@/config'
import { useRouter } from 'vue-router'
import { emitter } from '@/utils/mitt'
import { routeMetaType } from '../types'
import { useGlobal } from '@pureadmin/utils'
import { transformI18n } from '@/plugins/i18n'
import { router, remainingPaths } from '@/router'
import { computed, type CSSProperties } from 'vue'
import { useAppStoreHook } from '@/store/modules/app'
import { useUserStoreHook } from '@/store/modules/user'
import { useEpThemeStoreHook } from '@/store/modules/epTheme'
import { usePermissionStoreHook } from '@/store/modules/permission'

const errorInfo = '当前路由配置不正确，请检查配置'

export function useNav() {
	const pureApp = useAppStoreHook()
	const routers = useRouter().options.routes
	const { wholeMenus } = storeToRefs(usePermissionStoreHook())
	/** 平台`layout`中所有`el-tooltip`的`effect`配置，默认`light` */
	const tooltipEffect = getConfig()?.TooltipEffect ?? 'light'

	const getDivStyle = computed((): CSSProperties => {
		return {
			width: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			overflow: 'hidden'
		}
	})

	/** 用户名 */
	const username = computed(() => {
		return useUserStoreHook()?.username
	})

	/** 设置国际化选中后的样式 */
	const getDropdownItemStyle = computed(() => {
		return (locale, t) => {
			return {
				background: locale === t ? useEpThemeStoreHook().epThemeColor : '',
				color: locale === t ? '#f4f4f5' : '#000'
			}
		}
	})

	const getDropdownItemClass = computed(() => {
		return (locale, t) => {
			return locale === t ? '' : 'dark:hover:!text-primary'
		}
	})

	const avatarsStyle = computed(() => {
		return username.value ? { marginRight: '10px' } : ''
	})

	const isCollapse = computed(() => {
		return !pureApp.getSidebarStatus
	})

	const device = computed(() => {
		return pureApp.getDevice
	})

	const { $storage, $config } = useGlobal<GlobalPropertiesApi>()
	const layout = computed(() => {
		return $storage?.layout?.layout
	})

	const title = computed(() => {
		return $config.Title
	})

	/** 动态title */
	function changeTitle(meta: routeMetaType) {
		const Title = getConfig().Title
		if (Title) document.title = `${transformI18n(meta.title)} | ${Title}`
		else document.title = transformI18n(meta.title)
	}

	/** 退出登录 */
	function logout() {
		useUserStoreHook().logOut()
	}

	function backHome() {
		router.push('/welcome')
	}

	function onPanel() {
		emitter.emit('openPanel')
	}

	function toggleSideBar() {
		pureApp.toggleSideBar()
	}

	function handleResize(menuRef) {
		menuRef?.handleResize()
	}

	function resolvePath(route) {
		if (!route.children) return console.error(errorInfo)
		const httpReg = /^http(s?):\/\//
		const routeChildPath = route.children[0]?.path
		if (httpReg.test(routeChildPath)) {
			return route.path + '/' + routeChildPath
		} else {
			return routeChildPath
		}
	}

	function menuSelect(indexPath: string, routers): void {
		if (wholeMenus.value.length === 0) return
		if (isRemaining(indexPath)) return
		let parentPath = ''
		const parentPathIndex = indexPath.lastIndexOf('/')
		if (parentPathIndex > 0) {
			parentPath = indexPath.slice(0, parentPathIndex)
		}
		/** 找到当前路由的信息 */
		function findCurrentRoute(indexPath: string, routes) {
			if (!routes) return console.error(errorInfo)
			return routes.map(item => {
				if (item.path === indexPath) {
					if (item.redirect) {
						findCurrentRoute(item.redirect, item.children)
					} else {
						/** 切换左侧菜单 通知标签页 */
						emitter.emit('changLayoutRoute', {
							indexPath,
							parentPath
						})
					}
				} else {
					if (item.children) findCurrentRoute(indexPath, item.children)
				}
			})
		}
		findCurrentRoute(indexPath, routers)
	}

	/** 判断路径是否参与菜单 */
	function isRemaining(path: string): boolean {
		return remainingPaths.includes(path)
	}

	return {
		title,
		device,
		layout,
		logout,
		routers,
		$storage,
		backHome,
		onPanel,
		getDivStyle,
		changeTitle,
		toggleSideBar,
		menuSelect,
		handleResize,
		resolvePath,
		isCollapse,
		pureApp,
		username,
		avatarsStyle,
		tooltipEffect,
		getDropdownItemStyle,
		getDropdownItemClass
	}
}
