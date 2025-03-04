<template>
	<el-table-column
		v-if="column?.isShow"
		v-bind="column"
		fit
		:align="column.align ?? 'left'"
		:header-align="column.headerAlign ?? 'center'"
		:show-overflow-tooltip="column.showOverflowTooltip ?? column.prop !== 'operation'"
	>
		<!-- 默认插槽内容 -->
		<template #default="scope">
			<!-- 如果列有子列，则递归渲染子列 -->
			<template v-if="column._children">
				<TableColumn v-for="child in column._children" :key="child.prop" :column="child">
					<template #[child.prop]="childScope">
						<slot :name="child.prop" v-bind="childScope" />
					</template>
				</TableColumn>
			</template>
			<!-- 如果列有自定义渲染函数，则使用该函数渲染内容 -->
			<template v-else-if="column.render">
				{{ column.render(scope) }}
			</template>
			<template v-else-if="$slots[column.prop]">
				<slot :name="column.prop" v-bind="scope" />
			</template>
			<!-- 如果列有 formatter 属性，则直接使用该属性的值 -->
			<template v-else-if="column.formatter">
				{{ column.formatter(scope.row) }}
			</template>
			<!-- 默认情况下，渲染单元格数据 -->
			<template v-else>
				{{ scope.row[column.prop] }}
			</template>
		</template>
		<!-- 表头插槽内容 -->
		<template #header>
			<!-- 如果列有自定义表头渲染函数，则使用该函数渲染表头 -->
			<template v-if="column.headerRender">
				{{ column.headerRender(column) }}
			</template>
			<template v-else-if="$slots[`${column.prop}Header`]">
				<slot :name="`${column.prop}Header`" :row="column"></slot>
			</template>
			<!-- 默认情况下，渲染列的标签 -->
			<template v-else>
				{{ column.label }}
			</template>
		</template>
	</el-table-column>
</template>

<script setup name="TableColumn">
import { useSlots } from 'vue'

// 定义组件的 props，接收一个 ColumnProps 类型的 column 对象
defineProps({
	column: {
		type: Object,
		required: true
	}
})

// 获取作用域插槽
const slots = useSlots()
</script>
