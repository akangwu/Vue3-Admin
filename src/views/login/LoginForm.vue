<template>
	<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
		<el-form-item prop="username">
			<el-input v-model="loginForm.username" placeholder="用户名：admin / user">
				<template #prefix>
					<el-icon class="el-input__icon">
						<user />
					</el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input type="password" v-model="loginForm.password" placeholder="2密码：123456" show-password autocomplete="new-password">
				<template #prefix>
					<el-icon class="el-input__icon">
						<lock />
					</el-icon>
				</template>
			</el-input>
		</el-form-item>
	</el-form>
	<div class="login-btn">
		<el-button :icon="CircleClose" round @click="resetForm(loginFormRef)" size="large">重置</el-button>
		<el-button :icon="UserFilled" round @click="login(loginFormRef)" size="large" type="primary" :loading="loading"> 登录</el-button>
	</div>
</template>

<script setup>
import { HOME_URL } from '@/config'
import { initDynamicRouter } from '@/routers/modules/dynamicRouter'
import { useKeepAliveStore } from '@/stores/modules/keepAlive'
import { useTabsStore } from '@/stores/modules/tabs'
import { useUserStore } from '@/stores/modules/user'
import { getTimeState } from '@/utils'
import { CircleClose, UserFilled } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const tabsStore = useTabsStore()
const keepAliveStore = useKeepAliveStore()

const loginFormRef = ref(null)
const loginRules = reactive({
	username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const loading = ref(false)
const loginForm = reactive({
	username: 'admin',
	password: '123456'
})

// 登录
const login = (formEl) => {
	if (!formEl) return
	formEl.validate(async (valid) => {
		if (!valid) return
		loading.value = true
		try {
			// 1.执行登录接口
			// const { data } = await loginApi({ ...loginForm, password: md5(loginForm.password) });
			userStore.setToken('22222')

			// 2.添加动态路由
			await initDynamicRouter()

			// 3.清空 useTabs、keepAlive 数据
			await tabsStore.closeMultipleTab()
			await keepAliveStore.setKeepAliveName()

			// 4.跳转到首页
			await router.push(HOME_URL)
			ElNotification({
				title: getTimeState(),
				message: '欢迎登录',
				type: 'success',
				duration: 3000
			})
		} finally {
			loading.value = false
		}
	})
}

// 重置表单
const resetForm = (formEl) => {
	if (!formEl) return
	formEl.resetFields()
}

onMounted(() => {
	// 监听 Enter 事件（调用登录）
	document.onkeydown = (e) => {
		e = window.event || e
		if (e.code === 'Enter' || e.code === 'enter' || e.code === 'NumpadEnter') {
			if (loading.value) return
			login(loginFormRef.value)
		}
	}
	login(loginFormRef)
})
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
