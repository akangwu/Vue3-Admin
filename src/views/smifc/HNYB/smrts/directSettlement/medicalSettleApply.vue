<template>
  <div class="table-box">
    <ProTable ref="proTable" title="药采结算申请" ifIndex :columns="columns" :requestApi="getTableList"> </ProTable>
  </div>
</template>

<script setup lang="ts" name="medicalSettleApply">
import { getUserList } from "@/api/modules/user";
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
</script>
