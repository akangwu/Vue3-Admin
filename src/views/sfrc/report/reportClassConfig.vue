<!--<template>-->
<!--	<div class="table-box">-->
<!--		<v-table ref="table" if-index :column="column" :data="tableData">-->
<!--			<template #tableHeader>-->
<!--				<el-button type="primary" @click="addData('add')">新增</el-button>-->
<!--			</template>-->
<!--			<template #operation="scope">-->
<!--				<span class="btn-table" @click="watchMx(scope.row, 'watch')">查看明细</span>-->
<!--				<span class="btn-table" @click="watchMx(scope.row, 'edit')">编辑</span>-->
<!--				<span class="btn-table" @click="delData(scope.row)">删除</span>-->
<!--			</template>-->
<!--		</v-table>-->
<!--		<v-pages ref="pages" @get-data="getData" :total="paginationData.total" v-model:pageNum="paginationData.pageNum" v-model:pageSize="paginationData.pageSize" />-->

<!--		&lt;!&ndash;新增&ndash;&gt;-->
<!--		<el-dialog v-model="visibleAdd" :title="saveType === 'add' ? '新增' : saveType === 'edit' ? '编辑' : '查看明细'" width="40%" class="dialog-form" v-if="visibleAdd">-->
<!--			<el-form ref="formAddRef" :model="formDataAdd" :rules="rules" label-width="150px">-->
<!--				<Grid ref="gridRef" :gap="[20, 0]" :cols="1">-->
<!--					<GridItem>-->
<!--						<el-form-item label="分类名称：" prop="categoryName">-->
<!--							<el-input v-model="formDataAdd.categoryName" clearable placeholder="请输入分类名称" :disabled="saveType === 'watch'" @blur="getCodeByName"></el-input>-->
<!--						</el-form-item>-->
<!--					</GridItem>-->
<!--					<GridItem>-->
<!--						<el-form-item label="分类编号：" prop="categoryCode">-->
<!--							<el-input v-model="formDataAdd.categoryCode" clearable placeholder="请输入分类编号" :disabled="saveType !== 'add'"></el-input>-->
<!--						</el-form-item>-->
<!--					</GridItem>-->
<!--					<GridItem>-->
<!--						<el-form-item label="任务编码：" prop="taskCode">-->
<!--							<el-input v-model="formDataAdd.taskCode" clearable placeholder="请输入任务编码" :disabled="saveType === 'watch'"></el-input>-->
<!--						</el-form-item>-->
<!--					</GridItem>-->
<!--					<GridItem>-->
<!--						<el-form-item label="报表编码：" prop="reportCode">-->
<!--							<el-input v-model="formDataAdd.reportCode" clearable placeholder="请输入报表编码" :disabled="saveType === 'watch'"></el-input>-->
<!--						</el-form-item>-->
<!--					</GridItem>-->
<!--					<GridItem>-->
<!--						<el-form-item label="期间分类：" prop="periodTypeCode">-->
<!--							<el-select v-model="formDataAdd.periodTypeCode" placeholder="请选择期间分类" :disabled="saveType !== 'add'">-->
<!--								<el-option v-for="(item, index) in periodTypeList" :label="item.name" :value="item.code" :key="index"></el-option>-->
<!--							</el-select>-->
<!--						</el-form-item>-->
<!--					</GridItem>-->
<!--				</Grid>-->
<!--			</el-form>-->
<!--			<template #footer>-->
<!--				<span class="dialog-footer">-->
<!--					<el-button type="primary" v-if="saveType !== 'watch'" @click="saveData">保存</el-button>-->
<!--					<el-button @click="visibleAdd = false">{{ saveType !== 'watch' ? '取消' : '关闭' }}</el-button>-->
<!--				</span>-->
<!--			</template>-->
<!--		</el-dialog>-->
<!--	</div>-->
<!--</template>-->
<!--<script setup name="reportClassConfig">-->
<!--import GridItem from '@/components/Grid/components/GridItem.vue'-->
<!--import Grid from '@/components/Grid/index.vue'-->
<!--import VTable from '@/components/VTable/index.vue'-->
<!--import { FormInstance, FormRules } from 'element-plus'-->
<!--import { ref, reactive, onMounted, toRaw } from 'vue'-->
<!--const { proxy } = getCurrentInstance()-->

