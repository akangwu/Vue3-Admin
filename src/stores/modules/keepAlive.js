import { defineStore } from 'pinia'

export const useKeepAliveStore = defineStore({
	id: 'geeker-keepAlive',
	state: () => ({
		keepAliveName: []
	}),
	actions: {
		// Add KeepAliveName
		addKeepAliveName(name) {
			!this.keepAliveName.includes(name) && this.keepAliveName.push(name)
		},
		// Remove KeepAliveName
		removeKeepAliveName(name) {
			this.keepAliveName = this.keepAliveName.filter(item => item !== name)
		},
		// Set KeepAliveName
		setKeepAliveName(keepAliveName = []) {
			this.keepAliveName = keepAliveName
		}
	}
})
