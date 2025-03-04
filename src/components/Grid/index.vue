<template>
	<div :style="style">
		<slot></slot>
	</div>
</template>

<script setup>
import { ref, watch, useSlots, computed, provide, onBeforeMount, onMounted, onUnmounted, onDeactivated, onActivated } from 'vue'

// 定义组件的 props
const props = defineProps({
	cols: {
		type: [Number, Object],
		default: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 })
	},
	collapsed: {
		type: Boolean,
		default: false
	},
	collapsedRows: {
		type: Number,
		default: 1
	},
	gap: {
		type: [Array, Number],
		default: 0
	}
})

// 定义组件的 emits
const emit = defineEmits([])

// 生命周期钩子：在组件挂载前，如果 collapsed 为 true，则调用 findIndex 方法
onBeforeMount(() => {
	if (props.collapsed) findIndex()
})

// 生命周期钩子：在组件挂载后，调用 resize 方法并添加窗口大小变化事件监听器
onMounted(() => {
	resize({ target: { innerWidth: window.innerWidth } })
	window.addEventListener('resize', resize)
})

// 生命周期钩子：在组件激活时，调用 resize 方法并添加窗口大小变化事件监听器
onActivated(() => {
	resize({ target: { innerWidth: window.innerWidth } })
	window.addEventListener('resize', resize)
})

// 生命周期钩子：在组件卸载时，移除窗口大小变化事件监听器
onUnmounted(() => {
	window.removeEventListener('resize', resize)
})

// 生命周期钩子：在组件停用时，移除窗口大小变化事件监听器
onDeactivated(() => {
	window.removeEventListener('resize', resize)
})

// 响应式变量：定义断点、隐藏索引和插槽内容
const breakPoint = ref('xl')
const hiddenIndex = ref(-1)
const slots = useSlots().default()

// 处理屏幕尺寸变化，更新断点值
const resize = e => {
	const width = e.target.innerWidth
	if (width < 768) breakPoint.value = 'xs'
	else if (width >= 768 && width < 992) breakPoint.value = 'sm'
	else if (width >= 992 && width < 1200) breakPoint.value = 'md'
	else if (width >= 1200 && width < 1920) breakPoint.value = 'lg'
	else if (width >= 1920) breakPoint.value = 'xl'
}

// 提供依赖：将 gap、breakPoint 和 shouldHiddenIndex 提供给子组件
provide('gap', Array.isArray(props.gap) ? props.gap[0] : props.gap)
provide('breakPoint', breakPoint)
provide('shouldHiddenIndex', hiddenIndex)

// 计算列数：根据断点返回相应的列数
const cols = computed(() => {
	return typeof props.cols === 'object' ? props.cols[breakPoint.value] || props.cols.xl : props.cols
})
provide('cols', cols)

// 查找需要隐藏的索引：根据 collapsed 和 collapsedRows 计算需要隐藏的 GridItem 索引
const findIndex = () => {
	let fields = []
	let suffix = null

	slots.forEach(slot => {
		if (slot.type?.name === 'GridItem' && slot.props?.suffix) {
			suffix = slot
		}
		if (typeof slot.type === 'symbol' && Array.isArray(slot.children)) {
			slot.children.forEach(child => fields.push(child))
		}
	})

	let suffixCols = 0
	if (suffix) {
		const bp = breakPoint.value
		suffixCols = (suffix.props[bp]?.span || suffix.props?.span || 1) + (suffix.props[bp]?.offset || suffix.props?.offset || 0)
	}

	try {
		let prev = 0
		fields.some((current, index) => {
			const span = current.props[breakPoint.value]?.span || current.props?.span || 1
			const offset = current.props[breakPoint.value]?.offset || current.props?.offset || 0
			prev += span + offset

			if (prev > props.collapsedRows * cols.value - suffixCols) {
				hiddenIndex.value = index
				throw 'Found'
			}
			return false
		})
	} catch (e) {
		// 找到处理
	}
}

// 监听器：当断点变化时，如果 collapsed 为 true，则调用 findIndex 方法
watch(breakPoint, () => props.collapsed && findIndex())

// 监听器：当 collapsed 变化时，如果为 true，则调用 findIndex 方法，否则将 hiddenIndex 设置为 -1
watch(
	() => props.collapsed,
	val => (val ? findIndex() : (hiddenIndex.value = -1))
)

// 计算 gap 值：根据 gap 属性返回相应的 gap 值
const gapValue = computed(() => {
	if (typeof props.gap === 'number') return `${props.gap}px`
	if (Array.isArray(props.gap)) return `${props.gap[1]}px ${props.gap[0]}px`
	return 'unset'
})

// 计算样式：根据 cols 和 gapValue 返回相应的样式对象
const style = computed(() => ({
	display: 'grid',
	gridGap: gapValue.value,
	gridTemplateColumns: `repeat(${cols.value}, minmax(0, 1fr))`
}))

// 暴露 breakPoint 给父组件
defineExpose({ breakPoint })
</script>
