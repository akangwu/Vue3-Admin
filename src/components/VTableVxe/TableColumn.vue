<template>
	<vxe-column
		v-if="column?.isShow"
		v-bind="columnConfig"
		:field="column.prop"
		:title="column.label"
		:children="column._children">
		<template v-if="hasChildren" #default>
			<TableColumn
				v-for="child in column._children"
				:key="child.prop"
				:column="child" />
		</template>

		<template v-if="column.render || $slots[column.prop]" #default="scope">
			<slot v-if="$slots[column.prop]" :name="column.prop" v-bind="scope" />
			<span v-else-if="column.render">{{ column.render(scope) }}</span>
		</template>

		<template #header="scope">
			<slot v-if="$slots[`${column.prop}Header`]" :name="`${column.prop}Header`" v-bind="scope" />
			<span v-else>{{ column.label }}</span>
		</template>
	</vxe-column>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	column: {
		type: Object,
		required: true
	}
})

const hasChildren = computed(() => {
	return props.column._children && props.column._children.length
})

const columnConfig = computed(() => ({
	width: props.column.width,
	align: props.column.align || 'center',
	headerAlign: props.column.headerAlign || 'center',
	showOverflow: props.column.showOverflowTooltip ?? true
}))
</script>
