<template>
	<div class="table-box">
		<!-- 查询表单 card -->
		<v-search @get-data="getData" :form-items="formItems" :formData="formData" />
		<el-tabs v-model="activeKey" @tab-click="tabClick">
			<el-tab-pane :label="item.label" :name="item.value" v-for="(item, index) in tabs" :key="index"></el-tab-pane>
		</el-tabs>
		<v-table
			ref="proTable"
			if-index
			if-select
			:column="activeKey === '0' || activeKey === '2' ? column1 : activeKey === '1' ? column2 : activeKey === '5' ? column4 : column3"
			:data="tableData"
			@selection-change="selectionChange"
		>
			<template #tableHeader>
				<el-button v-if="activeKey === '-1' || activeKey === '0'" type="primary" @click="btnAdd">新增</el-button>
				<el-button v-if="activeKey !== '1'" :type="activeKey === '2' ? 'primary' : ''">提交</el-button>
				<el-button v-if="activeKey !== '1'">删除</el-button>
				<el-button :type="activeKey === '1' ? 'primary' : ''">导出</el-button>
			</template>

			<template #operation>
				<el-button>查看2</el-button>
			</template>
		</v-table>
		<v-pages ref="pages" @get-data="getData" :total="paginationData.total" v-model:pageNum="paginationData.pageNum" v-model:pageSize="paginationData.pageSize" />

		<!--新增-->
		<el-dialog v-model="visibleAdd" title="新增基金申请单" class="dialog-form w-1200" v-if="visibleAdd">
			<el-form ref="formRef" :model="formDataAdd">
				<Grid ref="gridRef" :gap="[20, 0]" :cols="3">
					<GridItem>
						<el-form-item label="单据编号：" prop="docNum">
							<span>{{ formDataAdd.docNum }}</span>
						</el-form-item>
					</GridItem>
					<GridItem>
						<el-form-item label="请款日期：" prop="applyDate">
							<span>{{ formDataAdd.applyDate }}</span>
						</el-form-item>
					</GridItem>
					<GridItem>
						<el-form-item label="申请单位：" prop="agencyName">
							<span>{{ formDataAdd.agencyName }}</span>
						</el-form-item>
					</GridItem>
					<GridItem>
						<el-form-item label="请款类型：" prop="dateType">
							<el-select v-model="formDataAdd.dateType" placeholder="请选择请款类型" @change="changeDateType">
								<el-option v-for="val in dateTypeList" :label="val.label" :value="val.value" :key="val.value"></el-option>
							</el-select>
						</el-form-item>
					</GridItem>
					<GridItem>
						<el-form-item label="用款期间：" prop="useDate">
							<el-date-picker v-model="formDataAdd.useDate" type="month" format="YYYY-MM" value-format="YYYY-MM" placeholder="请选择用款期间"> </el-date-picker>
						</el-form-item>
					</GridItem>
					<GridItem v-if="formDataAdd.dateType === '2'">
						<el-form-item label="用款期间：" prop="useDate">
							<el-date-picker v-model="formDataAdd.useDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择"> </el-date-picker>
						</el-form-item>
					</GridItem>
					<GridItem>
						<el-form-item label="险种：" prop="insuranceCode">
							<el-select v-model="formDataAdd.insuranceCode" placeholder="请选择险种" @change="changeInsuranceCode">
								<el-option v-for="val in insuranceList" :label="'[' + val.chrCode + ']' + val.chrName" :value="val.chrCode" :key="val.id"></el-option>
							</el-select>
						</el-form-item>
					</GridItem>
					<GridItem>
						<el-form-item label="合计金额（万元）：" prop="totalAmount">
							<span> {{ proxy.funcs.thousandPoint(formDataAdd.totalAmount) }} </span>
						</el-form-item>
					</GridItem>
					<GridItem>
						<el-form-item label="申请后账户余额（万元）：" prop="afterRequestTotalAmount">
							<span>{{ proxy.funcs.thousandPoint(formDataAdd.afterRequestTotalAmount ? formDataAdd.afterRequestTotalAmount : 0) }}</span>
						</el-form-item>
					</GridItem>
					<GridItem>
						<el-form-item label="摘要：" prop="summary">
							<el-input v-model="formDataAdd.summary"></el-input>
						</el-form-item>
					</GridItem>
				</Grid>
			</el-form>
			<v-table ref="proTable1" ifIndex if-select :column="columnAdd" :data="tableDataAdd" isDialogTable height="650px">
				<template #tableHeader="scope">
					<el-button type="primary" @click="addRow">增行</el-button>
					<el-button @click="delRow">删行</el-button>
					<el-button @click="btnAdd">更新余额</el-button>
					<el-button @click="clickVisibleComputed(scope.selectedRows)">测算</el-button>
					<el-button @click="btnAdd">参照支付计划</el-button>
				</template>
				<!--基金支付类型-->
				<template #businessItemCode="scope">
					<el-select style="width: 100%" v-model="scope.row.businessItemCode" placeholder="请选择基金支付类型" @change="handleBusinessItemChange(scope.row)">
						<el-option v-for="val in costItemList" :label="val.chrName" :value="val.chrCode" :key="val.chrCode"></el-option>
					</el-select>
				</template>
				<!-- // 户名 -->
				<template #accountName="scope">
					<el-select style="width: 100%" v-model="scope.row.accountNo" placeholder="请选择户名" @change="handleAccountNameChange(scope.row)">
						<el-option v-for="val in accountList" :label="`[${val.subAccountNo}]${val.subAccountName}`" :value="val.subAccountNo" :key="val.subAccountNo"></el-option>
					</el-select>
				</template>
				<!-- 支出户余额 -->
				<template #monthPayAmount="scope">
					<el-popover trigger="hover" placement="top" v-if="scope.row.monthPayAmount == -1">
						<p>查询余额失败，请检查接入银行配置！</p>
					</el-popover>
					<span v-else-if="scope.row.monthPayAmount != -1">{{ proxy.funcs.thousandPoint(scope.row.monthPayAmount) }}</span>
					<span v-else>{{ scope.row.monthPayAmount }}</span>
				</template>
				<!--本次申请资金-->
				<template #monthAmount="scope">
					<el-input
						v-model="scope.row.monthAmount"
						placeholder="请填写本次申请资金（万元）"
						@input="handleTotalAmount(scope.row)"
						@blur="handleBlur(scope.row, 'monthAmount')"
						@focus="handleFocus(scope.row, 'monthAmount')"
					></el-input>
				</template>
				<!--本次申请资金-->
				<template #prePeriodUseAmount="scope">
					<el-input
						v-model="scope.row.prePeriodUseAmount"
						placeholder="请填写上期使用情况（万元）"
						@input="handleTotalAmount(scope.row)"
						@blur="handleBlur(scope.row, 'prePeriodUseAmount')"
						@focus="handleFocus(scope.row, 'prePeriodUseAmount')"
					></el-input>
				</template>
				<template #coefficient="scope">
					<el-input v-model="scope.row.coefficient" placeholder="请填写系数" @blur="coefficientChangeHandle(scope.row)"></el-input>
				</template>

				<template #remark="scope">
					<el-input v-model="scope.row.remark" placeholder="请填写备注"></el-input>
				</template>
			</v-table>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="save">保存</el-button>
					<el-button @click="visibleAdd = false">取消</el-button>
				</span>
			</template>
		</el-dialog>

		<!--更新余额-->

		<el-dialog v-model="visibleComputed" title="选择" width="800px" class="dialog-form" v-if="visibleComputed">
			<v-table ref="tableComputed" ifIndex if-radio :column="columnComputed" :data="tableDataComputed" @single-select="selectedChange"> </v-table>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="saveComputed">保存</el-button>
					<el-button @click="visibleComputed = false">取消</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="medicalSettleApply">