<!--/* 列表 */-->
<!--const column = [-->
<!--	{-->
<!--		label: '分类编号',-->
<!--		prop: 'categoryCode',-->
<!--		width: 150-->
<!--	},-->
<!--	{-->
<!--		label: '分类名称',-->
<!--		prop: 'categoryName',-->
<!--		width: 200-->
<!--	},-->
<!--	{-->
<!--		label: '任务编码',-->
<!--		prop: 'taskCode',-->
<!--		width: 200-->
<!--	},-->
<!--	{-->
<!--		label: '报表编码',-->
<!--		prop: 'reportCode',-->
<!--		width: 200-->
<!--	},-->
<!--	{-->
<!--		label: '期间分类',-->
<!--		prop: 'periodTypeCode',-->
<!--		width: 120-->
<!--	},-->
<!--	{-->
<!--		label: '操作',-->
<!--		prop: 'operation',-->
<!--		width: 180,-->
<!--		align: 'center',-->
<!--		fixed: 'right',-->
<!--		operate: true-->
<!--	}-->
<!--]-->
<!--const tableData = ref([])-->
<!--const paginationData = reactive({-->
<!--	total: 0,-->
<!--	pageSize: 50,-->
<!--	pageNum: 1-->
<!--})-->
<!--const getData = async () => {-->
<!--	const params = {-->
<!--		businessModule: 'REPORT',-->
<!--		pageSize: paginationData.pageSize,-->
<!--		pageNum: paginationData.pageNum-->
<!--	}-->

<!--	const { code, data, msg } = await proxy.axios.post('/sfrc/api/reportCategory/pageList', params)-->
<!--	if (code === 0) {-->
<!--		tableData.value = data.rows-->
<!--		paginationData.total = data.total-->
<!--	} else {-->
<!--		paginationData.total = 0-->
<!--		proxy.msg({ type: 'error', message: msg })-->
<!--	}-->
<!--}-->

<!--/* 新增 */-->
<!--const visibleAdd = ref(false)-->
<!--const saveType = ref('add')-->
<!--const addData = type => {-->
<!--	saveType.value = type-->
<!--	visibleAdd.value = true-->
<!--	formDataAdd.value = {-->
<!--		categoryCode: '',-->
<!--		categoryName: '',-->
<!--		taskCode: '',-->
<!--		reportCode: '',-->
<!--		periodTypeCode: '',-->
<!--		businessModule: 'REPORT'-->
<!--	}-->
<!--	setTimeout(() => {-->
<!--		formAddRef.value.clearValidate()-->
<!--	}, 0)-->
<!--}-->

<!--const formDataAdd = ref({-->
<!--	categoryCode: '',-->
<!--	categoryName: '',-->
<!--	taskCode: '',-->
<!--	reportCode: '',-->
<!--	periodTypeCode: '',-->
<!--	businessModule: 'REPORT'-->
<!--})-->

<!--const formAddRef = ref<FormInstance>()-->
<!--const rules = reactive<FormRules<typeof formDataAdd>>({-->
<!--	categoryCode: [-->
<!--		{-->
<!--			required: true,-->
<!--			message: '请输入分类编号',-->
<!--			trigger: 'blur'-->
<!--		}-->
<!--	],-->
<!--	categoryName: [-->
<!--		{-->
<!--			required: true,-->
<!--			message: '请输入分类名称',-->
<!--			trigger: 'blur'-->
<!--		}-->
<!--	],-->
<!--	taskCode: [-->
<!--		{-->
<!--			required: true,-->
<!--			message: '请输入任务编码',-->
<!--			trigger: 'blur'-->
<!--		}-->
<!--	],-->
<!--	reportCode: [-->
<!--		{-->
<!--			required: true,-->
<!--			message: '请输入报表编码',-->
<!--			trigger: 'blur'-->
<!--		}-->
<!--	],-->
<!--	periodTypeCode: [-->
<!--		{-->
<!--			required: true,-->
<!--			message: '请选择期间分类',-->
<!--			trigger: 'change'-->
<!--		}-->
<!--	]-->
<!--})-->

