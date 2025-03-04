<template>
	<!-- 动态渲染布局组件 -->
	<component :is="LayoutComponents[layout]" />
</template>

<script setup>
import { computed } from 'vue'
import { useGlobalStore } from '@/stores/modules/global'
import LayoutVertical from './LayoutVertical/index.vue'
import LayoutClassic from './LayoutClassic/index.vue'
import LayoutTransverse from './LayoutTransverse/index.vue'
import LayoutColumns from './LayoutColumns/index.vue'

// 定义布局组件映射
const LayoutComponents = {
	vertical: LayoutVertical,
	classic: LayoutClassic,
	transverse: LayoutTransverse,
	columns: LayoutColumns
}

// 获取全局状态
const globalStore = useGlobalStore()
// 计算当前布局
const layout = computed(() => globalStore.layout)
</script>

<style scoped lang="scss">
.layout {
	min-width: 730px;
}
</style>
