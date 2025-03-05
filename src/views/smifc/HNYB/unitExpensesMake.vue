<template>
	<div class="table-box">
		<!-- 查询表单 card -->
		<v-search @get-data="getData" :form-items="formItems" :formData="formData" :searchCol="3" />
		<el-tabs v-model="activeKey" @tab-click="tabClick">
			<el-tab-pane :label="item.label" :name="item.value" v-for="(item, index) in tabs" :key="index"></el-tab-pane>
		</el-tabs>
		<v-table-vxe
			ref="proTable"
			if-index
			if-select
			:column="columns"
			:data="tableData"
			@selection-change="selectionChange"
		>
			<template #tableHeader>
				<el-button v-if="activeKey === '-1' || activeKey === '0'" type="primary" @click="btnAdd">新增</el-button>
				<el-button v-if="activeKey !== '1'" :type="activeKey === '2' ? 'primary' : ''">提交</el-button>
				<el-button v-if="activeKey !== '1'">删除</el-button>
				<el-button :type="activeKey === '1' ? 'primary' : ''">导出</el-button>
			</template>
			<template #status="{ row }">
				{{ row.status ? '启用' : '停用' }}
			</template>
			<template #operation>
				<el-button>查看</el-button>
			</template>
			<!-- 自定义列 -->
			<template #operateState="scope">
				<el-input v-model="scope.row.operateState" />
			</template>
			<!-- 自定义列 -->
			<template #operateState1="scope">
				<el-input v-model="scope.row.operateState1" />
			</template>
			<template #operateState2="scope">
				<el-input v-model="scope.row.operateState2" />
			</template>
			<template #operateState3="scope">
				<el-input v-model="scope.row.operateState3" />
			</template>
		</v-table-vxe>
		<v-pages ref="pages" @get-data="getData" :total="paginationData.total" v-model:pageNum="paginationData.pageNum" v-model:pageSize="paginationData.pageSize" />
	</div>
</template>

<script setup name="unitExpensesMake">
import { computed, getCurrentInstance, onMounted, reactive, ref, toRaw } from 'vue'
import { useRoute } from 'vue-router'

