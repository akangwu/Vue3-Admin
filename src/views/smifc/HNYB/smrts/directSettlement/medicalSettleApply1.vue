<template>
  <div class="table-box">
    <!-- 查询表单 card -->
    <v-search @get-data="getData" @reset-change="reset" v-show="isShowSearch" :form-items="formItems" :formData="formData" />
    <v-table ref="proTable" title="药采结算申请" ifIndex :columns="columns" :requestApi="getTableList"> </v-table>
  </div>
</template>

<script setup lang="ts" name="medicalSettleApply">
import { computed, ref, reactive } from "vue";
import { getUserList } from "@/axios/modules/user";
import { MedicalSettleApply } from "../medicalSettleApply";
const columns: ColumnProps<MedicalSettleApply.ResList>[] = [
  { label: "结算批次号", prop: "statementId", width: 200 },
  {
    label: "业务批次号",
    prop: "p4",
    width: 200,
    search: {
      el: "input"
    }
  },
  { label: "财务批次号", prop: "p5", width: 200 },
  { label: "创建时间", prop: "createDate", width: 200, align: "center" },
  {
    label: "费款所属期",
    prop: "p1",
    width: 150,
    align: "center",
    search: {
      el: "date-picker",
      props: {
        type: "monthrange",
        valueFormat: "YYYY-MM",
        clearable: true
      }
    }
  },
  { label: "统筹区", prop: "p7", width: 200 },
  {
    label: "险种",
    prop: "insuranceName",
    width: 200,
    search: {
      el: "tree-select",
      props: { filterable: true }
    }
  },
  { label: "医保经办机构", prop: "agencyName", width: 200 },
  {
    label: "业务类型",
    prop: "p11",
    width: 250,
    search: {
      el: "tree-select",
      props: { filterable: true }
    }
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
    width: 150,
    search: {
      el: "tree-select",
      props: { filterable: true }
    }
  },
  {
    label: "审核时间",
    prop: "operateTime",
    width: 150,
    align: "center",
    search: {
      el: "date-picker",
      props: {
        type: "datetimerange",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        clearable: true
      }
    }
  },
  { label: "操作", prop: "operation", width: 180, align: "center" }
];
// 是否显示搜索模块
const isShowSearch = ref(true);

const getData = () => {
  console.log(formData, "4444888888");
};
const reset = () => {};

const getTableList = (params: any) => {
  const params1 = {
    p4: "",
    p1: "",
    insuranceName: "",
    p11: "",
    operateState: "",
    operateTime: ""
  };
  let newParams = Object.assign(params, params1);
  Object.assign(params, params1);
  console.log(Object.assign(params, params1), "33343434343");
  return getUserList(newParams);
  /*const res = {
    code: 0,
    data: {
      list: [
        {
          statementId: "2",
          p4: "2",
          p5: "2",
          createDate: "2",
          p1: "2",
          p7: "2",
          insuranceName: "2",
          agencyName: "2",
          p11: "2",
          p12: "2",
          p13: "2",
          totalOriginalCount: "2",
          vouNo: "2",
          vouDate: "2",
          submitName: "2",
          submitTime: "2",
          operateState: "2",
          operateTime: "2"
        }
      ],
      total: 2000
    },
    msg: "成功"
  };
  return res;*/
};

const formData = reactive({
  aaz617: "5",
  year: "",
  month: "",
  dealDate: "2024-03-18",
  dates: "",
  dataRangeDay: ["", ""],
  dataRangeMonth: ["", ""],
  dataRangeTime: "",
  recOrPayType: "",
  vouStatus: "",
  debitAmt: ["", ""]
});

const formItems = computed(() => {
  return [
    {
      htmlType: "input",
      label: "业务批次号	",
      ruleId: "aaz617",
      search: {
        disabled: false
      }
    },
    {
      htmlType: "date",
      label: "年",
      ruleId: "year",
      type: "year",
      format: "YYYY",
      valueFormat: "YYYY",
      search: {
        clear: false
      }
    },
    {
      htmlType: "date",
      label: "月",
      ruleId: "month",
      type: "month",
      format: "YYYY-MM",
      valueFormat: "YYYY-MM",
      search: {
        clear: true
      }
    },
    {
      htmlType: "date",
      label: "审核日期",
      ruleId: "dealDate",
      type: "date",
      format: "YYYY-MM-DD",
      valueFormat: "YYYY-MM-DD"
    },
    {
      htmlType: "date",
      label: "多个日期",
      ruleId: "dates",
      type: "dates",
      format: "YYYY-MM-DD",
      valueFormat: "YYYY-MM-DD"
    },
    {
      htmlType: "dateRange",
      label: "日期范围",
      ruleId: "dataRangeDay",
      type: "daterange",
      format: "YYYY-MM-DD",
      valueFormat: "YYYY-MM-DD"
    },
    {
      htmlType: "dateRange",
      label: "月份范围",
      ruleId: "dataRangeMonth",
      type: "monthrange",
      format: "YYYY-MM",
      valueFormat: "YYYY-MM"
    },
    {
      htmlType: "dateRange",
      label: "日期时间范围",
      ruleId: "dataRangeTime",
      type: "datetimerange",
      format: "YYYY-MM-DD HH:mm:ss",
      valueFormat: "YYYY-MM-DD HH:mm:ss"
    },
    {
      htmlType: "select",
      label: "收支类型",
      ruleId: "recOrPayType",
      list: [
        { label: "收入", value: "0" },
        { label: "支出", value: "1", disabled: true }
      ],
      search: {
        clear: true,
        filter: true
      }
    },
    {
      htmlType: "radioGroup",
      label: "入账状态",
      ruleId: "vouStatus",
      list: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "未入账",
          search: {
            disabled: true
          }
        },
        {
          value: "1",
          label: "已入账"
        },
        {
          value: "-12",
          label: "3标记不处理"
        },
        {
          value: "12",
          label: "3已入账"
        },
        {
          value: "-10",
          label: "5标记不处理"
        }
      ],
      search: {
        span: 2,
        disabled: false
      }
    },
    {
      htmlType: "moneyRange",
      label: "借方金额",
      ruleId: "debitAmt"
    }
  ];
});
</script>
