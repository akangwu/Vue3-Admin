// font css
import '@/assets/fonts/font.scss'
// iconfont css
import '@/assets/iconfont/iconfont.scss'

// custom directives
import directives from '@/directives/index'
// vue i18n
import I18n from '@/languages/index'
// vue Router
import router from '@/routers'
// pinia store
import pinia from '@/stores'
// CSS common style sheet
import '@/styles/common.scss'
// custom element css
import '@/styles/element.scss'
// reset style sheet
import '@/styles/reset.scss'
// element icons
import * as Icons from '@element-plus/icons-vue'
// element plus
import ElementPlus from 'element-plus'
// element css
import 'element-plus/dist/index.css'
// element dark css
import 'element-plus/theme-chalk/dark/css-vars.css'
// svg icons
import 'virtual:svg-icons-register'

import VxeUIAll from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'

import funcs from '@/utils/funcs'
import http from '@/axios'
import { msg } from '@/utils/resetMessage'
import { ElMessageBox } from 'element-plus'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.funcs = funcs
app.config.globalProperties.axios = http
app.config.globalProperties.msg = msg
app.config.globalProperties.msgConfirm = ElMessageBox

// register the element Icons component
Object.keys(Icons).forEach(key => {
	app.component(key, Icons[key])
})

app.use(ElementPlus)
app.use(VxeUIAll)
app.use(VxeUITable)
app.use(directives)
app.use(router)
app.use(I18n)
app.use(pinia).mount('#app')
