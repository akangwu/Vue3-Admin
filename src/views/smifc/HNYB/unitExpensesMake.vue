<template>
  <div class="table-box">
    <!-- 查询表单 card -->
    <v-search @get-data="getData" :form-items="formItems" :formData="formData" />
    <el-tabs v-model="activeKey" @tab-click="tabClick">
      <el-tab-pane :label="item.label" :name="item.value" v-for="(item, index) in tabs" :key="index"> </el-tab-pane>
    </el-tabs>
    <v-table
      ref="proTable"
      ifIndex
      :column="
        activeKey === '0' || activeKey === '2'
          ? column1
          : activeKey === '1' || activeKey === '1'
          ? column2
          : activeKey === '5'
          ? column4
          : column3
      "
      :data="tableData"
    >
      <template #tableHeader>
        <el-button v-if="activeKey === '-1' || activeKey === '0'" type="primary" @click="add">新增</el-button>
        <el-button v-if="activeKey !== '1'" :type="activeKey === '2' ? 'primary' : ''">提交</el-button>
        <el-button v-if="activeKey !== '1'">删除</el-button>
        <el-button :type="activeKey === '1' ? 'primary' : ''">导出</el-button>
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

    <!--新增-->
    <el-dialog v-model="visible" title="新增基金申请单" width="1200px" draggable class="dialog-form">
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
              <el-date-picker
                v-model="formDataAdd.useDate"
                type="month"
                format="YYYY-MM"
                value-format="YYYY-MM"
                placeholder="请选择用款期间"
              >
              </el-date-picker>
            </el-form-item>
          </GridItem>
          <GridItem v-if="formDataAdd.dateType === '2'">
            <el-form-item label="用款期间：" prop="useDate">
              <el-date-picker
                v-model="formDataAdd.useDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
              >
              </el-date-picker>
            </el-form-item>
          </GridItem>
          <GridItem>
            <el-form-item label="险种：" prop="insuranceCode">
              <el-select v-model="formDataAdd.insuranceCode" placeholder="请选择险种" @change="changeInsuranceCode">
                <el-option
                  v-for="val in insuranceList"
                  :label="'[' + val.chrCode + ']' + val.chrName"
                  :value="val.chrCode"
                  :key="val.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </GridItem>
          <GridItem>
            <el-form-item label="申请后账户余额（万元）：" prop="afterRequestTotalAmount">
              <span>{{ formDataAdd.afterRequestTotalAmount }}</span>
            </el-form-item>
          </GridItem>
          <GridItem>
            <el-form-item label="合计金额（万元）：" prop="totalAmount">
              <span>{{ formDataAdd.totalAmount }}</span>
            </el-form-item>
          </GridItem>
          <GridItem>
            <el-form-item label="摘要：" prop="summary">
              <el-input v-model="formDataAdd.summary"></el-input>
            </el-form-item>
          </GridItem>
        </Grid>
      </el-form>
      <v-table
        ref="proTable"
        ifIndex
        :column="
          activeKey === '0' || activeKey === '2'
            ? column1
            : activeKey === '1' || activeKey === '1'
            ? column2
            : activeKey === '5'
            ? column4
            : column3
        "
        :data="tableData"
        isDialogTable
      >
      </v-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="visible = false">保存</el-button>
          <el-button @click="visible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="medicalSettleApply">
