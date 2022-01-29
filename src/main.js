import { createApp } from 'vue'
import App from './App.vue'
// 导入路由模块
import router from './router/index.js'
// 导入全局样式表
import './assets/css/global.css'
// 全局配置element-ui 组件
import ElementPlus from 'element-plus'
// 引入组件样式
import '../node_modules/element-plus/dist/index.css'
// 统一导入 el-icon 图标
import * as ElIconModules from '@element-plus/icons-vue'
// 导入 axios
import axios from 'axios'
// 导入字体图标
import './assets/fonts/iconfont.css'
const app = createApp(App)
// 为 axios 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//
axios.interceptors.request.use((config) => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 将 axios 挂载为 app 的全局自定义属性
app.config.globalProperties.$http = axios

// 挂载 element-ui 模块
app.use(ElementPlus)
// 统一注册 el-icon 图标
for (let iconName in ElIconModules) {
  app.component(iconName, ElIconModules[iconName])
}
// 挂载路由模块
app.use(router)
app.mount('#app')
