<template>
	<div>
		<div class="card content-box">
			<span class="text">防抖指令 🍇🍇🍇🍓🍓🍓</span>
			<el-button v-debounce:500 @click="debounceClick">防抖按钮</el-button>
			<!--<el-button type="primary" v-debounce:500 @click="debounceClick">防抖按钮 (0.5秒后执行)</el-button>
			<div v-debounce:500 @click="debounceClick">div防抖按钮 (0.5秒后执行)</div>
			<span v-debounce:500 @click="debounceClick">span防抖按钮 (0.5秒后执行)</span>
			<p v-debounce:500 @click="debounceClick">p防抖按钮 (0.5秒后执行)</p>-->
		</div>
		<div class="card content-box" style="margin-top: 50px">
			<span class="text">节流指令 🍇🍇🍇🍓🍓🍓</span>
			<!--<el-button v-throttle:1000 @click="throttleClick">防抖按钮</el-button>-->
			<!--<el-button type="primary" v-throttle:1000 @click="throttleClick">节流按钮 (每隔1S秒后执行)</el-button>
			<div v-throttle:1000 @click="throttleClick">div防抖按钮 (0.5秒后执行)</div>
			<span v-throttle:1000 @click="throttleClick">span防抖按钮 (0.5秒后执行)</span>
			<p v-throttle:1000 @click="throttleClick">p防抖按钮 (0.5秒后执行)</p>-->
		</div>
	</div>
</template>

<script setup name="debounceDirectAndThrottleDirect">
import { ElMessage } from 'element-plus'
const debounceClick = () => {
	ElMessage.success('我是防抖按钮触发的事件 🍍🍓🍌')
}

const throttleClick = () => {
	ElMessage.success('我是节流按钮触发的事件 🍍🍓🍌')
}
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