import GridItem from "@/components/Grid/components/GridItem.vue";
import Grid from "@/components/Grid/index.vue";
import { computed, getCurrentInstance, onMounted, reactive, ref, toRaw } from "vue";
import { useRoute } from "vue-router";
import { unitExpensesMake } from "./unitExpensesMake";
const { proxy } = getCurrentInstance();
const route = useRoute();
const column1: ColumnProps<unitExpensesMake.column1>[] = [
  { label: "单据号", prop: "docNum", width: 200 },
  {
    label: "审批状态",
    prop: "operateState",
    width: 200
  },
  { label: "单据日期", prop: "applyDate", width: 200, align: "center" },
  { label: "险种", prop: "insuranceName", width: 200 },
  {
    label: "用款期间",
    prop: "useDate",
    width: 200,
    align: "center"
  },
  {
    label: "请款金额（万元）",
    prop: "totalAmount",
    width: 200
  },
  {
    label: "请款单位",
    prop: "agencyName",
    width: 200
  },
  { label: "制单人", prop: "createName", width: 150 },
  { label: "操作", prop: "operation", width: 180, align: "center" }
];
const column2: ColumnProps<unitExpensesMake.column2>[] = [
  { label: "单据号", prop: "docNum", width: 200 },
  {
    label: "审批状态",
    prop: "operateState",
    width: 200
  },
  { label: "单据日期", prop: "applyDate", width: 200, align: "center" },
  { label: "险种", prop: "insuranceName", width: 200 },
  {
    label: "用款期间",
    prop: "useDate",
    width: 200,
    align: "center"
  },
  {
    label: "请款金额（万元）",
    prop: "totalAmount",
    width: 200
  },
  {
    label: "请款单位",
    prop: "agencyName",
    width: 200
  },
  { label: "制单人", prop: "createName", width: 150 },
  { label: "退回状态", prop: "backStatus", width: 150 },
  { label: "退回原因", prop: "backReason", width: 150 },
  { label: "操作", prop: "operation", width: 180, align: "center" }
];
const column3: ColumnProps<unitExpensesMake.column3>[] = [
  { label: "单据号", prop: "docNum", width: 200 },
  {
    label: "审批状态",
    prop: "operateState",
    width: 200
  },
  { label: "上报状态", prop: "collectFlag", width: 200 },
  { label: "单据日期", prop: "applyDate", width: 200, align: "center" },
  { label: "用款期间", prop: "useDate", width: 200, align: "center" },
  {
    label: "请款单位",
    prop: "agencyName",
    width: 200
  },
  { label: "险种", prop: "insuranceName", width: 200 },
  {
    label: "请款金额（万元）",
    prop: "totalAmount",
    width: 200
  },
  { label: "制单人", prop: "createName", width: 150 },
  { label: "操作", prop: "operation", width: 180, align: "center" }
];
const column4: ColumnProps<unitExpensesMake.column4>[] = [
  { label: "单据号", prop: "docNum", width: 200 },
  {
    label: "审批状态",
    prop: "operateState",
    width: 200
  },
  { label: "下拨状态", prop: "allocateFlag", width: 200 },
  { label: "单据日期", prop: "applyDate", width: 200, align: "center" },
  { label: "用款期间", prop: "useDate", width: 200, align: "center" },
  {
    label: "请款单位",
    prop: "agencyName",
    width: 200
  },
  { label: "险种", prop: "insuranceName", width: 200 },
  {
    label: "请款金额（万元）",
    prop: "totalAmount",
    width: 200
  },
  { label: "制单人", prop: "createName", width: 150 },
  { label: "操作", prop: "operation", width: 180, align: "center" }
];
let tableData = ref([]);
const activeKey = ref("-1");
const tabs = [
  { label: "全部", value: "-1" },
  { label: "未提交", value: "0" },
  { label: "已提交", value: "1" },
  { label: "驳回", value: "2" }
];
const paginationData = reactive({
  total: 0,
  pageSize: 50,
  pageNum: 1
});
const getData = async () => {
  const params = JSON.parse(JSON.stringify(toRaw(formData)));
  console.log(params.dateType);
  params.pageSize = paginationData.pageSize;
  params.pageNum = paginationData.pageNum;
  params.businessType = route.query.businessType;
  let url = `/smfm/unitDetail/pageList`;
  if (activeKey.value == "1") {
    params.tabFlag = "handled";
    params.bizTypeCode = route.query.bizTypeCode;
    url = `/smfm/unitDetail/getAuditingList`;
  } else if (activeKey.value == "2") {
    params.tabFlag = "reject";
    params.bizTypeCode = route.query.bizTypeCode;
    url = `/smfm/unitDetail/getAuditingList`;
  } else if (activeKey.value == "0") {
    params.operateState = 0;
  }
  const { code, data, msg } = await proxy.$axios.post(url, params);
  if (code === 0) {
    tableData.value = data.rows;
    paginationData.total = data.total;
  } else {
    tableData.value = [];
    paginationData.total = 0;
    proxy.$ElMessage.error(msg);
  }
};
const tabClick = val => {
  activeKey.value = val.paneName;
  getData();
};
let agencyList = ref([]);
let insuranceList = ref([]);
const getInsuranceList = async () => {
  const { data } = await proxy.$axios.get("/api/smc/platFormBasicData/list?eleCode=XZ");
  insuranceList.value = data;
};
const getAgencyList = async () => {
  const { data } = await proxy.$axios.get("/api/smc/platFormBasicData/agencyList");
  agencyList.value = data;
};