import GridItem from '@/components/Grid/components/GridItem.vue'
import Grid from '@/components/Grid/index.vue'
import { computed, getCurrentInstance, onMounted, reactive, ref, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { unitExpensesMake } from './unitExpensesMake'

const { proxy } = getCurrentInstance()
const route = useRoute()
const column1: ColumnProps<unitExpensesMake.column1>[] = [
	{ label: '单据号', prop: 'docNum', width: 200 },
	{
		label: '审批状态',
		prop: 'operateState',
		width: 200
	},
	{ label: '单据日期', prop: 'applyDate', width: 200, align: 'center' },
	{ label: '险种', prop: 'insuranceName', width: 200 },
	{
		label: '用款期间',
		prop: 'useDate',
		width: 200,
		align: 'center'
	},
	{
		label: '请款金额（万元）',
		prop: 'totalAmount',
		formatter: proxy.funcs.format,
		width: 200
	},
	{
		label: '请款单位',
		prop: 'agencyName',
		width: 200
	},
	{ label: '制单人', prop: 'createName', width: 150 },
	{ label: '操作', prop: 'operation', width: 180, align: 'center' }
]
const column2: ColumnProps<unitExpensesMake.column2>[] = [
	{ label: '单据号', prop: 'docNum', width: 200 },
	{
		label: '审批状态',
		prop: 'operateState',
		width: 200
	},
	{ label: '单据日期', prop: 'applyDate', width: 200, align: 'center' },
	{ label: '险种', prop: 'insuranceName', width: 200 },
	{
		label: '用款期间',
		prop: 'useDate',
		width: 200,
		align: 'center'
	},
	{
		label: '请款金额（万元）',
		prop: 'totalAmount',
		formatter: proxy.funcs.format,
		width: 200
	},
	{
		label: '请款单位',
		prop: 'agencyName',
		width: 200
	},
	{ label: '制单人', prop: 'createName', width: 150 },
	{
		label: '退回状态',
		prop: 'backStatus',
		width: 150,
		formatter: val => {
			return val['backStatus'] === '1' ? '已退回' : '未退回'
		}
	},
	{ label: '退回原因', prop: 'backReason', width: 150 },
	{ label: '操作', prop: 'operation', width: 180, align: 'center' }
]
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
	{ label: '单据日期', prop: 'applyDate', width: 200, align: 'center' },
	{ label: '用款期间', prop: 'useDate', width: 200, align: 'center' },
	{
		label: '请款单位',
		prop: 'agencyName',
		width: 200
	},
	{ label: '险种', prop: 'insuranceName', width: 200 },
	{
		label: '请款金额（万元）',
		prop: 'totalAmount',
		formatter: proxy.funcs.format,
		width: 200
	},
	{ label: '制单人', prop: 'createName', width: 150 },
	{ label: '操作', prop: 'operation', width: 180, align: 'center' }
]
const column4: ColumnProps<unitExpensesMake.column4>[] = [
	{ label: '单据号', prop: 'docNum', width: 200 },
	{
		label: '审批状态',
		prop: 'operateState',
		width: 200
	},
	{
		label: '下拨状态',
		prop: 'allocateFlag',
		width: 200,
		formatter: val => {
			return val['allocateFlag'] === '0' ? '未处理' : val['allocateFlag'] === '1' ? '待下拨' : '已下拨'
		}
	},
	{ label: '单据日期', prop: 'applyDate', width: 200, align: 'center' },
	{ label: '用款期间', prop: 'useDate', width: 200, align: 'center' },
	{
		label: '请款单位',
		prop: 'agencyName',
		width: 200
	},
	{ label: '险种', prop: 'insuranceName', width: 200 },
	{
		label: '请款金额（万元）',
		prop: 'totalAmount',
		formatter: proxy.funcs.format,
		width: 200
	},
	{ label: '制单人', prop: 'createName', width: 150 },
	{ label: '操作', prop: 'operation', width: 180, align: 'center' }
]
const columnAdd: ColumnProps<unitExpensesMake.columnAdd>[] = [
	{ label: '基金支付类型', prop: 'businessItemCode', width: 250, operate: true },
	{ label: '户名', prop: 'accountName', width: 250, align: 'center' },
	{ label: '账号', prop: 'accountNo', width: 200, align: 'center' },
	{ label: '开户行', prop: 'accountBank', width: 200 },
	{
		label: '支出户余额（万元）',
		prop: 'monthPayAmount',
		width: 200,
		align: 'right',
		formatter: proxy.funcs.format,
		operate: true
	},
	{
		label: '上期使用情况',
		prop: 'prePeriodUseAmount',
		width: 200,
		align: 'right',
		formatter: proxy.funcs.format,
		operate: true
	},
	{ label: '上期请款金额', prop: 'prePeriodRequestAmount', width: 200, align: 'right', formatter: proxy.funcs.format },
	{ label: '系数', prop: 'coefficient', width: 200, align: 'right' },
	{ label: '测算金额', prop: 'budgetAmount', width: 200, align: 'right', formatter: proxy.funcs.format },
	{
		label: '本次申请资金（万元）',
		prop: 'monthAmount',
		width: 200,
		align: 'right',
		formatter: proxy.funcs.format,
		operate: true
	},
	{ label: '申请后账户余额', prop: 'afterRequestBalAmount', width: 200, align: 'right', formatter: proxy.funcs.format },
	{ label: '备注', prop: 'remark', width: 200, align: 'right' }
]

