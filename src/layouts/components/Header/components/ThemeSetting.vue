<template>
	<div class="theme-setting">
		<i :class="'iconfont icon-zhuti'" class="toolBar-icon" @click="openDrawer" />
	</div>
</template>

<script setup>
import mittBus from '@/utils/mittBus'
const openDrawer = () => {
	mittBus.emit('openThemeDrawer')
}
</script>
