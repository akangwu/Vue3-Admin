<template>
	<!-- 表格内容 card -->
	<div class="card table-main" :style="{ height: isDialogTable ? height : '' }">
		<!-- 表格头部 操作按钮 -->
		<div class="table-header">
			<div class="header-button-lf">
				<slot name="tableHeader" />
			</div>
		</div>
		<!-- 表格主体 -->
		<el-table ref="tableRef" v-bind="$attrs" :data="data" :border="border" :row-key="rowKey" stripe fit @selection-change="selectionChange">
			<!-- 默认插槽 -->
			<slot />
			<!-- 多选 -->
			<el-table-column align="center" type="selection" v-if="ifSelect" />
			<!-- 单选 -->
			<el-table-column label="" align="center" width="50" v-if="ifRadio" fixed="left">
				<template #default="scope">
					<el-radio :label="scope.$index" v-model="templateRadio" @click.stop.prevent="getCurrentRow(scope.row, scope.$index)"></el-radio>
				</template>
			</el-table-column>
			<!-- 序号 -->
			<el-table-column align="center" v-if="ifIndex" :label="indexName" :width="indexWidth">
				<template #default="scope">
					{{ scope.$index + 1 }}
				</template>
			</el-table-column>

			<template v-for="item in tableColumns" :key="item.prop">
				<!-- 渲染多级表头 -->
				<el-table-column
					v-bind="item"
					:align="item.align ?? 'center'"
					:header-align="item.headerAlign ?? 'center'"
					:show-overflow-tooltip="item.showOverflowTooltip ?? item.prop !== 'operation'"
				>
					<template #default="scope">
						<!-- 如果列有子列，则递归渲染子列 -->
						<template v-if="item._children && item._children.length">
							<TableColumn v-for="child in item._children" :key="child.prop" :column="child">
								<template #[child.prop]="childScope">
									<slot :name="child.prop" v-bind="childScope" />
								</template>
							</TableColumn>
						</template>
						<!-- 如果列有自定义渲染函数，则使用该函数渲染内容 -->
						<template v-else-if="item.render">
							{{ item.render(scope) }}
						</template>
						<!-- 如果列有作用域插槽，则使用该插槽渲染内容 -->
						<template v-else-if="$slots[item.prop]">
							<slot :name="item.prop" v-bind="scope" />
						</template>
						<!-- 如果列有 formatter 属性，则直接使用该属性的值 -->
						<template v-else-if="item.formatter">
							{{ item.formatter(scope.row) }}
						</template>
						<!-- 默认情况下，渲染单元格数据 -->
						<template v-else>
							{{ scope.row[item.prop] }}
						</template>
					</template>
					<!-- 表头插槽内容 -->
					<template #header>
						<!-- 如果列有自定义表头渲染函数，则使用该函数渲染表头 -->
						<template v-if="item.headerRender">
							{{ item.headerRender(item) }}
						</template>
						<!-- 如果列有作用域插槽，则使用该插槽渲染表头 -->
						<template v-else-if="$slots[`${item.prop}Header`]">
							<slot :name="`${item.prop}Header`" :row="item"></slot>
						</template>
						<!-- 默认情况下，渲染列的标签 -->
						<template v-else>
							{{ item.label }}
						</template>
					</template>
				</el-table-column>
			</template>

			<!-- 插入表格最后一行之后的插槽 -->
			<template #append>
				<slot name="append" />
			</template>
			<!-- 表格无数据情况 -->
			<template #empty>
				<div class="table-empty">
					<slot name="empty">
						<img src="@/assets/images/notData.png" alt="notData" />
						<div>暂无数据</div>
					</slot>
				</div>
			</template>
		</el-table>
	</div>
</template>

<script setup name="VTable">
import { ref, watch } from 'vue'

const emit = defineEmits(['singleSelect', 'selectionChange'])

// 接受父组件参数，配置默认值
const props = defineProps({
	ifIndex: {
		type: Boolean,
		default: false
	},
	indexName: {
		type: String,
		default: '序号'
	},
	indexWidth: {
		type: Number,
		default: 80
	},
	isDialogTable: {
		type: Boolean,
		default: false
	},
	height: {
		type: String,
		default: '400px'
	},
	ifSelect: {
		type: Boolean,
		default: false
	},
	ifRadio: {
		type: Boolean,
		default: false
	},
	column: {
		type: Array,
		default: () => []
	},
	data: {
		type: Array,
		default: () => []
	},
	requestAuto: {
		type: Boolean,
		default: true
	},
	requestError: {
		type: Object,
		default: null
	},
	dataCallback: {
		type: Function,
		default: null
	},
	formatter: {
		type: Function,
		default: () => {}
	},
	title: {
		type: String,
		default: null
	},
	initParam: {
		type: Object,
		default: () => ({})
	},
	border: {
		type: Boolean,
		default: true
	},
	rowKey: {
		type: String,
		default: 'id'
	}
})

// 接收 column 并设置为响应式
const tableColumns = ref(props.column)

// 扁平化 column
const flatColumnsFunc = (column, flatArr = []) => {
	column.forEach(col => {
		if (col._children && col._children.length) {
			flatArr.push(...flatColumnsFunc(col._children, flatArr))
		}
		flatArr.push(col)

		// 给每一项 column 添加 isShow && isFilterEnum 默认属性
		col.isShow = col.isShow !== undefined ? col.isShow : true
		col.isFilterEnum = col.isFilterEnum !== undefined ? col.isFilterEnum : true
	})
	return flatArr.filter(item => !item._children || !item._children.length)
}

// flatColumns
const flatColumns = ref()
flatColumns.value = flatColumnsFunc(props.column)

/**
 * @description 多选操作
 * @return void
 */
const selectionChange = rowArr => {
	emit('selectionChange', JSON.parse(JSON.stringify(rowArr)))
}

/* 单选 */
const templateRadio = ref()
const getCurrentRow = (row, index) => {
	let data = []
	if (templateRadio.value === index) {
		templateRadio.value = 9999
		data = []
	} else {
		templateRadio.value = index
		data = JSON.parse(JSON.stringify(row))
	}
	emit('singleSelect', data)
}

// 监听 column 属性的变化，来更新 el-table 的表头
watch(
	() => props.column,
	newColumns => {
		tableColumns.value = newColumns
		flatColumns.value = flatColumnsFunc(newColumns)
	},
	{ deep: true }
)
</script>

<style lang="scss" scoped>
:deep(.el-table) {
	.el-radio__label {
		display: none;
		padding: 0;
	}
}
</style>
