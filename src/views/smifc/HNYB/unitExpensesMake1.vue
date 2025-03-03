<template>
	<div class="table-box">
		<el-tabs v-model="activeKey" @tab-click="tabClick">
			<el-tab-pane :label="item.label" :name="item.value" v-for="(item, index) in tabs" :key="index"></el-tab-pane>
		</el-tabs>
		<v-table ref="proTable" if-index if-select :column="column3" :data="tableData">
			<template #docNum="scope">
				<el-input v-model="scope.row.docNum" placeholder="请填写本次申请资金（万元）" @input="handleTotalAmount(scope.row)"></el-input>
			</template>
			<template #operateState1="scope">
				<el-input v-model="scope.row.operateState1" placeholder="请3输入1"></el-input>
			</template>
			<template #operateState2="scope">
				<el-input v-model="scope.row.operateState2" placeholder="请输入222"></el-input>
			</template>
		</v-table>
	</div>
</template>

<script setup lang="ts" name="medicalSettleApply">
import { ref } from 'vue'
import { unitExpensesMake } from './unitExpensesMake'

const column3: ColumnProps<unitExpensesMake.column3>[] = [
	{ label: '单据号', prop: 'docNum', width: 200 },
	{
		label: '审批状态',
		prop: 'operateState',
		_children: [
			{
				label: '审批状态1',
				prop: 'operateState1',
				width: 200
			},
			{
				label: '审批状态2',
				prop: 'operateState2',
				width: 200
			},
			{
				label: '审批状态3',
				prop: 'operateState3',
				width: 200
			}
		]
	},
	{
		label: '上报状态',
		prop: 'collectFlag',
		width: 200,
		formatter: val => {
			return val['collectFlag'] === '0' ? '未处理' : val['collectFlag'] === '1' ? '待上报' : '已上报'
		}
	},
	{ label: '操作', prop: 'operation', width: 180, align: 'center' }
]

const proTable = ref<InstanceType<typeof VTable>>()
const tableData = ref([
	{ id: 1, docNum: 'Alice', operateState1: 'Charlie51', operateState2: 'Charlie521', operateState3: 'Charlie5211' },
	{ id: 2, docNum: 'Bob', operateState1: 'Charlie52', operateState2: 'Charlie522', operateState3: 'Charlie5212' },
	{ id: 3, docNum: 'Charlie', operateState1: 'Charlie53', operateState2: 'Charlie523', operateState3: 'Charlie5213' }
])
const activeKey = ref('-1')
const tabs = [{ label: '全部', value: '-1' }]

const tabClick = () => {}
const handleTotalAmount = val => {
	console.log(val)
}
</script>
