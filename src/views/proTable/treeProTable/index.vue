<template>
	<div class="main-box">
		<TreeFilter label="name" title="部门列表(单选)" :data="treeFilterData" @change="changeTreeFilter" />
		<div class="table-box">
			<v-table
				ref="proTable"
				title="用户列表"
				row-key="id"
				:column="columns"
			>
				<!-- 表格操作 -->
				<template #operation="scope">
					<el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
				</template>
			</v-table>
		</div>
	</div>
</template>

<script setup lang="tsx" name="treeProTable">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { useHandleData } from '@/hooks/useHandleData'
import { genderType } from '@/utils/serviceDict'
import TreeFilter from '@/components/TreeFilter/index.vue'
import { Delete } from '@element-plus/icons-vue'
import { getUserTreeList, deleteUser, editUser, addUser, getUserStatus, getUserDepartment } from '@/axios/modules/user'

onMounted(() => {
	/*getTreeFilter()
	ElNotification({
		title: '温馨提示',
		message: '该页面 VTable 数据不会自动请求，需等待 useProTableTreeFilter 数据请求完成之后，才会触发表格请求。',
		type: 'info',
		duration: 10000
	})
	setTimeout(() => {
		ElNotification({
			title: '温馨提示',
			message: '该页面 VTable 性别搜索框为远程数据搜索，详情可查看代码。',
			type: 'info',
			duration: 10000
		})
	}, 0)*/
})

// 获取 VTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref()

// 如果表格需要初始化请求参数，直接定义传给 VTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ departmentId: '' })

// 获取 useProTableTreeFilter 数据
// 当 proTable 的 requestAuto 属性为 false，不会自动请求表格数据，等待 useProTableTreeFilter 数据回来之后，更改 initParam.departmentId 的值，才会触发请求 proTable 数据
const treeFilterData = ref([])
const getTreeFilter = async () => {
	const { data } = await getUserDepartment()
	treeFilterData.value = data
	initParam.departmentId = treeFilterData.value[1].id
}

// 树形筛选切换
const changeTreeFilter = (val) => {
	ElMessage.success('请注意查看请求参数变化 🤔')
	proTable.value.pageable.pageNum = 1
	initParam.departmentId = val
}

// 模拟远程加载性别搜索框数据
const loading = ref(false)
const filterGenderEnum = ref([])
const remoteMethod = (query) => {
	filterGenderEnum.value.length = 0
	if (!query) return
	loading.value = true
	setTimeout(() => {
		loading.value = false
		filterGenderEnum.value.push(...genderType.filter(item => item.label.includes(query)))
	}, 500)
}

// 表格配置项
const columns = [
	{ type: 'index', label: '#', width: 80 },
	{ prop: 'username', label: '用户姓名' },
	{
		prop: 'gender',
		label: '性别'
	},
	{ prop: 'idCard', label: '身份证号' },
	{ prop: 'email', label: '邮箱' },
	{ prop: 'address', label: '居住地址' },
	{
		prop: 'status',
		label: '用户状态'
	},
	{ prop: 'createTime', label: '创建时间', width: 180 },
	{ prop: 'operation', label: '操作', width: 300, fixed: 'right' }
]

// 删除用户信息
const deleteAccount = async (params) => {
	await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.username}】用户`)
	proTable.value.getTableList()
}

</script>