const { proxy } = getCurrentInstance()
const route = useRoute()
const column1 = [
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

const columns = [
	{ prop: 'name', label: '姓名', width: 200 },
	{
		prop: 'status',
		label: '状态',
		render: ({ row }) => row.status ? '启用' : '停用'
	},
	{
		label: '详细信息',
		children: [
			{ prop: 'age', label: '年龄' },
			{ prop: 'address', label: '地址' }
		]
	}
]
const proTable = ref()
const tableData = ref([
	{ id: 1, docNum: 'Alice', operateState1: 'Charlie51', operateState2: 'Charlie521', operateState3: 'Charlie5211' },
	{ id: 2, docNum: 'Bob', operateState1: 'Charlie52', operateState2: 'Charlie522', operateState3: 'Charlie5212' },
	{ id: 3, docNum: 'Charlie', operateState1: 'Charlie53', operateState2: 'Charlie523', operateState3: 'Charlie5213' }
])
const activeKey = ref('-1')
const tabs = [
	{ label: '全部', value: '-1' },
	{ label: '未提交', value: '0' },
	{ label: '已提交', value: '1' },
	{ label: '驳回', value: '2' }
]

const selectionChange = row => {
	console.log('选择行:', row)
}

const paginationData = reactive({
	total: 0,
	pageSize: 50,
	pageNum: 1
})
const getData = async () => {
	const params = JSON.parse(JSON.stringify(toRaw(formData)))
	params.pageSize = paginationData.pageSize
	params.pageNum = paginationData.pageNum
	params.businessType = route.query.businessType
	let url = `/smfm/unitDetail/pageList`
	if (activeKey.value == '1') {
		params.tabFlag = 'handled'
		params.bizTypeCode = route.query.bizTypeCode
		url = `/smfm/unitDetail/getAuditingList`
	} else if (activeKey.value == '2') {
		params.tabFlag = 'reject'
		params.bizTypeCode = route.query.bizTypeCode
		url = `/smfm/unitDetail/getAuditingList`
	} else if (activeKey.value == '0') {
		params.operateState = 0
	}
	const { code, data, msg } = await proxy.axios.post(url, params)
	if (code === 0) {
		tableData.value = data.rows
		paginationData.total = data.total
	} else {
		tableData.value = []
		paginationData.total = 0
		proxy.msg({ type: 'error', message: msg })
	}
}
const tabClick = val => {
	activeKey.value = val.paneName
	let data = [
		{ id: 1, docNum: 'Alice' },
		{ id: 2, docNum: 'Bob' },
		{ id: 3, docNum: 'Charlie' },
		{ id: 5, operateState1: 'Charlie51', operateState2: 'Charlie521', operateState3: 'Charlie5211' },
		{ id: 6, operateState1: 'Charlie52', operateState2: 'Charlie522', operateState3: 'Charlie5212' },
		{ id: 7, operateState1: 'Charlie53', operateState2: 'Charlie523', operateState3: 'Charlie5213' }
	]
	tableData.value =
		activeKey.value === '-1'
			? data
			: [
					{ id: 1, docNum: 0 },
					{ id: 2, docNum: 'Bob' },
					{ id: 3, docNum: 'Charlie' },
					{ id: 5, docNum: 'Charlie5' },
					{ id: 4, docNum: 'Charlie4' }
			  ]
	// getData();
}
const agencyList = ref([])
const insuranceList = ref([])
const getInsuranceList = async () => {
	/*const { data } = await proxy.axios.get("/api/smc/platFormBasicData/list?eleCode=XZ");
  insuranceList.value = data;*/
}
const getAgencyList = async () => {
	/*const { data } = await proxy.axios.get("/api/smc/platFormBasicData/agencyList");
  agencyList.value = data;*/
}

const formData = reactive({
	docNum: '',
	dateType: '',
	useDate: '',
	agencyCode: [],
	insuranceCode: ''
})
const dateTypeList = ref([
	{
		label: '季度请款',
		value: '0'
	},
	{
		label: '月度请款',
		value: '1'
	},
	{
		label: '零星资金申请',
		value: '2'
	}
])

const formItems = computed(() => {
	return [
		{
			htmlType: 'input',
			label: '单据号',
			ruleId: 'docNum'
		},
		{
			htmlType: 'select',
			label: '请款类型',
			ruleId: 'dateType',
			list: dateTypeList.value,
			search: {
				clear: true
			}
		},
		{
			htmlType: 'date',
			label: '费款所属期0',
			ruleId: 'useDate',
			type: 'year',
			format: 'YYYY',
			valueFormat: 'YYYY',
			search: {
				hide: formData.dateType !== '0'
			}
		},
		{
			htmlType: 'date',
			label: '费款所属期1',
			ruleId: 'useDate',
			type: 'month',
			format: 'YYYY-MM',
			valueFormat: 'YYYY-MM',
			search: {
				hide: formData.dateType !== '1'
			}
		},
		{
			htmlType: 'date',
			label: '费款所属期2',
			ruleId: 'useDate',
			type: 'date',
			format: 'yyyy-MM-dd',
			valueFormat: 'yyyy-MM-dd',
			search: {
				hide: formData.dateType !== '2'
			}
		},
		{
			htmlType: 'select',
			label: '请款单位',
			ruleId: 'agencyCode',
			list: agencyList.value.length
				? agencyList.value.map(item => {
						return { label: item.name, value: item.code }
				  })
				: []
		},
		{
			htmlType: 'select',
			label: '险种',
			ruleId: 'insuranceCode',
			list: insuranceList.value.map(item => {
				return { label: item.chrName, value: item.chrCode }
			})
		}
	]
})

/*新增*/
const visibleAdd = ref(false)
const formDataAdd = ref({
	agencyCode: '',
	agencyName: '',
	applyDate: '',
	attachment: '',
	contactPerson: '',
	contactPhone: '',
	createName: '',
	docNum: '',
	id: '',
	insuranceCode: '',
	insuranceName: '',
	dateType: '0',
	unitDetailItemList: [],
	summary: '',
	totalAmount: 0,
	afterRequestTotalAmount: 0,
	useDate: '',
	monthAddAmount: '0',
	monthAmount: '0',
	monthPayAmount: '0'
})
const tableDataAdd = ref([])
const selectRowsAdd = ref([])
const costItemList = ref([])
const accountList = ref([])
const btnAdd = () => {
	visibleAdd.value = true
	formDataAdd.value = {
		agencyCode: '1100',
		agencyName: '',
		applyDate: '',
		attachment: '',
		contactPerson: '',
		contactPhone: '',
		createName: '',
		docNum: '',
		id: '',
		insuranceCode: '',
		insuranceName: '',
		dateType: '0',
		unitDetailItemList: [],
		summary: '',
		totalAmount: 0,
		afterRequestTotalAmount: 0,
		useDate: '',
		monthAddAmount: '0',
		monthAmount: '0',
		monthPayAmount: '0'
	}
}
const changeDateType = val => {
	formDataAdd.value.dateType = val
}
const changeInsuranceCode = () => {
	getAccountList()
}

const addRow = () => {
	/*if (formDataAdd.value.dateType === "" || !formDataAdd.value.useDate || !formDataAdd.value.insuranceCode) {
    return proxy.msg({ type: "warning", message: "请款类型，用款期间，险种不能为空" });
  }*/
	tableDataAdd.value.push({
		businessItemCode: '',
		accountName: '',
		accountNo: '',
		accountBank: '',
		monthPayAmount: '0',
		prePeriodUseAmount: '0',
		prePeriodRequestAmount: '0',
		coefficient: 1,
		budgetAmount: '',
		monthAmount: '0',
		afterRequestBalAmount: '',
		id: '',
		orderSeq: tableDataAdd.value.length
	})
}
const delRow = index => {
	tableDataAdd.value.splice(index, 1)
}
/*const getCostItemList = async () => {
  /!*const { data } = await proxy.axios.get("/api/smc/platFormBasicData/list?eleCode=JJZFLX");
  costItemList.value = data;*!/
};*/

/*测算相关*/
const visibleComputed = ref(false)
let selectedRowsComputed = reactive({})
const tableDataComputed = reactive([
	{ key: 1, name: '上期请款数' },
	{ key: 3, name: '前三期平均数' },
	{ key: 6, name: '前六期平均数' }
])
const columnComputed = [{ label: '方案名称', prop: 'name', align: 'center' }]
let selectRowsComputed = ref([])
const clickVisibleComputed = selectedRows => {
	selectRowsAdd.value = selectedRows
	if (!selectRowsAdd.value.length) {
		return proxy.msg({ type: 'warning', message: '请选择数据' })
	} else {
		visibleComputed.value = true
	}
}
const selectedChange = row => {
	selectedRowsComputed = row
}
const saveComputed = async () => {
	if (!Object.keys(selectedRowsComputed).length) {
		return proxy.msg({ type: 'warning', message: '请选择数据' })
	}
	const params = {
		insTypeCode: formDataAdd.value.insuranceCode,
		agencyCode: formDataAdd.value.agencyCode,
		useDate: formDataAdd.value.useDate,
		dateType: formDataAdd.value.dateType,
		budgetType: selectedRowsComputed.key,
		businessItemCodeList: selectRowsAdd.value.map(item => {
			return {
				businessItemCode: item.businessItemCode,
				insTypeCode: formDataAdd.value.insuranceCode
			}
		})
	}
	const { code, data, msg } = await proxy.axios.post('/smfm/unitDetail/getBudgetAmount', params)
	if (code === 0) {
		selectRowsComputed.value.forEach(i => {
			data.forEach(j => {
				if (i.businessItemCode === j.businessItemCode) {
					i['budgetAmount'] = j.monthAmountAvg ? j.monthAmountAvg : 0
					coefficientChangeHandle(i)
				}
			})
		})
		visibleComputed.value = false
	} else {
		proxy.msg({ type: 'error', message: msg })
	}
}
//测算系数
const coefficientChangeHandle = row => {
	row.coefficient = row.coefficient ? Number(row.coefficient) : 0
	let budgetAmount = proxy.funcs.moneyTransferNum(row['budgetAmount'])
	row['monthAmount'] = row.coefficient * budgetAmount
	let afterRequestBalAmount = row.coefficient * budgetAmount + proxy.funcs.moneyTransferNum(row['monthPayAmount'])
	row['afterRequestBalAmount'] = row.coefficient * afterRequestBalAmount
	afterRequestTotalAmountChange()
}
const getAccountList = async () => {
	const params = {
		insTypeCode: formDataAdd.value.insuranceCode,
		accTypeCode: '02',
		agencyCode: '1100'
	}
	const { data } = await proxy.axios.post('/smam/api/unitSubAccount/getUnitSubAccountList', params)
	accountList.value = data
}
const handleBusinessItemChange = row => {
	return
	let data = costItemList.value.filter(val => {
		return val.chrCode == row.businessItemCode
	})
	let singleData = tableDataAdd.value.filter(val => {
		return val.businessItemCode == row.businessItemCode
	})
	if (singleData.length > 1) {
		row.businessItemCode = ''
		return proxy.msg({ type: 'warning', message: '已存在当前费款项目' })
	}
	if (data.length) {
		row.businessItem = data[0].chrName
	}
	handleAccountNameChange(row)
}
const handleAccountNameChange = async row => {
	if (!row.businessItemCode) {
		return proxy.msg({ type: 'warning', message: '请选择基金支付类型' })
	}
	if (!row.accountNo) {
		return
	}
	let rowDataAccount = JSON.parse(
		JSON.stringify(
			toRaw(
				accountList.value.filter(val => {
					return val.subAccountNo == row.accountNo
				})[0]
			)
		)
	)
	let isInfo = await checkBusinessItemAndAccount(row)
	if (isInfo) {
		row.accountNo = ''
		return proxy.msg({ type: 'warning', message: '不同的基金款项，不能选择同一个账号' })
	}
	if (Object.keys(rowDataAccount).length) {
		row.accountName = rowDataAccount.subAccountName
		row.accountBank = rowDataAccount.bankName
		row.subAccountNo = rowDataAccount.subAccountNo
		row.bankInfoCode = rowDataAccount.bankInfoCode
		row.monthPayAmount = (rowDataAccount.subAccountBalance / 10000).toFixed(2)
		if (row.monthPayAmount != -1) {
			handleBlur(row, 'monthPayAmount')
			row.afterRequestBalAmount =
				proxy.funcs.moneyTransferNum(row.monthAmount) + (proxy.funcs.moneyTransferNum(row.monthPayAmount) <= 0 ? 0 : proxy.funcs.moneyTransferNum(row.monthPayAmount))
			await afterRequestTotalAmountChange()
		}

		// 查询科目余额以及上期使用情况
		let params = {
			insTypeCode: formDataAdd.value.insuranceCode,
			agencyCode: formDataAdd.value.agencyCode,
			// agencyCode:'00',
			businessItemCode: row.businessItemCode,
			useDate: formDataAdd.value.useDate,
			dateType: formDataAdd.value.dateType,
			subAccountId: rowDataAccount.id,
			budgetType: 1
		}
		const { code, data, msg } = await proxy.axios.post('/smfm/unitDetail/getSubjectAndPrePeriodAmount', params)
		if (code === 0) {
			row.prePeriodRequestAmount = data.prePeriodRequestAmount ? data.prePeriodRequestAmount : 0
		} else {
			proxy.msg({ type: 'error', message: msg })
		}
	}
}

const checkBusinessItemAndAccount = row => {
	let data = tableDataAdd
	if (data.value.length < 2) {
		return false
	}
	for (let i = 0; i < data.value.length; i++) {
		if (data[i].accountNo == row.accountNo && data[i].businessItemCode != row.businessItemCode && row != data[i]) {
			return true
		}
	}
	return false
}

const afterRequestTotalAmountChange = () => {
	let total = 0
	let total1 = 0
	tableDataAdd.value.forEach(item => {
		total += proxy.funcs.moneyTransferNum(item.afterRequestBalAmount)
		total1 += proxy.funcs.moneyTransferNum(item.monthAmount)
	})
	formDataAdd.value.afterRequestTotalAmount = total
	formDataAdd.value.totalAmount = total1
}

// 自动计算合计金额
const handleTotalAmount = row => {
	row.monthAddAmount = row.monthAddAmount.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
	let total1 = 0
	let total2 = 0
	let total3 = 0
	tableDataAdd.value.forEach(val => {
		total1 += proxy.funcs.moneyTransferNum(val.monthAddAmount)
		total2 += proxy.funcs.moneyTransferNum(val.monthPayAmount)
		total3 += proxy.funcs.moneyTransferNum(val.monthAmount)
	})
	formDataAdd.value.monthAddAmount = total1
	handleBlur(formDataAdd, 'monthAddAmount')

	formDataAdd.value.monthPayAmount = total2
	handleBlur(formDataAdd, 'monthPayAmount')

	formDataAdd.value.totalAmount = total3
	formDataAdd.value.monthAmount = total3
	handleBlur(formDataAdd, 'totalAmount')
	handleBlur(formDataAdd, 'monthAmount')

	row['afterRequestBalAmount'] =
		proxy.funcs.moneyTransferNum(row.monthAmount) + (proxy.funcs.moneyTransferNum(row.monthPayAmount) <= 0 ? 0 : proxy.funcs.moneyTransferNum(row.monthPayAmount))
	afterRequestTotalAmountChange()
}
const handleFocus = (row, field) => {
	if (row[field] === '0') {
		row[field] = ''
	} else {
		row[field] = proxy.funcs.moneyTransferNum(row[field])
	}
}
const handleBlur = (row, field) => {
	console.log(row, field)
	const patron = /^([1-9]\d*|bai0)(\.\d*[1-9])?$/
	if (!patron.exec(row[field])) {
		// this.$message({showClose: true, message: '申请总金额不能小于等于0,且不能为非数字!', type: 'error'})
		return
	} else {
		row[field] = proxy.funcs.thousandPoint(row[field])
	}
}

const save = () => {
	console.log(tableDataAdd.value, '3333')
}
onMounted(() => {
	getInsuranceList()
	getAgencyList()
	// getData();
})
</script>
