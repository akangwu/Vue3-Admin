<template>
	<div class="table-box">
		<v-search @get-data="getData" :form-items="formItems" :form-data="formData" />
		<v-table ref="proTable" title="药采结算申请" if-index :column="column" :data="tableData">
			<template #p4="scope">
				<el-button type="primary" link @click="proxy.msg({ type: 'success', message: '我是通过作用域插槽渲染的内容' })">
					{{ scope.row.p4 }}
				</el-button>
			</template>
		</v-table>
		<v-pages ref="pages" @get-data="getData" :total="paginationData.total" v-model:page-num="paginationData.pageNum" v-model:page-size="paginationData.pageSize" />
	</div>
</template>

<script setup name="medicalSettleApply2">
import { computed, ref, reactive, getCurrentInstance, toRaw } from 'vue'

const { proxy } = getCurrentInstance()

const formData = reactive({
	p1: '',
	p10s: '',
	p4Like: '',
	insuranceCode: '',
	dealDate: ['', ''],
	operateParam: '',
	statementId: ''
})

const formItems = computed(() => {
	return [
		{
			htmlType: 'date',
			label: '费款所属期',
			ruleId: 'p1',
			type: 'month',
			format: 'YYYY-MM',
			valueFormat: 'YYYY-MM'
		},
		{
			htmlType: 'select',
			label: '业务类型',
			ruleId: 'p10s',
			list: businessTypeList.value.map(item => {
				return {
					label: item.typeName,
					value: item.typeCode
				}
			}),
			search: {
				clear: true,
				filter: true
			}
		},
		{
			htmlType: 'input',
			label: '业务批次号',
			ruleId: 'p4Like'
		},
		{
			htmlType: 'select',
			label: '险种',
			ruleId: 'insuranceCode',
			list: insuranceList.value.map(item => {
				return {
					label: item.chrName,
					value: item.chrCode
				}
			}),
			search: {
				clear: true,
				filter: true
			}
		},
		{
			htmlType: 'select',
			label: '经办机构',
			ruleId: 'agencyCode',
			list: agencyList.value.map(item => {
				return {
					label: item.title,
					value: item.code
				}
			}),
			search: {
				clear: true,
				filter: true
			}
		}
	]
})

/*表格*/
let tableData = ref([])
const column = [
	{ label: '费款所属期', prop: 'p1', width: 200 },
	{
		label: '统筹区',
		prop: 'p7',
		width: 200
	},
	{ label: '险种', prop: 'insuranceName', width: 200 },
	{ label: '医保经办机构', prop: 'createDate', width: 200 },
	{
		label: '业务类型',
		prop: 'p11',
		width: 150
	},
	{
		label: '单位数',
		prop: 'p12',
		width: 100
	},
	{
		label: '总金额（元）',
		prop: 'p13',
		width: 150,
		align: 'right',
		formatter: proxy.funcs.format
	},
	{ label: '业务批次号', prop: 'p4', width: 200 },
	{
		label: '财务批次号',
		prop: 'p5',
		width: 250
	},
	{ label: '凭证号', prop: 'vouNo', width: 150 },
	{ label: '凭证日期', prop: 'vouDate', width: 150, align: 'center' },
	{ label: '审核状态', prop: 'operateState', width: 150, formatter: proxy.funcs.formatOperateState }
]

const paginationData = reactive({
	total: 0,
	pageSize: 50,
	pageNum: 1
})

const getData = async () => {
	const params = JSON.parse(JSON.stringify(toRaw(formData)))
	params.pageSize = paginationData.pageSize
	params.pageNum = paginationData.pageNum
	const { code, data, msg } = await proxy.axios.post('/smrts/api/payPlan/pageList', params)
	if (code === 0) {
		tableData.value = data.rows
		paginationData.total = data.total
	} else {
		tableData.value = []
		paginationData.total = 0
		proxy.msg({ type: 'error', message: msg })
	}
}

// 获取枚举
let agencyList = ref([])
const getAgencyList = async () => {
	const { data } = await proxy.axios.get('/smc/api/agency/treeData')
	agencyList.value = data
}

let businessTypeList = ref([])
const getBusinessTypeList = async () => {
	const { data } = await proxy.axios.post('/api/smc/businessType/list', { enabled: '1', typeCodes: [] })
	businessTypeList.value = data
}

let insuranceList = ref([])
const getInsuranceListList = async () => {
	const { data } = await proxy.axios.get('/api/smc/platFormBasicData/list', { eleCode: 'XZ' })
	insuranceList.value = data
}

onMounted(() => {
	/*getData()
	getAgencyList()
	getBusinessTypeList()
	getInsuranceListList()*/
})
</script>
