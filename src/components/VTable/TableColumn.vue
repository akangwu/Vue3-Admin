<template>
	<!-- 渲染 el-table-column 组件，根据 column.isShow 决定是否显示 -->
	<el-table-column
		v-if="column.isShow"
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
					<template v-if="$slots[child.prop]" #[child.prop]="childScope">
						<slot :name="child.prop" v-bind="childScope" />
					</template>
					<!-- 如果子列没有插槽，则显示数据 -->
					<template v-if="!$slots[child.prop]">
						{{ childScope.row[child.prop] }}
					</template>
				</TableColumn>
			</template>
			<!-- 如果列有自定义渲染函数，则使用该函数渲染内容 -->
			<template v-else-if="column.render">
				{{ column.render(scope) }}
			</template>
			<!-- 如果列有作用域插槽，则使用该插槽渲染内容 -->
			<template v-else-if="slots[column.prop]">
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
			<!-- 如果列有作用域插槽，则使用该插槽渲染表头 -->
			<template v-else-if="slots[`${column.prop}Header`]">
				<slot :name="`${column.prop}Header`" :row="column"></slot>
			</template>
			<!-- 默认情况下，渲染列的标签 -->
			<template v-else>
				{{ column.label }}
			</template>
		</template>
	</el-table-column>
</template>

<script setup>
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
