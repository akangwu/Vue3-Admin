import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { DEFAULT_PRIMARY } from '@/config'
import { useGlobalStore } from '@/stores/modules/global'
import { getLightColor, getDarkColor } from '@/utils/color'
import { asideTheme } from '@/styles/theme/aside'

/**
 * @description 全局主题 hooks
 * */
export const useTheme = () => {
	const globalStore = useGlobalStore()
	const { primary, isGrey, isWeak, asideInverted, layout } = storeToRefs(globalStore)

	// 切换暗黑模式 ==> 并带修改主题颜色、侧边栏颜色
	const switchDark = () => {
		const body = document.documentElement
		body.setAttribute('class', '')
		changePrimary(primary.value)
		setAsideTheme()
	}

	// 修改主题颜色
	const changePrimary = val => {
		if (!val) {
			val = DEFAULT_PRIMARY
			ElMessage({ type: 'success', message: `主题颜色已重置为 ${DEFAULT_PRIMARY}` })
		}
		// 计算主题颜色变化
		document.documentElement.style.setProperty('--el-color-primary', val)
		document.documentElement.style.setProperty('--el-color-primary-dark-2', `${getDarkColor(val, 0.3)}`)
		for (let i = 1; i <= 9; i++) {
			const primaryColor = `${getLightColor(val, i / 10)}`
			document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, primaryColor)
		}
		globalStore.setGlobalState('primary', val)
	}

	// 灰色和弱色切换
	const changeGreyOrWeak = (type, value) => {
		const body = document.body
		if (!value) return body.removeAttribute('style')
		const styles = {
			grey: 'filter: grayscale(1)',
			weak: 'filter: invert(80%)'
		}
		body.setAttribute('style', styles[type])
		const propName = type === 'grey' ? 'isWeak' : 'isGrey'
		globalStore.setGlobalState(propName, false)
	}

	// 设置侧边栏样式 ==> light、inverted、dark
	const setAsideTheme = () => {
		// 默认所有侧边栏为 light 模式
		let type = 'light'
		// transverse 布局下菜单栏为 inverted 模式
		if (layout.value == 'transverse') type = 'inverted'
		// 侧边栏反转色目前只支持在 vertical 布局模式下生效
		if (layout.value == 'vertical' && asideInverted.value) type = 'inverted'
		const theme = asideTheme[type]
		for (const [key, value] of Object.entries(theme)) {
			document.documentElement.style.setProperty(key, value)
		}
	}

	// init theme
	const initTheme = () => {
		switchDark()
		if (isGrey.value) changeGreyOrWeak('grey', true)
		if (isWeak.value) changeGreyOrWeak('weak', true)
	}

	return {
		initTheme,
		switchDark,
		changePrimary,
		changeGreyOrWeak,
		setAsideTheme
	}
}
