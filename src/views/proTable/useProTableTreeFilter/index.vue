<!--<template>-->
<!--	<div class="main-box">-->
<!--		<TreeFilter label="name" title="部门列表(单选)" :request-api="getUserDepartment" :default-value="initParam.departmentId" @change="changeTreeFilter" />-->
<!--		<div class="table-box">-->
<!--			<v-table ref="proTable" title="用户列表" :columns="columns" :request-api="getUserList" :init-param="initParam" :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }">-->
<!--				&lt;!&ndash; 表格 header 按钮 &ndash;&gt;-->
<!--				<template #tableHeader>-->
<!--					<el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增用户</el-button>-->
<!--					<el-button type="primary" :icon="Upload" plain @click="batchAdd">批量添加用户</el-button>-->
<!--					<el-button type="primary" :icon="Download" plain @click="downloadFile">导出用户数据</el-button>-->
<!--					<el-button type="primary" plain @click="toDetail">To 平级详情页面</el-button>-->
<!--				</template>-->
<!--				&lt;!&ndash; 表格操作 &ndash;&gt;-->
<!--				<template #operation="scope">-->
<!--					<el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>-->
<!--					<el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>-->
<!--					<el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button>-->
<!--					<el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>-->
<!--				</template>-->
<!--			</v-table>-->
<!--			<UserDrawer ref="drawerRef" />-->
<!--			<ImportExcel ref="dialogRef" />-->
<!--		</div>-->
<!--	</div>-->
<!--</template>-->
<!--<script setup name="useTreeFilter">-->
<!--import { ref, reactive } from 'vue'-->
<!--import { User } from '@/axios/interface'-->
<!--import { useRouter } from 'vue-router'-->
<!--import { ElMessage, ElMessageBox } from 'element-plus'-->
<!--import { ColumnProps } from '@/components/VTable/interface'-->
<!--import { useHandleData } from '@/hooks/useHandleData'-->
<!--import { useDownload } from '@/hooks/useDownload'-->
<!--import TreeFilter from '@/components/TreeFilter/index.vue'-->
<!--import ImportExcel from '@/components/ImportExcel/index.vue'-->
<!--import UserDrawer from '@/views/proTable/components/UserDrawer.vue'-->
<!--import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh } from '@element-plus/icons-vue'-->
<!--import { getUserList, deleteUser, editUser, addUser, resetUserPassWord, exportUserInfo, BatchAddUser, getUserStatus, getUserGender, getUserDepartment } from '@/axios/modules/user'-->

<!--const router = useRouter()-->

<!--// 跳转详情页-->
<!--const toDetail = () => {-->
<!--	router.push(`/proTable/useTreeFilter/treeFilterDetail/123456?params=detail-page`)-->
<!--}-->

<!--// 获取 VTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）-->
<!--const proTable = ref()-->

<!--// 如果表格需要初始化请求参数，直接定义传给 VTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)-->
<!--const initParam = reactive({ departmentId: '1' })-->

<!--// 树形筛选切换-->
<!--const changeTreeFilter = (val: string) => {-->
<!--	ElMessage.success('请注意查看请求参数变化 🤔')-->
<!--	proTable.value.pageable.pageNum = 1-->
<!--	initParam.departmentId = val-->
<!--}-->

<!--// 表格配置项-->
<!--const columns: ColumnProps<User.ResUserList>[] = [-->
<!--	{ type: 'index', label: '#', width: 80 },-->
<!--	{ prop: 'username', label: '用户姓名', width: 120, search: { el: 'input' } },-->
<!--	{-->
<!--		prop: 'gender',-->
<!--		label: '性别',-->
<!--		width: 120,-->
<!--		sortable: true,-->
<!--		enum: getUserGender,-->
<!--		search: { el: 'select' },-->
<!--		fieldNames: { label: 'genderLabel', value: 'genderValue' }-->
<!--	},-->
<!--	{ prop: 'idCard', label: '身份证号' },-->
<!--	{ prop: 'email', label: '邮箱' },-->
<!--	{ prop: 'address', label: '居住地址' },-->
<!--	{-->
<!--		prop: 'status',-->
<!--		label: '用户状态',-->
<!--		width: 120,-->
<!--		sortable: true,-->
<!--		tag: true,-->
<!--		enum: getUserStatus,-->
<!--		search: { el: 'select' },-->
<!--		fieldNames: { label: 'userLabel', value: 'userStatus' }-->
<!--	},-->
<!--	{ prop: 'createTime', label: '创建时间', width: 180 },-->
<!--	{ prop: 'operation', label: '操作', width: 330, fixed: 'right' }-->
<!--]-->

<!--// 删除用户信息-->
<!--const deleteAccount = async (params: User.ResUserList) => {-->
<!--	await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.username}】用户`)-->
<!--	proTable.value.getTableList()-->
<!--}-->

<!--// 重置用户密码-->
<!--const resetPass = async (params: User.ResUserList) => {-->
<!--	await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`)-->
<!--	proTable.value.getTableList()-->
<!--}-->

<!--// 导出用户列表-->
<!--const downloadFile = async () => {-->
<!--	ElMessageBox.confirm('确认导出用户数据?', '温馨提示', { type: 'warning' }).then(() => useDownload(exportUserInfo, '用户列表', proTable.value.searchParam))-->
<!--}-->

<!--// 批量添加用户-->
<!--const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null)-->
<!--const batchAdd = () => {-->
<!--	const params = {-->
<!--		title: '用户',-->
<!--		tempApi: exportUserInfo,-->
<!--		importApi: BatchAddUser,-->
<!--		getTableList: proTable.value.getTableList-->
<!--	}-->
<!--	dialogRef.value?.acceptParams(params)-->
<!--}-->

<!--// 打开 drawer(新增、查看、编辑)-->
<!--const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null)-->
<!--const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {-->
<!--	const params = {-->
<!--		title,-->
<!--		isView: title === '查看',-->
<!--		row: { ...row },-->
<!--		api: title === '新增' ? addUser : title === '编辑' ? editUser : undefined,-->
<!--		getTableList: proTable.value.getTableList-->
<!--	}-->
<!--	drawerRef.value?.acceptParams(params)-->
<!--}-->
<!--</script>-->
