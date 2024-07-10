<template>
  <div class="card table-search">
    <el-form ref="formRef" :model="formData">
      <Grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCol">
        <GridItem
          v-for="(item, index) in formItems"
          :key="item.prop"
          v-bind="getResponsive(item)"
          :index="index"
          :hide="item?.search?.hide"
        >
          <el-form-item :label="`${item.label} :`" :prop="item.ruleId" v-if="!item?.search?.hide">
            <!--输入框-->
            <el-input
              v-if="item.htmlType === 'input' && !item?.search?.hide"
              v-model="formData[item.ruleId]"
              :clearable="item?.search?.clear"
              :disabled="item?.search?.disabled"
              :placeholder="`请输入${item.label}`"
            />
            <!--年、月、日、多个日期的选择-->
            <el-date-picker
              v-if="item.htmlType === 'date' && !item?.search?.hide"
              v-model="formData[item.ruleId]"
              :clearable="item?.search?.clear"
              :disabled="item?.search?.disabled"
              :placeholder="`请选择${item.label}`"
              :type="item.type"
              :format="item.format"
              :value-format="item.valueFormat"
            />
            <!--日期范围-->
            <el-date-picker
              v-if="item.htmlType === 'dateRange' && !item?.search?.hide"
              v-model="formData[item.ruleId]"
              :clearable="item?.search?.clear"
              :disabled="item?.search?.disabled"
              :type="item.type"
              :format="item.format"
              :value-format="item.valueFormat"
              range-separator="至"
              :start-placeholder="
                item.type === 'daterange'
                  ? '开始日期'
                  : item.type === 'monthrange'
                  ? '开始月份'
                  : item.type === 'datetimerange'
                  ? '开始时间'
                  : ''
              "
              :end-placeholder="
                item.type === 'daterange'
                  ? '结束日期'
                  : item.type === 'monthrange'
                  ? '结束月份'
                  : item.type === 'datetimerange'
                  ? '开始时间'
                  : ''
              "
            />

            <!--下拉列表-->
            <el-select
              v-if="item.htmlType === 'select' && !item?.search?.hide"
              v-model="formData[item.ruleId]"
              :placeholder="`请选择${item.label}`"
              :clearable="item?.search?.clear"
              :disabled="item?.search?.disabled"
              :filterable="item?.search?.filter"
              :multiple="item?.search?.multi"
            >
              <el-option
                v-for="(item1, index1) in item.list"
                :key="index1"
                :label="item1.label"
                :value="item1.value"
                :disabled="item1?.disabled"
              ></el-option>
            </el-select>

            <!--单选框-->
            <el-radio-group
              v-if="item.htmlType === 'radioGroup' && !item?.search?.hide"
              v-model="formData[item.ruleId]"
              :disabled="item?.search?.disabled"
            >
              <el-radio-button v-for="(val, i) in item.list" :value="val.value" :key="i" :disabled="val?.disabled">{{
                val.label
              }}</el-radio-button>
            </el-radio-group>

            <!--金额范围-->
            <span v-if="item.htmlType === 'moneyRange' && !item?.search?.hide" style="display: flex">
              <el-input
                v-model="formData[item.ruleId][0]"
                :clearable="item?.search?.clear"
                :disabled="item?.search?.disabled"
                placeholder="最小值"
                @focus="setMinMoney(item, 'focus', 'min')"
                @blur="setMinMoney(item, 'blur', 'min')"
              ></el-input>
              <span style="padding: 0 5px">-</span>
              <el-input
                v-model="formData[item.ruleId][1]"
                :clearable="item?.search?.clear"
                :disabled="item?.search?.disabled"
                placeholder="最大值"
                @focus="setMinMoney(item, 'focus', 'max')"
                @blur="setMinMoney(item, 'blur', 'max')"
              ></el-input>
            </span>
          </el-form-item>
        </GridItem>
        <GridItem suffix>
          <div class="operation">
            <el-button
              v-if="formItems.length >= searchCol && showMore"
              type="primary"
              link
              class="search-isOpen"
              @click="setCollapsed"
            >
              {{ collapsed ? "展开" : "收起" }}
              <el-icon class="el-icon--right">
                <component :is="collapsed ? ArrowDown : ArrowUp" />
              </el-icon>
            </el-button>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset(formRef)">重置</el-button>
          </div>
        </GridItem>
      </Grid>
    </el-form>
  </div>
</template>
<script setup lang="ts" name="VSearch">
import { getCurrentInstance, ref, watch } from "vue";

import { SearchColumnProps } from "@/components/VSearch/index";
import { BreakPoint } from "@/components/Grid/interface";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import Grid from "@/components/Grid/index.vue";
import GridItem from "@/components/Grid/components/GridItem.vue";

interface SearchFormProps {
  formItems: SearchColumnProps[]; // 搜索配置列
  formData: { [key: string]: any }; // 搜索参数
  searchCol?: number | Record<BreakPoint, number>; // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
  showMore?: boolean; //是否隐藏展开 收起按钮
}

// 默认值
const props = withDefaults(defineProps<SearchFormProps>(), {
  formItems: () => [],
  formData: () => ({}),
  searchCol: 3,
  showMore: true
});

// 获取响应式设置
const getResponsive = (item: ColumnProps) => {
  return {
    span: item.search?.span,
    offset: item.search?.offset ?? 0,
    xs: item.search?.xs,
    sm: item.search?.sm,
    md: item.search?.md,
    lg: item.search?.lg,
    xl: item.search?.xl
  };
};

// 是否默认折叠搜索项

const collapsed = ref(false);
const setCollapsed = () => {
  if (props.showMore) {
    collapsed.value = !collapsed.value;
  } else {
    collapsed.value = false;
  }
};
setCollapsed();
// 获取响应式断点
const gridRef = ref();

// 查询方法
const emit = defineEmits(["formData", "getData", "resetChange"]);
const search = () => {
  emit("getData", props.formData);
};

const formRef = ref<FormInstance>();

const reset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  nextTick(() => {
    formEl.resetFields();
  });
  emit("resetChange", props.formData);
};

//对formData数据进行监听，当数据是日期的参数，element-plus的clearable清空数据后日期参数会变成null，这里判断一下，给""
watch(
  props.formData,
  () => {
    for (let key in props.formData) {
      for (const formItem of props.formItems) {
        if (formItem.htmlType === "date" && !props.formData[key]) {
          props.formData[key] = "";
        }
      }
    }
  },
  {
    deep: true
  }
);

const { proxy } = getCurrentInstance();
const setMinMoney = (item: any, e: string, type: string) => {
  if (e === "focus") {
    if (type === "min") {
      props.formData[item.ruleId][0] = proxy.funcs.moneyTransferNum(props.formData[item.ruleId][0]);
    } else {
      props.formData[item.ruleId][1] = proxy.funcs.moneyTransferNum(props.formData[item.ruleId][1]);
    }
  } else {
    if (type === "min") {
      props.formData[item.ruleId][0] = proxy.funcs.thousandPoint(props.formData[item.ruleId][0]);
    } else {
      props.formData[item.ruleId][1] = proxy.funcs.thousandPoint(props.formData[item.ruleId][1]);
    }
  }
};
</script>
