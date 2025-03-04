<template>
	<el-pagination
		background
		v-model:page-size="paginationData.pageSize"
		:page-sizes="[50, 100, 200, 500]"
		:total="total"
		layout="total, sizes, prev, pager, next, jumper"
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
	/>
</template>

<script setup>
import { reactive } from 'vue' // 引入 reactive 函数用于创建响应式数据

const emit = defineEmits(['getData', 'update:pageSize', 'update:pageNum']) // 定义组件可以触发的事件
const props = defineProps({
	pageSize: {
		type: Number, // 每页显示条数的类型为数字
		default: 50 // 默认每页显示50条
	},
	pageNum: {
		type: Number, // 当前页码的类型为数字
		default: 1 // 默认当前页码为1
	},
	total: {
		type: Number, // 总条数的类型为数字
		default: 0 // 默认总条数为0
	}
})
let paginationData = reactive({
	pageSize: props.pageSize, // 响应式数据，当前每页显示条数
	pageNum: props.pageNum, // 响应式数据，当前页码
	total: props.total // 响应式数据，总条数
})
/**
 * @description 每页条数改变时的处理函数
 * @param {Number} val 当前选择的每页显示条数
 * @return void
 */
const handleSizeChange = val => {
	emit('update:pageSize', val) // 触发更新每页显示条数的事件
	paginationData.pageSize = val // 更新响应式数据中的每页显示条数
	emit('getData', paginationData) // 触发获取数据的事件
}
/**
 * @description 当前页改变时的处理函数
 * @param {Number} val 当前选择的页码
 * @return void
 */
const handleCurrentChange = val => {
	emit('update:pageNum', val) // 触发更新当前页码的事件
	paginationData.pageNum = val // 更新响应式数据中的当前页码
	emit('getData', paginationData) // 触发获取数据的事件
}
</script>
<style lang="scss" scoped>
.el-pagination {
	font-weight: 400;
	color: #333333;
}

.el-pagination .el-input__inner {
	border: 1px solid #888888;
}

.el-pagination.is-background .el-pager li,
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev {
	margin: 0;
	color: #333333;
	background-color: #ffffff;
	border: 1px solid #888888;
	border-radius: 0;
}

.el-pagination.is-background .el-pager li,
.el-pagination.is-background .btn-prev {
	border-right: 0;
}
</style>
