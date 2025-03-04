<template>
	<div class="main-box">
		<TreeFilter title="部门列表(多选)" multiple label="name" :request-api="getUserDepartment" :default-value="treeFilterValues.departmentId" @change="changeTreeFilter" />
		<div class="table-box">
			<div class="card mb10 pt0 pb0">
				<SelectFilter :data="selectFilterData" :default-values="selectFilterValues" @change="changeSelectFilter" />
			</div>
			<v-table ref="proTable" :column="columns">
				<!-- 表格 header 按钮 -->
				<template #tableHeader>
					<el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增用户</el-button>
					<el-button type="primary" :icon="Upload" plain @click="batchAdd">批量添加用户</el-button>
					<el-button type="primary" :icon="Download" plain @click="downloadFile">导出用户数据</el-button>
				</template>
				<!-- 表格操作 -->
				<template #operation="scope">
					<el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
					<el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
					<el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button>
					<el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
				</template>
			</v-table>
		</div>
	</div>
</template>
<script setup name="useSelectFilter">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useHandleData } from '@/hooks/useHandleData'
import TreeFilter from '@/components/TreeFilter/index.vue'
import SelectFilter from '@/components/SelectFilter/index.vue'
import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh } from '@element-plus/icons-vue'
import { getUserList, deleteUser, editUser, addUser, resetUserPassWord, exportUserInfo, BatchAddUser, getUserDepartment, getUserRole } from '@/axios/modules/user'

// 获取 VTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref()

// 表格配置项
const columns = [
	{ type: 'index', label: '#', width: 80 },
	{ prop: 'username', label: '用户姓名', width: 120 },
	{ prop: 'gender', label: '性别', width: 120 },
	{ prop: 'idCard', label: '身份证号' },
	{ prop: 'email', label: '邮箱' },
	{ prop: 'address', label: '居住地址' },
	{ prop: 'status', label: '用户状态', width: 120 },
	{ prop: 'createTime', label: '创建时间', width: 180 },
	{ prop: 'operation', label: '操作', width: 330, fixed: 'right' }
]

// useProTableSelectFilter 数据（用户角色为后台数据）
const selectFilterData = reactive([
	{
		title: '用户状态(单)',
		options: [
			{
				label: '全部',
				value: ''
			},
			{
				label: '在职',
				value: '1',
				icon: 'User'
			},
			{
				label: '待培训',
				value: '2',
				icon: 'Bell'
			},
			{
				label: '待上岗',
				value: '3',
				icon: 'Clock'
			},
			{
				label: '已离职',
				value: '4',
				icon: 'CircleClose'
			},
			{
				label: '已退休',
				value: '5',
				icon: 'CircleCheck'
			}
		]
	},
	{
		title: '用户角色(多)',
		key: 'userRole',
		multiple: true,
		options: []
	}
])

// 获取用户角色字典
onMounted(() => getUserRoleDict())
const getUserRoleDict = async () => {
	const { data } = await getUserRole()
	selectFilterData[1].options = data
}

// 默认 useProTableSelectFilter 参数
const selectFilterValues = ref({ userStatus: '2', userRole: ['1', '3'] })
const changeSelectFilter = value => {
	ElMessage.success('请注意查看请求参数变化 🤔')
	selectFilterValues.value = value
}

// 默认 useProTableTreeFilter 参数
const treeFilterValues = reactive({ departmentId: ['11'] })
const changeTreeFilter = val => {
	ElMessage.success('请注意查看请求参数变化')
	treeFilterValues.departmentId = val
}
const getTableList = () => {}
// 删除用户信息
const deleteAccount = async params => {
	await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.username}】用户`)

	getTableList()
}

// 重置用户密码
const resetPass = async params => {
	await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`)
	getTableList()
}
</script>