const proTable = ref<InstanceType<typeof VTable>>()
const tableData = ref([
	{ id: 1, docNum: 'Alice' },
	{ id: 2, docNum: 'Bob' },
	{ id: 3, docNum: 'Charlie' },

	{ id: 5, operateState1: 'Charlie51', operateState2: 'Charlie521', operateState3: 'Charlie5211' },
	{ id: 5, operateState1: 'Charlie52', operateState2: 'Charlie522', operateState3: 'Charlie5212' },
	{ id: 5, operateState1: 'Charlie53', operateState2: 'Charlie523', operateState3: 'Charlie5213' }
])
const activeKey = ref('-1')
const tabs = [
	{ label: '全部', value: '-1' },
	{ label: '未提交', value: '0' },
	{ label: '已提交', value: '1' },
	{ label: '驳回', value: '2' }
]

const selectionChange = (row: any) => {
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
	tableData.value = [
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
	// getCostItemList();
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
const visibleComputed: Ref<boolean> = ref(false)
let selectedRowsComputed = reactive({})
const tableDataComputed = reactive([
	{ key: 1, name: '上期请款数' },
	{ key: 3, name: '前三期平均数' },
	{ key: 6, name: '前六期平均数' }
])
const columnComputed: ColumnProps<unitExpensesMake.columnComputed>[] = [{ label: '方案名称', prop: 'name', align: 'center' }]
let selectRowsComputed = ref([])
const clickVisibleComputed = (selectedRows: any[]) => {
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
