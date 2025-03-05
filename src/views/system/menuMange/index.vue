<template>
	<div class="table-box">
		<v-table ref="proTable" row-key="path" :column="columns" if-index>
			<!-- 表格 header 按钮 -->
			<template #tableHeader>
				<el-button type="primary" :icon="CirclePlus">新增菜单</el-button>
			</template>
			<!-- 菜单图标 -->
			<template #icon="scope">
				<el-icon :size="18">
					<component :is="scope.row.meta.icon" />
				</el-icon>
			</template>
			<!-- 菜单操作 -->
			<template #operation="scope">
				<el-button type="primary" link :icon="EditPen">编辑</el-button>
				<el-button type="primary" link :icon="Delete" @click="deleteMenu(scope.row)">删除</el-button>
			</template>
		</v-table>
	</div>
</template>

<script setup name="menuMange">
import { ref } from 'vue'
import { getAuthMenuListApi } from '@/axios/modules/login'
import { Delete, EditPen, CirclePlus } from '@element-plus/icons-vue'
import { useHandleData } from '@/hooks/useHandleData'

const proTable = ref()

// 表格配置项
const columns = [
	{ type: 'index', label: '#', width: 150 },
	{ prop: 'meta.title', label: '菜单名称', align: 'left' },
	{ prop: 'meta.icon', label: '菜单图标' },
	{ prop: 'name', label: '菜单 name' },
	{ prop: 'path', label: '菜单路径', width: 300 },
	{ prop: 'component', label: '组件路径', width: 300 },
	{ prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]

// 删除菜单（示例、根据自己后端接口来）
const deleteMenu = async (params) => {
	await useHandleData(getAuthMenuListApi, { path: [params.path] }, `删除【${params.meta.title}】菜单`)
	proTable.value.getTableList()
}
</script>
