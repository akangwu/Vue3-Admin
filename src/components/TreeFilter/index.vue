<template>
	<div class="card filter">
		<h4 class="title sle" v-if="title">{{ title }}</h4>
		<el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable />
		<el-scrollbar :style="{ height: title ? `calc(100% - 95px)` : `calc(100% - 56px)` }">
			<el-tree
				ref="treeRef"
				default-expand-all
				:node-key="id"
				:data="multiple ? treeData : treeAllData"
				:show-checkbox="multiple"
				:check-strictly="false"
				:current-node-key="!multiple ? selected : ''"
				:highlight-current="!multiple"
				:expand-on-click-node="false"
				:check-on-click-node="multiple"
				:props="defaultProps"
				:filter-node-method="filterNode"
				:default-checked-keys="multiple ? selected : []"
				@node-click="handleNodeClick"
				@check="handleCheckChange"
			>
				<template #default="scope">
					<span class="el-tree-node__label">
						<slot :row="scope">
							{{ scope.node.label }}
						</slot>
					</span>
				</template>
			</el-tree>
		</el-scrollbar>
	</div>
</template>

<script setup name="TreeFilter">
import { ref, watch, onBeforeMount, nextTick } from 'vue'
import { ElTree } from 'element-plus'

const props = defineProps({
	requestApi: null,
	data: null,
	title: null,
	id: id,
	label: label,
	multiple: false,
	defaultValue: null
})

const defaultProps = {
	children: 'children',
	label: props.label
}

const treeRef = ref(null)
const treeData = ref([])
const treeAllData = ref([])

const selected = ref(null)

const setSelected = () => {
	if (props.multiple) {
		selected.value = Array.isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue]
	} else {
		selected.value = typeof props.defaultValue === 'string' ? props.defaultValue : ''
	}
}

onBeforeMount(async () => {
	setSelected()
	if (props.requestApi) {
		const { data } = await props.requestApi()
		treeData.value = data
		treeAllData.value = [{ id: '', [props.label]: '全部' }, ...data]
	}
})

watch(
	() => props.defaultValue,
	() => {
		nextTick(() => {
			setSelected()
		})
	},
	{ deep: true, immediate: true }
)

watch(
	() => props.data,
	() => {
		if (props.data && props.data.length) {
			treeData.value = props.data
			treeAllData.value = [{ id: '', [props.label]: '全部' }, ...props.data]
		}
	},
	{ deep: true, immediate: true }
)

const filterText = ref('')

watch(filterText, val => {
	treeRef.value.filter(val)
})

const filterNode = (value, data, node) => {
	if (!value) return true
	let parentNode = node.parent
	let labels = [node.label]
	let level = 1
	while (level < node.level) {
		labels.push(parentNode.label)
		parentNode = parentNode.parent
		level++
	}
	return labels.some(label => label.indexOf(value) !== -1)
}

const emit = defineEmits(['change'])

const handleNodeClick = data => {
	if (props.multiple) return
	emit('change', data[props.id])
}

const handleCheckChange = () => {
	emit('change', treeRef.value.getCheckedKeys())
}

defineExpose({
	treeData,
	treeAllData,
	treeRef
})
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