const formData = reactive({
  docNum: "",
  dateType: "",
  useDate: "",
  agencyCode: [],
  insuranceCode: ""
});
let dateTypeList = ref([
  {
    label: "季度请款",
    value: "0"
  },
  {
    label: "月度请款",
    value: "1"
  },
  {
    label: "零星资金申请",
    value: "2"
  }
]);

const formItems = computed(() => {
  return [
    {
      htmlType: "input",
      label: "单据号",
      ruleId: "docNum"
    },
    {
      htmlType: "select",
      label: "请款类型",
      ruleId: "dateType",
      list: dateTypeList.value
    },
    {
      htmlType: "date",
      label: "费款所属期0",
      ruleId: "useDate",
      type: "year",
      format: "YYYY",
      valueFormat: "YYYY",
      hide: formData.dateType !== "0"
    },
    {
      htmlType: "date",
      label: "费款所属期1",
      ruleId: "useDate",
      type: "month",
      format: "YYYY-MM",
      valueFormat: "YYYY-MM",
      hide: formData.dateType !== "1"
    },
    {
      htmlType: "date",
      label: "费款所属期2",
      ruleId: "useDate",
      type: "date",
      format: "yyyy-MM-dd",
      valueFormat: "yyyy-MM-dd",
      hide: formData.dateType !== "2"
    },
    {
      htmlType: "select",
      label: "请款单位",
      ruleId: "agencyCode",
      list: agencyList.value.length
        ? agencyList.value.map(item => {
            return { label: item.name, value: item.code };
          })
        : []
    },
    {
      htmlType: "select",
      label: "险种",
      ruleId: "insuranceCode",
      list: insuranceList.value.map(item => {
        return { label: item.chrName, value: item.chrCode };
      })
    }
  ];
});

/*新增*/
let visible = ref(false);
let formDataAdd = ref({
  agencyCode: "",
  agencyName: "",
  applyDate: "",
  attachment: "",
  contactPerson: "",
  contactPhone: "",
  createName: "",
  docNum: "",
  id: "",
  insuranceCode: "",
  insuranceName: "",
  dateType: "0",
  unitDetailItemList: [],
  summary: "",
  totalAmount: 0,
  afterRequestTotalAmount: 0,
  useDate: "",
  monthAddAmount: "0",
  monthAmount: "0",
  monthPayAmount: "0"
});
const add = () => {
  visible.value = true;
  formDataAdd.value = {
    agencyCode: "",
    agencyName: "",
    applyDate: "",
    attachment: "",
    contactPerson: "",
    contactPhone: "",
    createName: "",
    docNum: "",
    id: "",
    insuranceCode: "",
    insuranceName: "",
    dateType: "0",
    unitDetailItemList: [],
    summary: "",
    totalAmount: 0,
    afterRequestTotalAmount: 0,
    useDate: "",
    monthAddAmount: "0",
    monthAmount: "0",
    monthPayAmount: "0"
  };
};
const changeDateType = val => {
  formDataAdd.value.dateType = val;
};
const changeInsuranceCode = val => {
  console.log(val);
};
onMounted(() => {
  getInsuranceList();
  getAgencyList();
  getData();
});
</script>
