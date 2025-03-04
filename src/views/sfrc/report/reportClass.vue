<template>
	<div class="table-box">
		<v-search :form-items="formItems" :form-data="formData" @get-data="getData"></v-search>

		<v-table ref="table" if-index :column="column" :data="tableData">
			<template #tableHeader>
				<el-button type="primary" @click="addData('add')">新增</el-button>
			</template>
			<template #acctCode="scope">
				{{ proxy.funcs.transferName(scope.row.acctCode, acctCodeList) }}
			</template>
			<template #accessMode="scope">
				{{ proxy.funcs.transferName(scope.row.accessMode, accessModeList, false) }}
			</template>
			<template #apiVersion="scope">
				{{ proxy.funcs.transferName(scope.row.apiVersion, apiVersionList, false) }}
			</template>
			<template #operation="scope">
				<span class="btn-table" @click="watchMx(scope.row, 'watch')">查看明细</span>
				<span class="btn-table" @click="watchMx(scope.row, 'edit')">编辑</span>
				<span class="btn-table" @click="delData(scope.row)">删除</span>
			</template>
		</v-table>
		<v-pages ref="pages" @get-data="getData" :total="paginationData.total" v-model:pageNum="paginationData.pageNum" v-model:pageSize="paginationData.pageSize" />

		<!--新增-->
		<el-dialog v-model="visibleAdd" title="新增基金申请单" width="80%" class="dialog-form" v-if="visibleAdd">
			<el-form ref="refFormAdd" :model="formDataAdd" :rules="rules" label-width="150px">
				<Grid ref="gridRef" :gap="[20, 0]" :cols="3">
					<GridItem>
						<el-form-item label="报表项目编码：" prop="itemCode">
							<span>{{ formDataAdd.itemCode ? formDataAdd.itemCode : '系统自动生成' }}</span>
						</el-form-item>
					</GridItem>
					<GridItem>
						<el-form-item label="报表项目名称：" prop="itemName">
							<el-input v-model="formDataAdd.itemName" placeholder="请填写报表项目名称" @blur="getCodeByName"></el-input>
						</el-form-item>
					</GridItem>
					<GridItem>
						<el-form-item label="科目体系：" prop="acctCode">
							<el-select v-model="formDataAdd.acctCode" placeholder="请选择科目体系">
								<el-option v-for="item in acctCodeList" :key="item.id" :label="`[${item.code}]${item.name}`" :value="item.code"></el-option>
							</el-select>
						</el-form-item>
					</GridItem>
					<GridItem>
						<el-form-item label="接入方式：" prop="accessMode">
							<el-select v-model="formDataAdd.accessMode" placeholder="请选择接入方式" :disabled="saveType === 'watch'" clearable @change="accessModeChange">
								<el-option v-for="item in accessModeList" :label="item.name" :value="item.code" :key="item.code"></el-option>
							</el-select>
						</el-form-item>
					</GridItem>
					<GridItem v-if="formDataAdd.accessMode === 'API'">
						<el-form-item label="接口版本：" prop="apiVersion">
							<el-select v-model="formDataAdd.apiVersion" placeholder="请选择接口版本" :disabled="saveType === 'watch'" style="width: 100%">
								<el-option v-for="item in apiVersionList" :label="item.name" :value="item.code" :key="item.code"></el-option>
							</el-select>
						</el-form-item>
					</GridItem>
					<GridItem v-if="formDataAdd.accessMode === 'DATABASE'">
						<el-form-item label="接入版本：" prop="accessExchangePlanFlag">
							<el-select v-model="formDataAdd.accessExchangePlanFlag" placeholder="请选择接入版本" :disabled="saveType === 'watch'">
								<el-option v-for="item in accessExchangePlanFlagList" :label="`[${item.planFlag}]${item.planName}`" :value="item.planFlag" :key="item.id"></el-option>
							</el-select>
						</el-form-item>
					</GridItem>
					<GridItem>
						<el-form-item label="分类：" prop="reportCategoryCode">
							<el-select v-model="formDataAdd.reportCategoryCode" placeholder="请选择分类" :disabled="saveType === 'watch'" @change="reportCategoryCodeChange">
								<el-option
									v-for="item in reportCategoryCodeList"
									:label="`[${item.categoryCode}]${item.categoryName}`"
									:value="item.categoryCode"
									:key="item.categoryCode"
								></el-option>
							</el-select>
						</el-form-item>
					</GridItem>
					<GridItem :span="3">
						<el-form-item label="备注：" prop="remark">
							<el-input type="textarea" :disabled="saveType === 'watch'" :rows="3" v-model="formDataAdd.remark" style="width: 100%"></el-input>
						</el-form-item>
					</GridItem>
					<GridItem>
						<el-form-item label="任务编码：" prop="taskCode">
							<el-input v-model="formDataAdd.taskCode" disabled></el-input>
						</el-form-item>
					</GridItem>
					<GridItem>
						<el-form-item label="报表编码：" prop="reportCode">
							<el-input v-model="formDataAdd.reportCode" disabled></el-input>
						</el-form-item>
					</GridItem>
					<GridItem>
						<el-form-item label="指标编码：" prop="detailCode">
							<el-input v-model="formDataAdd.detailCode" placeholder="请输入指标编码" :disabled="saveType === 'watch'"></el-input>
						</el-form-item>
					</GridItem>
					<GridItem>
						<el-form-item label="指标名称：" prop="detailName">
							<el-input v-model="formDataAdd.detailName" placeholder="请输入指标名称" :disabled="saveType === 'watch'"></el-input>
						</el-form-item>
					</GridItem>
				</Grid>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" v-if="saveType !== 'watch'" @click="saveData('saveAndAdd')">保存并新增</el-button>
					<el-button v-if="saveType !== 'watch'" @click="saveData('save')">保存</el-button>
					<el-button @click="visibleAdd = false">{{ saveType !== 'watch' ? '取消' : '关闭' }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, reactive, ref, toRaw } from 'vue'

