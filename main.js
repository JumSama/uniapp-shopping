
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import requestModel from 'utils/request.js'
Vue.config.productionTip = false

// 配置全局变量
Vue.prototype.request = requestModel
App.mpType = 'app'

// 配置全局组件 (重复可优化)
import pageHeader from '@/components/pageHeader.vue'
import pageStatus from '@/components/status.vue'
Vue.component('page-status', pageStatus)
Vue.component('page-header', pageHeader)

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif