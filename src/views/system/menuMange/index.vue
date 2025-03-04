<!--<template>-->
<!--	<div class="table-box">-->
<!--		<v-table ref="proTable" title="菜单列表" row-key="path" :indent="30" :columns="columns" :request-api="getAuthMenuListApi" :pagination="false" if-index>-->
<!--			&lt;!&ndash; 表格 header 按钮 &ndash;&gt;-->
<!--			<template #tableHeader>-->
<!--				<el-button type="primary" :icon="CirclePlus">新增菜单</el-button>-->
<!--			</template>-->
<!--			&lt;!&ndash; 菜单图标 &ndash;&gt;-->
<!--			<template #icon="scope">-->
<!--				<el-icon :size="18">-->
<!--					<component :is="scope.row.meta.icon" />-->
<!--				</el-icon>-->
<!--			</template>-->
<!--			&lt;!&ndash; 菜单操作 &ndash;&gt;-->
<!--			<template #operation="scope">-->
<!--				<el-button type="primary" link :icon="EditPen">编辑</el-button>-->
<!--				<el-button type="primary" link :icon="Delete" @click="deleteMenu(scope.row)">删除</el-button>-->
<!--			</template>-->
<!--		</v-table>-->
<!--	</div>-->
<!--</template>-->

<!--<script setup name="menuMange">-->
<!--import { ref } from 'vue'-->
<!--import { ColumnProps } from '@/components/VTable/interface'-->
<!--import { getAuthMenuListApi } from '@/axios/modules/login'-->
<!--import { Delete, EditPen, CirclePlus } from '@element-plus/icons-vue'-->
<!--import { useHandleData } from '@/hooks/useHandleData'-->

<!--const proTable = ref()-->

<!--// 表格配置项-->
<!--const columns: ColumnProps[] = [-->
<!--	{ type: 'index', label: '#', width: 150 },-->
<!--	{ prop: 'meta.title', label: '菜单名称', align: 'left', search: { el: 'input' } },-->
<!--	{ prop: 'meta.icon', label: '菜单图标' },-->
<!--	{ prop: 'name', label: '菜单 name' },-->
<!--	{ prop: 'path', label: '菜单路径', width: 300, search: { el: 'input' } },-->
<!--	{ prop: 'component', label: '组件路径', width: 300 },-->
<!--	{ prop: 'operation', label: '操作', width: 250, fixed: 'right' }-->
<!--]-->

<!--// 删除菜单（示例、根据自己后端接口来）-->
<!--const deleteMenu = async (params: Menu.MenuOptions) => {-->
<!--	await useHandleData(getAuthMenuListApi, { path: [params.path] }, `删除【${params.meta.title}】菜单`)-->
<!--	proTable.value.getTableList()-->
<!--}-->
<!--</script>-->
