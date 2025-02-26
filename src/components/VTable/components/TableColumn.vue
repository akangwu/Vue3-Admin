<template>
  <!-- 渲染 el-table-column 组件，根据 column.isShow 决定是否显示 -->
  <el-table-column
    v-if="column.isShow"
    v-bind="column"
    fit
    :align="column.align ?? 'left'"
    :header-align="column.headerAlign ?? 'center'"
    :show-overflow-tooltip="column.showOverflowTooltip ?? column.prop !== 'operation'"
  >
    <!-- 默认插槽内容 -->
    <template #default="scope">
      <!-- 如果列有子列，则递归渲染子列 -->
      <template v-if="column._children">
        <TableColumn v-for="child in column._children" :key="child.prop" :column="child" />
      </template>
      <!-- 如果列有自定义渲染函数，则使用该函数渲染内容 -->
      <template v-else-if="column.render">
        {{ column.render(scope) }}
      </template>
      <!-- 如果列有作用域插槽，则使用该插槽渲染内容 -->
      <template v-else-if="slots[handleProp(column.prop)]">
        <component :is="slots[handleProp(column.prop)]" :scope="scope" />
      </template>
      <!-- 如果列有 tag 属性，则使用 el-tag 组件渲染内容 -->
      <template v-else-if="column.tag">
        <el-tag :type="getTagType(column, scope)">
          {{ renderCellData(column, scope) }}
        </el-tag>
      </template>
      <!-- 如果列有 formatter 属性，则直接使用该属性的值 -->
      <template v-else-if="column.formatter">
        {{ column.formatter }}
      </template>
      <!-- 默认情况下，渲染单元格数据 -->
      <template v-else>
        {{ renderCellData(column, scope) }}
      </template>
    </template>
    <!-- 表头插槽内容 -->
    <template #header>
      <!-- 如果列有自定义表头渲染函数，则使用该函数渲染表头 -->
      <template v-if="column.headerRender">
        {{ column.headerRender(column) }}
      </template>
      <!-- 如果列有作用域插槽，则使用该插槽渲染表头 -->
      <template v-else-if="slots[`${handleProp(column.prop)}Header`]">
        <component :is="slots[`${handleProp(column.prop)}Header`]" :row="column" />
      </template>
      <!-- 默认情况下，渲染列的标签 -->
      <template v-else>
        {{ column.label }}
      </template>
    </template>
  </el-table-column>
</template>

<script lang="ts" setup name="TableColumn">
import { inject, ref, useSlots } from "vue";
import { ColumnProps } from "@/components/VTable/interface";
import { filterEnum, formatValue, handleProp, handleRowAccordingToProp } from "@/utils";

// 定义组件的 props，接收一个 ColumnProps 类型的 column 对象
defineProps<{ column: ColumnProps }>();

// 获取作用域插槽
const slots = useSlots();

// 从父组件注入 enumMap，用于枚举值的映射
const enumMap = inject("enumMap", ref(new Map()));

// 渲染表格数据的方法
const renderCellData = (item: ColumnProps, scope: { [key: string]: any }) => {
  // 根据 isFilterEnum 属性判断是否需要过滤枚举值
  return enumMap.value.get(item.prop) && item.isFilterEnum
    ? filterEnum(handleRowAccordingToProp(scope.row, item.prop!), enumMap.value.get(item.prop)!, item.fieldNames)
    : formatValue(handleRowAccordingToProp(scope.row, item.prop!));
};

// 获取 tag 类型的方法
const getTagType = (item: ColumnProps, scope: { [key: string]: any }) => {
  // 根据枚举值和字段名获取 tag 类型
  return filterEnum(handleRowAccordingToProp(scope.row, item.prop!), enumMap.value.get(item.prop), item.fieldNames, "tag");
};
</script>
