<template>
	<div :style="style" v-show="isShow">
		<slot />
	</div>
</template>

<script setup>
import { computed, inject, ref, useAttrs, watch } from 'vue'

const props = defineProps({
	offset: { type: Number, default: 0 }, // 栅格左侧的间隔格数
	span: { type: Number, default: 1 }, // 栅格占据的列数
	suffix: { type: Boolean, default: false }, // 是否从栅格的右侧开始偏移
	hide: { type: Boolean, default: false }, // 是否隐藏栅格项
	xs: { type: Object, default: null }, // 超小屏幕下的响应式配置
	sm: { type: Object, default: null }, // 小屏幕下的响应式配置
	md: { type: Object, default: null }, // 中等屏幕下的响应式配置
	lg: { type: Object, default: null }, // 大屏幕下的响应式配置
	xl: { type: Object, default: null } // 超大屏幕下的响应式配置
})

const attrs = useAttrs()
const isShow = ref(true) // 控制栅格项是否显示

// 注入依赖
const breakPoint = inject('breakPoint', ref('xl')) // 当前断点
const shouldHiddenIndex = inject('shouldHiddenIndex', ref(-1)) // 隐藏的栅格项索引
const gap = inject('gap', 0) // 栅格项之间的间隔
const cols = inject('cols', ref(4)) // 栅格列数

// 显示控制
watch(
	[shouldHiddenIndex, breakPoint],
	([newIndex]) => {
		if (attrs.index !== undefined) {
			isShow.value = !(newIndex !== -1 && parseInt(attrs.index) >= newIndex) // 根据索引和断点控制显示
		}
	},
	{ immediate: true }
)

// 样式计算
const style = computed(() => {
	const bp = breakPoint.value // 当前断点
	const responsive = props[bp] || {} // 获取响应式配置
	const span = responsive.span || props.span // 获取栅格占据的列数
	const offset = responsive.offset || props.offset // 获取栅格左侧的间隔格数

	if (props.suffix) {
		return {
			gridColumnStart: cols.value - span - offset + 1, // 计算栅格项的起始位置
			gridColumnEnd: `span ${span + offset}`, // 计算栅格项的结束位置
			marginLeft: offset ? `calc(((100% + ${gap}px) / ${span + offset} * ${offset})` : 'unset' // 计算左侧间隔
		}
	}

	return {
		gridColumn: `span ${Math.min(span + offset, cols.value)} / span ${Math.min(span + offset, cols.value)}`, // 计算栅格项的列范围
		display: props.hide ? 'none' : '', // 控制栅格项是否隐藏
		marginLeft: offset ? `calc(((100% + ${gap}px) / ${span + offset} * ${offset})` : 'unset' // 计算左侧间隔
	}
})
</script>
