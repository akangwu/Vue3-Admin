<template>
  <!-- 表格内容 card -->
  <div class="card table-main" :style="{ height: isDialogTable ? height : '' }">
    <!-- 表格头部 操作按钮 -->
    <div class="table-header">
      <div class="header-button-lf">
        <slot name="tableHeader" :selectedIds="selectedIds" :selectedRows="selectedRows" :isSelected="isSelected" />
      </div>
    </div>
    <!-- 表格主体 -->
    <el-table
      ref="tableRef"
      v-bind="$attrs"
      :data="data"
      :border="border"
      :row-key="rowKey"
      stripe
      fit
      @selection-change="selectionChange"
    >
      <!-- 默认插槽 -->
      <slot />
      <!--多选-->
      <el-table-column align="center" type="selection" v-if="ifSelect" />
      <!--单选-->
      <el-table-column label="" align="center" width="50" v-if="ifRadio" fixed="left">
        <template #default="scope">
          <el-radio label="" v-model="templateRadio" @change="getCurrentRow(scope.row)"> </el-radio>
        </template>
      </el-table-column>
      <!--序号-->
      <el-table-column align="center" v-if="ifIndex" :label="indexName" :width="indexWidth">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <template v-for="item in tableColumns" :key="item">
        <!-- expand 支持 tsx 语法 && 作用域插槽 (tsx > slot) -->
        <el-table-column v-bind="item" :align="item.align ?? 'center'" v-if="item.type === 'expand'">
          <template #default="scope">
            <!-- expand -->
            <template v-if="item.type === 'expand'">
              <component :is="item.render" v-bind="scope" v-if="item.render" />
              <slot v-else :name="item.type" v-bind="scope" />
            </template>
          </template>
        </el-table-column>
        <!-- other 循环递归 -->
        <TableColumn v-if="!item.type && item.prop && item.isShow" :column="item">
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </TableColumn>
      </template>
      <!-- 插入表格最后一行之后的插槽 -->
      <template #append>
        <slot name="append" />
      </template>
      <!-- 表格无数据情况 -->
      <template #empty>
        <div class="table-empty">
          <slot name="empty">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无数据</div>
          </slot>
        </div>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts" name="VTable">
import { ref, provide } from "vue";
import { useSelection } from "@/hooks/useSelection";
import { ColumnProps } from "@/components/VTable/interface";
import { ElTable, TableProps } from "element-plus";
import TableColumn from "./components/TableColumn.vue";

interface VTableProps extends Partial<Omit<TableProps<any>, "data">> {
  ifIndex?: boolean; // 是否显示序号列 ==> 非必传（默认为false）
  indexName?: string; // 默认是序号 ==> 非必传（默认为'序号'）
  indexWidth?: string; // 序号宽度 ==> 非必传（默认为'80'）
  isDialogTable?: boolean; // 是否表格高度
  height?: string; // dialog 表格高度 ==> 非必传（默认为'400'）
  ifSelect?: boolean; // 是否显示多选框 ==> 非必传（默认为false）
  ifRadio?: boolean; // 是否显示单选框 ==> 非必传（默认为false）
  column: ColumnProps[]; // 列配置项
  data: any[]; // 列表数据
  requestAuto?: boolean; // 是否自动执行请求 axios ==> 非必传（默认为true）
  requestError?: (params: any) => void; // 表格 axios 请求错误监听 ==> 非必传
  dataCallback?: (data: any) => any; // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
  formatter?: (data: any) => any; //列formatter函数
  title?: string; // 表格标题，目前只在打印的时候用到 ==> 非必传
  initParam?: any; // 初始化请求参数 ==> 非必传（默认为{}）
  border?: boolean; // 是否带有纵向边框 ==> 非必传（默认为true）
  rowKey?: string; // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<VTableProps>(), {
  requestAuto: true,
  ifIndex: false,
  indexName: "序号",
  indexWidth: "80",
  isDialogTable: false, // 是否表格高度
  height: "400px", // dialog 表格高度 ==> 非必传（默认为'400'）
  ifSelect: false,
  ifRadio: false,
  column: () => [],
  data: () => [],
  initParam: {},
  border: true,
  rowKey: "id",
  formatter: () => {} //列formatter函数
});

// 单选
const templateRadio = ref(false);

// 表格 DOM 元素
const tableRef = ref<InstanceType<typeof ElTable>>();

// 表格多选 Hooks
const { selectionChange, selectedRows, selectedIds, isSelected } = useSelection(props.rowKey);

// 清空选中数据列表
const clearSelection = () => tableRef.value!.clearSelection();

// 接收 column 并设置为响应式
const tableColumns = ref<ColumnProps[]>(props.column);

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充搜索下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>());
provide("enumMap", enumMap);
const setEnumMap = async (col: ColumnProps) => {
  if (!col.enum) return;
  // 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  if (typeof col.enum !== "function") return enumMap.value.set(col.prop!, col.enum!);
  const { data } = await col.enum();
  enumMap.value.set(col.prop!, data);
};

// 扁平化 column
const flatColumnsFunc = (column: ColumnProps[], flatArr: ColumnProps[] = []) => {
  column.forEach(async col => {
    if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children));
    flatArr.push(col);

    // 给每一项 column 添加 isShow && isFilterEnum 默认属性
    col.isShow = col.isShow ?? true;
    col.isFilterEnum = col.isFilterEnum ?? true;

    // 设置 enumMap
    await setEnumMap(col);
  });
  return flatArr.filter(item => !item._children?.length);
};

// flatColumns
const flatColumns = ref<ColumnProps[]>();
flatColumns.value = flatColumnsFunc(tableColumns.value);

const getCurrentRow = row => {
  console.log(JSON.parse(JSON.stringify(row)), "1111");
  //单选事件
  //this.selectionData = [row.row];
  this.$emit("singleSelect", row.row, row.$index);
};

// 暴露给父组件的参数和方法(外部需要什么，都可以从这里暴露出去)
defineExpose({
  element: tableRef,
  clearSelection,
  enumMap,
  isSelected,
  selectedRows,
  selectedIds
});
</script>
<style lang="scss" scoped>
:deep(.el-table) {
  .el-radio__label {
    padding: 0;
  }
}
</style>
