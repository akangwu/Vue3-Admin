import router from '@/routers'
import { defineStore } from 'pinia'
import { TabsState, TabsMenuProps } from '@/stores/interface'
import { useKeepAliveStore } from './keepAlive'
import piniaPersistConfig from '@/config/piniaPersist'
const keepAliveStore = useKeepAliveStore()

export const useTabsStore = defineStore({
	id: 'geeker-useTabs',
	state: (): TabsState => ({
		tabsMenuList: []
	}),
	actions: {
		// Add Tabs
		async addTabs(tabItem: TabsMenuProps) {
			if (this.tabsMenuList.every(item => item.path !== tabItem.path)) {
				this.tabsMenuList.push(tabItem)
			}
		},
		// Remove Tabs
		async removeTabs(tabPath: string, isCurrent: boolean = true) {
			const tabsMenuList = this.tabsMenuList
			if (isCurrent) {
				tabsMenuList.forEach((item, index) => {
					if (item.path !== tabPath) return
					const nextTab = tabsMenuList[index + 1] || tabsMenuList[index - 1]
					if (!nextTab) return
					router.push(nextTab.path)
				})
			}
			this.tabsMenuList = tabsMenuList.filter(item => item.path !== tabPath)
		},
		// Close MultipleTab
		async closeMultipleTab(tabsPath?: string) {
			this.tabsMenuList = this.tabsMenuList.filter(item => {
				return item.path === tabsPath || !item.close
			})
		},
		//关闭左侧/右侧
		async closeTabsOnSide(tabPath: string, type: 'left' | 'right') {
			const currentIndex = this.tabsMenuList.findIndex(item => item.path === tabPath)
			if (currentIndex !== -1) {
				const range = type === 'left' ? [0, currentIndex] : [currentIndex + 1, this.tabsMenuList.length]
				this.tabsMenuList = this.tabsMenuList.filter((item, index) => {
					return index < range[0] || index >= range[1] || !item.close
				})
			}
			if (type === 'right') {
				router.push(tabPath)
			}

			/*this.tabsMenuList.forEach((item, index) => {
        if (item.path !== tabPath) return;
        const nextTab = this.tabsMenuList[index + 1] || this.tabsMenuList[index - 1];
        if (!nextTab) return;
        router.push(nextTab.path);
      });*/

			// set keepalive
			const KeepAliveList = this.tabsMenuList.filter(item => item.isKeepAlive)
			await keepAliveStore.setKeepAliveName(KeepAliveList.map(item => item.name))
		},
		// Set Tabs
		async setTabs(tabsMenuList: TabsMenuProps[]) {
			this.tabsMenuList = tabsMenuList
		},
		// Set Tabs Title
		async setTabsTitle(title: string) {
			const nowFullPath = location.hash.substring(1)
			this.tabsMenuList.forEach(item => {
				if (item.path == nowFullPath) item.title = title
			})
		}
	},
	persist: piniaPersistConfig('geeker-useTabs')
})
