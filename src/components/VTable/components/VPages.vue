<template>
  <!-- 分页组件 -->
  <el-pagination
    background
    v-model:current-page="paginationData.pageNum"
    v-model:page-size="paginationData.pageSize"
    :page-sizes="[50, 100, 200, 500]"
    :total="total"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup lang="ts" name="v-page">
const emit = defineEmits(["getData", "update:pageSize", "update:pageNum"]);
interface Pages {
  pageSize: number;
  pageNum: number;
  total: number;
}
const props = defineProps<Pages>();
let paginationData = reactive({
  pageSize: props.pageSize,
  pageNum: props.pageNum,
  total: props.total
});
/**
 * @description 每页条数改变
 * @param {Number} val 当前条数
 * @return void
 * */
const handleSizeChange = (val: number) => {
  emit("update:pageSize", val);
  paginationData.pageSize = val;
  emit("getData", paginationData);
};

/**
 * @description 当前页改变
 * @param {Number} val 当前页
 * @return void
 * */
const handleCurrentChange = (val: number) => {
  emit("update:pageNum", val);
  emit("getData", paginationData);
};
</script>
