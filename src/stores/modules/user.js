import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'

export const useUserStore = defineStore({
	id: 'geeker-user',
	state: () => ({
		token: '',
		userInfo: { name: 'Geeker' }
	}),
	getters: {},
	actions: {
		// Set Token
		setToken(token) {
			this.token = token
		},
		// Set setUserInfo
		setUserInfo(userInfo) {
			this.userInfo = userInfo
		}
	},
	persist: piniaPersistConfig('geeker-user')
})