const { proxy } = getCurrentInstance()

/* 搜索条件 */
let acctCodeList = ref([])

const getAcctCodeList = async () => {
	return
	const { code, data, msg } = await proxy.axios.get('/sfrc/dict/list/SFRC_ACCS')
	if (code === 0) {
		acctCodeList.value = data
	} else {
		acctCodeList.value = []
		proxy.msg({ type: 'error', message: msg })
	}
}

const formData = reactive({
	acctCode: '',
	itemCode: '',
	itemName: '',
	businessModule: 'REPORT'
})

const formItems = computed(() => {
	return [
		{
			htmlType: 'select',
			label: '科目体系',
			ruleId: 'acctCode',
			list: acctCodeList.value.length
				? acctCodeList.value.map(item => ({
						label: item.name,
						value: item.code
				  }))
				: [],
			search: {
				code: true
			}
		},
		{
			htmlType: 'input',
			label: '报表项目编码',
			ruleId: 'itemCode',
			search: {}
		},
		{
			htmlType: 'input',
			label: '报表项目名称',
			ruleId: 'itemName'
		}
	]
})

/* 表格 */
const column = [
	{ label: '报表分类', prop: 'reportCategoryCode', width: 150 },
	{ label: '科目体系', prop: 'acctCode', width: 250 },
	{ label: '任务编码', prop: 'taskCode', width: 150 },
	{ label: '报表编码', prop: 'reportCode', width: 150 },
	{ label: '报表项目编码', prop: 'itemCode', width: 200 },
	{ label: '报表项目名称', prop: 'itemName', width: 200 },
	{ label: '接入方式', prop: 'accessMode', width: 150 },
	{ label: '版本/方案', prop: 'apiVersion', width: 150 },
	{ label: '备注', prop: 'remark', width: 200 },
	{ label: '创建日期', prop: 'createDate', width: 200, align: 'center' },
	{ label: '操作', prop: 'operation', width: 200, align: 'center', fixed: 'right' }
]

const tableData = ref([])

const paginationData = reactive({
	total: 0,
	pageSize: 50,
	pageNum: 1
})