<!--const periodTypeList = [-->
<!--	{-->
<!--		name: '年度',-->
<!--		code: 'YEAR'-->
<!--	},-->
<!--	{-->
<!--		name: '季度',-->
<!--		code: 'QUARTER'-->
<!--	},-->
<!--	{-->
<!--		name: '月度',-->
<!--		code: 'MONTH'-->
<!--	}-->
<!--]-->

<!--const getCodeByName = async () => {-->
<!--	if (formDataAdd.value.categoryName) {-->
<!--		const params = {-->
<!--			businessModule: 'REPORT',-->
<!--			type: 'REPORT_CATEGORY',-->
<!--			chineseName: formDataAdd.value.categoryName-->
<!--		}-->
<!--		const { code, data, msg } = await proxy.axios.post('/sfrc/common/getCodeByName', params)-->
<!--		if (code === 0) {-->
<!--			formDataAdd.value.categoryCode = data.code-->
<!--		} else {-->
<!--			formDataAdd.value.categoryCode = ''-->
<!--			proxy.msg({ type: 'error', message: msg })-->
<!--		}-->
<!--	}-->
<!--}-->

<!--const saveData = async () => {-->
<!--	formAddRef.value.validate(async valid => {-->
<!--		if (!valid) return-->
<!--		const params = JSON.parse(JSON.stringify(toRaw(formDataAdd.value)))-->
<!--		if (saveType.value === 'add') {-->
<!--			params.comparisonItemDetailList = [-->
<!--				{-->
<!--					detailCode: formDataAdd.value.detailCode,-->
<!--					detailName: formDataAdd.value.detailName-->
<!--				}-->
<!--			]-->
<!--		}-->
<!--		const { code, msg } = await proxy.axios.post(saveType.value === 'add' ? '/sfrc/api/reportCategory/save' : '/sfrc/api/reportCategory/update', params)-->
<!--		proxy.msg({ type: code === 0 ? 'success' : 'error', message: msg })-->
<!--		if (code === 0) {-->
<!--			visibleAdd.value = false-->
<!--			await getData()-->
<!--		}-->
<!--	})-->
<!--}-->
<!--/* 查看明细 */-->
<!--const watchMx = async (row, type: string) => {-->
<!--	visibleAdd.value = true-->
<!--	saveType.value = type-->
<!--	const { code, data, msg } = await proxy.axios.get(`/sfrc/api/reportCategory/queryById/${row.id}`)-->
<!--	if (code === 0) {-->
<!--		formDataAdd.value = data-->
<!--	} else {-->
<!--		proxy.msg({ type: 'error', message: msg })-->
<!--	}-->
<!--	setTimeout(() => {-->
<!--		formAddRef.value.clearValidate()-->
<!--	}, 0)-->
<!--}-->

<!--const delData = row => {-->
<!--	proxy.msgConfirm-->
<!--		.confirm('确定删除吗？', '温馨提示', {-->
<!--			confirmButtonText: '确定',-->
<!--			cancelButtonText: '取消',-->
<!--			type: 'warning'-->
<!--		})-->
<!--		.then(async () => {-->
<!--			const { code, msg } = await proxy.axios.get(`/sfrc/api/reportCategory/deleteById/${row.id}`)-->
<!--			if (code === 0) {-->
<!--				await getData()-->
<!--				proxy.msg({ type: 'success', message: msg })-->
<!--			} else {-->
<!--				proxy.msg({ type: 'error', message: msg })-->
<!--			}-->
<!--		})-->
<!--		.catch(() => {})-->
<!--}-->

<!--onMounted(() => {-->
<!--	getData()-->
<!--})-->
<!--</script>-->
