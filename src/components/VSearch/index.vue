<template>
	<div class="card table-search">
		<el-form ref="formRef" :model="formData">
			<Grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCol">
				<GridItem v-for="(item, index) in formItems" :key="item.prop" v-bind="getResponsive(item)" :index="index" :hide="item?.search?.hide">
					<el-form-item :label="`${item.label} :`" :prop="item.ruleId" :label-width="item.search?.labelWidth || 80" label-position="right" v-if="!item?.search?.hide">
						<!-- 输入框 -->
						<el-input
							v-if="item.htmlType === 'input' && !item?.search?.hide"
							v-model="formData[item.ruleId]"
							:clearable="item?.search?.clear"
							:disabled="item?.search?.disabled"
							:placeholder="`请输入${item.label}`"
						/>
						<!-- 年、月、日、多个日期的选择 -->
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
						<!-- 日期范围 -->
						<el-date-picker
							v-if="item.htmlType === 'dateRange' && !item?.search?.hide"
							v-model="formData[item.ruleId]"
							:clearable="item?.search?.clear"
							:disabled="item?.search?.disabled"
							:type="item.type"
							:format="item.format"
							:value-format="item.valueFormat"
							range-separator="至"
							:start-placeholder="item.type === 'daterange' ? '开始日期' : item.type === 'monthrange' ? '开始月份' : item.type === 'datetimerange' ? '开始时间' : ''"
							:end-placeholder="item.type === 'daterange' ? '结束日期' : item.type === 'monthrange' ? '结束月份' : item.type === 'datetimerange' ? '结束时间' : ''"
						/>

						<!-- 下拉列表 -->
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
								:label="item?.search?.code ? `[${item1.value}]${item1.label}` : item1.label"
								:value="item1.value"
								:disabled="item1?.disabled"
							></el-option>
						</el-select>

						<!-- 单选框 -->
						<el-radio-group v-if="item.htmlType === 'radioGroup' && !item?.search?.hide" v-model="formData[item.ruleId]" :disabled="item?.search?.disabled">
							<el-radio-button v-for="(val, i) in item.list" :value="val.value" :key="i" :disabled="val?.disabled">
								{{ val.label }}
							</el-radio-button>
						</el-radio-group>

						<!-- 金额范围 -->
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
						<el-button v-if="formItems.length >= searchCol && showMore" type="primary" link class="search-isOpen" @click="setCollapsed">
							{{ collapsed ? '展开' : '收起' }}
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

<script setup name="VSearch">
import { ref, watch, nextTick } from 'vue'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

// 定义组件的 props
const props = defineProps({
	formItems: {
		type: Array,
		default: () => []
	},
	formData: {
		type: Object,
		default: () => ({})
	},
	searchCol: {
		type: [Number, Object],
		default: 3
	},
	showMore: {
		type: Boolean,
		default: true
	}
})
// 获取当前组件实例的 proxy 对象
const { proxy } = getCurrentInstance()
// 根据 item 的搜索配置获取响应式布局属性
const getResponsive = item => {
	return {
		span: item.search?.span,
		offset: item.search?.offset ?? 0,
		xs: item.search?.xs,
		sm: item.search?.sm,
		md: item.search?.md,
		lg: item.search?.lg,
		xl: item.search?.xl
	}
}

// 控制搜索表单的折叠状态
const collapsed = ref(false)
const setCollapsed = () => {
	if (props.showMore) {
		collapsed.value = !collapsed.value
	} else {
		collapsed.value = false
	}
}
setCollapsed()

// 引用 Grid 组件实例
const gridRef = ref()

// 定义组件的 emits
const emit = defineEmits(['formData', 'getData', 'resetChange'])

// 查询按钮点击事件处理函数
const search = () => {
	console.log('search', props.formData)
	emit('getData', props.formData)
}

// 引用表单组件实例
const formRef = ref(null)

// 重置按钮点击事件处理函数
const reset = formEl => {
	if (!formEl) return
	nextTick(() => {
		formEl.resetFields()
	})
	emit('resetChange', props.formData)
}

// 监听 formData 的变化，处理日期类型的数据
watch(
	props.formData,
	() => {
		for (let key in props.formData) {
			for (const formItem of props.formItems) {
				if (formItem.htmlType === 'date' && !props.formData[key]) {
					props.formData[key] = ''
				}
			}
		}
	},
	{
		deep: true
	}
)

// 处理金额范围输入框的焦点和失焦事件
const setMinMoney = (item, e, type) => {
	if (e === 'focus') {
		if (type === 'min') {
			props.formData[item.ruleId][0] = proxy.funcs.moneyTransferNum(props.formData[item.ruleId][0])
		} else {
			props.formData[item.ruleId][1] = proxy.funcs.moneyTransferNum(props.formData[item.ruleId][1])
		}
	} else {
		if (type === 'min') {
			props.formData[item.ruleId][0] = proxy.funcs.thousandPoint(props.formData[item.ruleId][0])
		} else {
			props.formData[item.ruleId][1] = proxy.funcs.thousandPoint(props.formData[item.ruleId][1])
		}
	}
}
</script>