const getData = async () => {
	const params = JSON.parse(JSON.stringify(toRaw(formData)))
	params.pageSize = paginationData.pageSize
	params.pageNum = paginationData.pageNum

	const { code, data, msg } = await proxy.axios.post('/sfrc/api/comparisonItem/pageList', params)
	if (code === 0) {
		tableData.value = data.rows
		paginationData.total = data.total
	} else {
		paginationData.total = 0
		proxy.msg({ type: 'error', message: msg })
	}
}

/* 新增 */
let visibleAdd = ref(false)

let formDataAdd = ref({
	itemCode: '',
	itemName: '',
	acctCode: '',
	accessMode: '',
	apiVersion: '',
	accessExchangePlanFlag: '',
	reportCategoryCode: '',
	remark: '',
	taskCode: '',
	reportCode: '',
	detailCode: '',
	detailName: '',
	businessModule: 'REPORT',
	accessType: 'DIRECT_QUERY'
})

const rules = reactive({
	itemCode: [{ required: true, message: '请输入报表项目编码', trigger: 'blur' }],
	itemName: [{ required: true, message: '请输入报表项目名称', trigger: 'blur' }],
	acctCode: [{ required: true, message: '请选择科目体系', trigger: 'change' }],
	accessMode: [{ required: true, message: '请选择接入方式', trigger: 'change' }],
	apiVersion: [{ required: true, message: '请选择接口版本', trigger: 'change' }],
	accessExchangePlanFlag: [{ required: true, message: '请选择接入版本', trigger: 'change' }],
	reportCategoryCode: [{ required: true, message: '请选择分类', trigger: 'change' }],
	detailCode: [{ required: true, message: '请输入指标编码', trigger: 'blur' }],
	detailName: [{ required: true, message: '请输入指标名称', trigger: 'blur' }]
})

const refFormAdd = null

let saveType = ref('add')

let accessModeList = ref([])

let apiVersionList = ref([])

let accessExchangePlanFlagList = ref([])

let reportCategoryCodeList = ref([])

const addData = type => {
	visibleAdd.value = true
	saveType.value = type
	formDataAdd.value = {
		itemCode: '',
		itemName: '',
		acctCode: '',
		accessMode: '',
		apiVersion: '',
		accessExchangePlanFlag: '',
		reportCategoryCode: '',
		remark: '',
		taskCode: '',
		reportCode: '',
		detailCode: '',
		detailName: '',
		businessModule: 'REPORT',
		accessType: 'DIRECT_QUERY'
	}
	setTimeout(() => {
		refFormAdd.value.clearValidate()
	}, 0)
}

const getCodeByName = async () => {
	if (formDataAdd.value.itemName) {
		const params = {
			businessModule: 'REPORT',
			type: '',
			chineseName: formDataAdd.value.itemName
		}
		const { code, data, msg } = await proxy.axios.post('/sfrc/common/getCodeByName', params)
		if (code === 0) {
			formDataAdd.value.itemCode = data.code
		} else {
			formDataAdd.value.itemCode = ''
			proxy.msg({ type: 'error', message: msg })
		}
	}
}

/* 接入方式 */
const getAccessModeList = async () => {
	return
	const { code, data, msg } = await proxy.axios.get('/sfrc/dict/list/AccessMode')
	if (code === 0) {
		accessModeList.value = data
	} else {
		accessModeList.value = []
		proxy.msg({ type: 'error', message: msg })
	}
}

const accessModeChange = val => {
	if (val === 'API') {
		formDataAdd.value.accessExchangePlanFlag = ''
	} else if (val === 'DATABASE') {
		formDataAdd.value.apiVersion = ''
	} else {
		formDataAdd.value.accessExchangePlanFlag = ''
		formDataAdd.value.apiVersion = ''
	}

	rules.apiVersion = [{ required: val === 'API', message: '请选择接口版本', trigger: 'change' }]

	rules.accessExchangePlanFlag = [
		{
			required: val === 'DATABASE',
			message: '请选择接入版本',
			trigger: 'change'
		}
	]

	setTimeout(() => {
		refFormAdd.value.clearValidate()
	}, 0)
}

