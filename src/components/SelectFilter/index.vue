<template>
	<div class="select-filter">
		<div v-for="item in data" :key="item.key" class="select-filter-item">
			<div class="select-filter-item-title">
				<span>{{ item.title }} ：</span>
			</div>
			<span v-if="!item.options.length" class="select-filter-notData">暂无数据 ~</span>
			<el-scrollbar>
				<ul class="select-filter-list">
					<li
						v-for="option in item.options"
						:key="option.value"
						:class="{ active: option.value === selected[item.key] || (Array.isArray(selected[item.key]) && selected[item.key].includes(option.value)) }"
						@click="select(item, option)"
					>
						<slot :row="option">
							<el-icon v-if="option.icon">
								<component :is="option.icon" />
							</el-icon>
							<span>{{ option.label }}</span>
						</slot>
					</li>
				</ul>
			</el-scrollbar>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
	data: {
		type: Array,
		default: () => []
	},
	defaultValues: {
		type: Object,
		default: () => ({})
	}
})

const select = (item, option) => {
	if (!item.multiple) {
		if (selected.value[item.key] !== option.value) {
			selected.value[item.key] = option.value
		}
	} else {
		if (item.options[0].value === option.value) {
			selected.value[item.key] = [option.value]
		} else if (selected.value[item.key].includes(option.value)) {
			let currentIndex = selected.value[item.key].findIndex(s => s === option.value)
			selected.value[item.key].splice(currentIndex, 1)
			if (selected.value[item.key].length === 0) {
				selected.value[item.key] = [item.options[0].value]
			}
		} else {
			selected.value[item.key].push(option.value)
			if (selected.value[item.key].includes(item.options[0].value)) {
				selected.value[item.key].splice(0, 1)
			}
		}
	}
	emit('change', selected.value)
}

const emit = defineEmits(['change'])

const selected = ref({})
watch(
	() => props.defaultValues,
	() => {
		props.data.forEach(item => {
			if (item.multiple) {
				selected.value[item.key] = props.defaultValues[item.key] || []
			} else {
				selected.value[item.key] = props.defaultValues[item.key] || ''
			}
		})
	},
	{ deep: true, immediate: true }
)
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
