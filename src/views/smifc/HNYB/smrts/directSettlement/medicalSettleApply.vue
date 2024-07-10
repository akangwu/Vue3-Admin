<template>
  <div class="table-box">
    <!-- 查询表单 card -->
    <v-search @get-data="getData" :form-items="formItems" :formData="formData" />
    <el-tabs v-model="activeKey" @tab-click="tabClick">
      <el-tab-pane :label="item.label" :name="item.value" v-for="(item, index) in tabs" :key="index"> </el-tab-pane>
    </el-tabs>
    <v-table ref="proTable" title="药采结算申请" ifIndex :column="columns" :data="tableData">
      <template #tableHeader>
        <el-button v-if="activeKey === '0'" type="primary">新增用户</el-button>
        <el-button v-if="activeKey === '1'" type="primary">退回</el-button>
      </template>
      <template #p7="scope">
        {{ `[${scope.row.p6}]${scope.row.p7}` }}
      </template>
      <template #operation>
        <el-button>查看</el-button>
      </template>
    </v-table>
    <v-pages
      ref="pages"
      @get-data="getData"
      :total="paginationData.total"
      v-model:pageNum="paginationData.pageNum"
      v-model:pageSize="paginationData.pageSize"
    />
  </div>
</template>

<script setup lang="ts" name="medicalSettleApply">
import { computed, getCurrentInstance, onMounted, reactive, ref, toRaw } from "vue";
import { useRoute } from "vue-router";
import { MedicalSettleApply } from "../medicalSettleApply";
const { proxy } = getCurrentInstance();
const route = useRoute();
const columns: ColumnProps<MedicalSettleApply.ResList>[] = [
  { label: "结算批次号", prop: "statementId", width: 200 },
  {
    label: "业务批次号",
    prop: "p4",
    width: 200
  },
  { label: "财务批次号", prop: "p5", width: 200 },
  { label: "创建时间", prop: "createDate", width: 200, align: "center" },
  {
    label: "费款所属期",
    prop: "p1",
    width: 150,
    align: "center"
  },
  {
    label: "统筹区",
    prop: "p7",
    width: 200
  },
  {
    label: "险种",
    prop: "insuranceName",
    width: 200
  },
  { label: "医保经办机构", prop: "agencyName", width: 200 },
  {
    label: "业务类型",
    prop: "p11",
    width: 250
  },
  { label: "实付单位数", prop: "p12", width: 150 },
  { label: "实付总金额（元）", prop: "p13", width: 150, align: "right" },
  { label: "应付单位数", prop: "totalOriginalCount", width: 150 },
  { label: "应付总金额（元）", prop: "totalOriginalAmt", width: 150, align: "right" },
  { label: "凭证号", prop: "vouNo", width: 150 },
  { label: "凭证日期", prop: "vouDate", width: 150, align: "center" },
  { label: "提交人", prop: "submitName", width: 150 },
  { label: "提交时间", prop: "submitTime", width: 150, align: "center" },
  {
    label: "审核状态",
    prop: "operateState",
    width: 150
  },
  {
    label: "审核时间",
    prop: "operateTime",
    width: 150,
    align: "center"
  },
  { label: "操作", prop: "operation", width: 180, align: "center" }
];
let tableData = ref([]);
const activeKey = ref("0");
const tabs = [
  { label: "待办", value: "0" },
  { label: "已办", value: "1" },
  { label: "驳回", value: "2" },
  { label: "退回", value: "3" }
];
const paginationData = reactive({
  total: 0,
  pageSize: 50,
  pageNum: 1
});
const getData = async () => {
  const params = JSON.parse(JSON.stringify(toRaw(formData)));
  params.pageSize = paginationData.pageSize;
  params.pageNum = paginationData.pageNum;
  if (params.p10s == "") {
    params.p10s = route.query.businessType ? route.query.businessType.split(",") : "";
  }
  if (activeKey.value === "0") {
    params.operateState = ["0"];
    params.rollbackStatusList = ["0", "1"];
  }
  if (activeKey.value === "1") {
    params.menuFlag = "handled";
    params.rollbackStatusList = ["0", "1"];
  }
  if (activeKey.value === "2") {
    params.menuFlag = "reject";
    params.rollbackStatusList = ["0", "1"];
  }
  if (activeKey.value === "3") {
    params.rollbackStatusList = ["1", "2"];
  }
  params.startDate = params.dealDate[0];
  params.endDate = params.dealDate[1];
  delete params.dealDate;
  if (activeKey.value !== "0" && activeKey.value !== "3") {
    params.bizTypeCode = route.query.bizTypeCode ? route.query.bizTypeCode : null;
  }
  params.cancelPayIs = activeKey.value === "3";
  let url = `/henan/smrts/api/deductPlan/${activeKey.value === "0" || activeKey.value === "3" ? "pageList" : "taskPageList"}`;
  const { code, data, msg } = await proxy.axios.post(url, params);
  if (code === 0) {
    tableData.value = data.rows;
    paginationData.total = data.total;
  } else {
    tableData.value = [];
    paginationData.total = 0;
    proxy.msg({ type: "error", message: msg });
  }
};
const tabClick = val => {
  activeKey.value = val.paneName;
  getData();
};
const getInsuranceList = async () => {
  let insuranceLint = [];
  const { data } = await proxy.axios.get("/api/smc/platFormBasicData/list?eleCode=XZ");
  insuranceLint = data;
  console.log(insuranceLint, "323223");
};

const formData = reactive({
  p1: "",
  p10s: "",
  p4Like: "",
  insuranceCode: "",
  dealDate: ["", ""],
  operateParam: "",
  statementId: ""
});

const formItems = computed(() => {
  return [
    {
      htmlType: "date",
      label: "费款所属期",
      ruleId: "p1",
      type: "month",
      format: "YYYY-MM",
      valueFormat: "YYYY-MM"
    },
    {
      htmlType: "select",
      label: "业务类型",
      ruleId: "p10s",
      list: [
        { label: "收入", value: "0" },
        { label: "支出", value: "1" }
      ],
      clear: true,
      filter: true
    },
    {
      htmlType: "input",
      label: "业务批次号",
      ruleId: "p4Like"
    },
    {
      htmlType: "select",
      label: "险种",
      ruleId: "insuranceCode",
      list: [
        { label: "收入", value: "0" },
        { label: "支出", value: "1" }
      ],
      clear: true,
      filter: true
    },
    {
      htmlType: "dateRange",
      label: "审核时间",
      ruleId: "dealDate",
      type: "daterange",
      format: "YYYY-MM-DD",
      valueFormat: "YYYY-MM-DD"
    },
    {
      htmlType: "select",
      label: "审核状态",
      ruleId: "operateParam",
      list: [
        { label: "收入", value: "0" },
        { label: "支出", value: "1" }
      ],
      clear: true,
      filter: true
    },
    {
      htmlType: "input",
      label: "结算批次号	",
      ruleId: "statementId"
    }
  ];
});
onMounted(() => {
  getInsuranceList();
  getData();
});
</script>
