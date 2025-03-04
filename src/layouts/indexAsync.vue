<template>
	<suspense>
		<template #default>
			<component :is="LayoutComponents[layout]" />
		</template>
		<template #fallback>
			<Loading />
		</template>
	</suspense>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useGlobalStore } from '@/stores/modules/global'
import Loading from '@/components/Loading/index.vue'

// 异步加载布局组件
const LayoutComponents = {
	vertical: defineAsyncComponent(() => import('./LayoutVertical/index.vue')),
	classic: defineAsyncComponent(() => import('./LayoutClassic/index.vue')),
	transverse: defineAsyncComponent(() => import('./LayoutTransverse/index.vue')),
	columns: defineAsyncComponent(() => import('./LayoutColumns/index.vue'))
}

const globalStore = useGlobalStore()
const layout = computed(() => globalStore.layout)
</script>

<style scoped lang="scss">
.layout {
	min-width: 730px;
}
</style>
