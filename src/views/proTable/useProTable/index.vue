<template>
	<div class="table-box">
		<v-table ref="proTable" if-index if-select :column="columns" :data="tableData">
			<!-- 表格 header 按钮 -->
			<template #tableHeader="scope">
				<el-button type="primary" :icon="Upload" plain @click="batchDelete" v-auth="'batchAdd'">批量添加用户</el-button>
				<el-button type="primary" :icon="Download" plain @click="downloadFile" v-auth="'export'">导出用户数据</el-button>
				<el-button type="primary" plain @click="toDetail">To 子集详情页面</el-button>
				<el-button type="danger" :icon="Delete" plain @click="batchDelete(scope.selectedIds)" :disabled="!scope.isSelected"> 批量删除用户 </el-button>
				<el-button type="danger" :icon="Delete" plain @click="batchDelete1(scope.selectedRows)" :disabled="!scope.isSelected"> 单选删除用户 </el-button>
				<el-button type="danger" :icon="Delete" plain @click="batchDelete2(scope.selectedIds)" :disabled="!scope.isRadioSelected"> 单选删除id </el-button>
				<el-button type="danger" :icon="Delete" plain @click="batchDelete3(scope.selectedRows)" :disabled="!scope.isRadioSelected"> 单选所有数据 </el-button>
			</template>
			<!-- Expand -->
			<template #expand="scope">
				<el-input v-model="scope.row.username" placeholder="placeholder" />
			</template>
			<!--usernameHeader -->
			<template #usernameHeader="scope">
				<el-button type="primary" @click="ElMessage.success('22我是通过作用域插槽渲染的表头')">
					{{ scope.row.label }}
				</el-button>
			</template>
			<!--createTime -->
			<template #createTime="scope">
				<el-button type="primary" link @click="ElMessage.success('我是通过作用域插槽渲染的内容')">
					{{ scope.row.createTime }}
				</el-button>
			</template>
			<!--表格操作 -->
			<template #operation="scope">
				<el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
				<el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
				<el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button>
				<el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
			</template>
		</v-table>
	</div>
</template>

<script setup name="useProTable">
import { useHandleData } from '@/hooks/useHandleData'
import { useDownload } from '@/hooks/useDownload'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh } from '@element-plus/icons-vue'
import { getUserList, deleteUser, editUser, addUser, changeUserStatus, resetUserPassWord, exportUserInfo, BatchAddUser, getUserStatus, getUserGender } from '@/axios/modules/user'
import { ref } from 'vue'

const router = useRouter()

// 跳转详情页
const toDetail = () => {
	router.push(`/proTable/useProTable/useTreeFilterDetail/${Math.random().toFixed(3)}?params=detail-page`)
}

// 获取 VTable 元素，调用其获取刷新数据方法
const proTable = ref()

// 请求方法
const getTableList = params => {
	let newParams = JSON.parse(JSON.stringify(params))
	newParams.username && (newParams.username = 'custom-' + newParams.username)
	return getUserList(newParams)
}

// 表格配置项
const columns = [
	{
		prop: 'username',
		label: '用户姓名',
		width: 200
	},
	{
		prop: 'gender',
		label: '性别',
		width: 100
	},
	{ prop: 'age', label: '年龄', width: 100 },
	{ prop: 'idCard', label: '身份证号', width: 200 },
	{ prop: 'email', label: '邮箱', width: 200 },
	{ prop: 'address', label: '居住地址', width: 200 },
	{
		prop: 'status',
		label: '用户状态',
		width: 200
	},
	{
		prop: 'createTime',
		label: '创建时间',
		width: 180
	},
	{ prop: 'operation', label: '操作', fixed: 'right', width: 330 }
]
const tableData = ref([])

// 删除用户
const deleteAccount = async params => {
	await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.username}】用户`)
	getTableList()
}

// 批量删除
const batchDelete = async id => {
	await useHandleData(deleteUser, { id }, '删除所选用户信息')
	getTableList()
}

const batchDelete1 = async list => {
	console.log(JSON.parse(JSON.stringify(list)), '3232')
}

const batchDelete2 = async list => {
	console.log(JSON.parse(JSON.stringify(list)), '111')
}

const batchDelete3 = async list => {
	console.log(JSON.parse(JSON.stringify(list)), '222')
}

// 重置密码
const resetPass = async params => {
	await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`)
	getTableList()
}

// 导出数据
const downloadFile = async () => {
	ElMessageBox.confirm('确认导出用户数据?', '温馨提示', { type: 'warning' }).then(() => useDownload(exportUserInfo, '用户列表', searchParam))
}
</script>
