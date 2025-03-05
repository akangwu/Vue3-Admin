<template>
	<div class="card table-main" :style="{ height: isDialogTable ? height : '' }">
		<div class="table-header">
			<div class="header-button-lf">
				<slot name="tableHeader" />
			</div>
		</div>

		<vxe-grid
			ref="tableRef"
			v-bind="gridOptions"
			:columns="tableColumns"
			:data="data"
			:row-config="{ keyField: rowKey }"
			:border="border"
			@checkbox-change="selectionChange"
			@radio-change="handleRadioChange">

			<!-- 自定义列内容 -->
			<template v-for="item in customSlots" #[item]="scope">
				<slot :name="item" v-bind="scope"></slot>
			</template>

			<!-- 单选列 -->
			<template #radio_default="{ row, rowIndex }">
				<vxe-radio
					:name="templateRadio"
					:label="rowIndex"
					@change="getCurrentRow(row, rowIndex)"></vxe-radio>
			</template>

			<!-- 序号列 -->
			<template #seq_default="{ rowIndex }">
				{{ rowIndex + 1 }}
			</template>

			<!-- 空数据 -->
			<template #empty>
				<div class="table-empty">
					<slot name="empty">
						<img src="@/assets/images/notData.png" alt="notData" />
						<div>暂无数据</div>
					</slot>
				</div>
			</template>
		</vxe-grid>
	</div>
</template>

<script setup>
import { ref, computed, useSlots } from 'vue'

const emit = defineEmits(['singleSelect', 'selectionChange'])

const props = defineProps({
	// 保留原有props配置，部分配置项需要调整
	ifIndex: { type: Boolean, default: false },
	indexName: { type: String, default: '序号' },
	indexWidth: { type: Number, default: 80 },
	isDialogTable: { type: Boolean, default: false },
	height: { type: String, default: '400px' },
	ifSelect: { type: Boolean, default: false },
	ifRadio: { type: Boolean, default: false },
	column: { type: Array, default: () => [] },
	data: { type: Array, default: () => [] },
	rowKey: { type: String, default: 'id' },
	border: { type: [Boolean, String], default: 'full' }
})

const slots = useSlots()
const tableRef = ref(null)
const templateRadio = ref(null)

// 处理列配置
const tableColumns = computed(() => {
	return props.column.map(col => {
		const column = {
			field: col.prop,
			title: col.label,
			width: col.width,
			align: col.align || 'center',
			headerAlign: col.headerAlign || 'center',
			showOverflow: col.showOverflowTooltip ?? true,
			children: col._children,
			slots: {}
		}

		// 处理自定义插槽
		if (col.render || slots[col.prop]) {
			column.slots = { default: col.prop }
		}

		// 处理特殊列类型
		if (col.type === 'selection') {
			column.type = 'checkbox'
			column.width = col.width || 60
		} else if (col.type === 'index') {
			column.type = 'seq'
			column.title = props.indexName
			column.width = props.indexWidth
		}

		return column
	})
})

// 合并grid配置
const gridOptions = computed(() => ({
	height: props.isDialogTable ? props.height : 'auto',
	border: props.border,
	showOverflow: 'tooltip',
	keepSource: true,
	columnConfig: {
		resizable: true
	},
	radioConfig: {
		trigger: 'row'
	},
	checkboxConfig: {
		trigger: 'row',
		highlight: true
	}
}))

// 获取自定义插槽列表
const customSlots = computed(() => {
	return Object.keys(slots).filter(slot => !['empty', 'tableHeader'].includes(slot))
})

// 多选事件
const selectionChange = ({ records }) => {
	emit('selectionChange', records)
}

// 单选事件
const handleRadioChange = ({ row }) => {
	emit('singleSelect', row)
}

// 获取当前行
const getCurrentRow = (row, index) => {
	templateRadio.value = index
	emit('singleSelect', row)
}
</script>

<style lang="scss">
// 适配vxe-table样式
.vxe-table {
	.vxe-header--column {
		background-color: #f8f8f9;
	}

	.vxe-cell {
		padding: 8px 0;
	}
}

.table-empty {
	padding: 20px;
	text-align: center;
	img {
		width: 200px;
	}
}
</style>