/* 接口版本 */
const getApiVersionList = async () => {
	return
	const { code, data, msg } = await proxy.axios.get('/sfrc/dict/list/ApiVersion')
	if (code === 0) {
		apiVersionList.value = data
	} else {
		apiVersionList.value = []
		proxy.msg({ type: 'error', message: msg })
	}
}

/* 接入版本 */
const getAccessExchangePlanFlagList = async () => {
	return
	const { code, data, msg } = await proxy.axios.get('/smda/api/exchange/queryAllPlan')
	if (code === 0) {
		accessExchangePlanFlagList.value = data
	} else {
		accessExchangePlanFlagList.value = []
		proxy.msg({ type: 'error', message: msg })
	}
}

/* 分类 */
const getReportCategoryCodeList = async () => {
	return
	const params = { businessModule: 'REPORT' }
	const { code, data, msg } = await proxy.axios.post('/sfrc/api/reportCategory/list', params)
	if (code === 0) {
		reportCategoryCodeList.value = data
	} else {
		reportCategoryCodeList.value = []
		proxy.msg({ type: 'error', message: msg })
	}
}

const reportCategoryCodeChange = reportCategoryCode => {
	const category = reportCategoryCodeList.value.filter(i => i.categoryCode === reportCategoryCode).length
		? reportCategoryCodeList.value.filter(i => i.categoryCode === reportCategoryCode)[0]
		: ''
	if (category) {
		formDataAdd.value.taskCode = category.taskCode
		formDataAdd.value.reportCode = category.reportCode
	} else {
		formDataAdd.value.taskCode = ''
		formDataAdd.value.reportCode = ''
	}
}

const saveData = async type => {
	refFormAdd.value.validate(async valid => {
		if (!valid) return

		const params = JSON.parse(JSON.stringify(toRaw(formDataAdd.value)))
		delete params.detailCode
		delete params.detailName

		if (saveType.value === 'add') {
			params.comparisonItemDetailList = [
				{
					detailCode: formDataAdd.value.detailCode,
					detailName: formDataAdd.value.detailName
				}
			]
		}

		const { code, msg } = await proxy.axios.post('/sfrc/api/comparisonItem/save', params)
		proxy.msg({
			type: code === 0 ? 'success' : 'error',
			message: msg
		})

		if (code === 0) {
			await getData()
		}

		if (type === 'save') {
			visibleAdd.value = false
		} else {
			formDataAdd.value = {
				itemCode: '',
				itemName: '',
				acctCode: '',
				accessMode: '',
				apiVersion: '',
				accessExchangePlanFlag: '',
				reportCategoryCode: '',
				remark: '',
				taskCode: '',
				reportCode: '',
				detailCode: '',
				detailName: '',
				businessModule: 'REPORT',
				accessType: 'DIRECT_QUERY'
			}
			setTimeout(() => {
				refFormAdd.value.clearValidate()
			}, 0)
		}
	})
}

const watchMx = async (row, type) => {
	visibleAdd.value = true
	saveType.value = type

	const { code, data, msg } = await proxy.axios.get(`/sfrc/api/comparisonItem/getOneById/${row.id}`)
	if (code === 0) {
		formDataAdd.value = {
			...data,
			detailCode: data.comparisonItemDetailList[0].detailCode,
			detailName: data.comparisonItemDetailList[0].detailName
		}
	} else {
		proxy.msg({ type: 'error', message: msg })
	}

	setTimeout(() => {
		refFormAdd.value.clearValidate()
	}, 0)
}

/* 删除 */
const delData = row => {
	proxy.msgConfirm
		.confirm('确定删除吗？', '温馨提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		})
		.then(async () => {
			const { code, msg } = await proxy.axios.get(`/sfrc/api/comparisonItem/deleteById/${row.id}`)
			if (code === 0) {
				await getData()
				proxy.msg({ type: 'success', message: msg })
			} else {
				proxy.msg({ type: 'error', message: msg })
			}
		})
		.catch(() => {})
}

onMounted(() => {
	/*getAcctCodeList()
  getAccessModeList()
  getReportCategoryCodeList()
  getApiVersionList()
  getAccessExchangePlanFlagList()*/
})
</script>
