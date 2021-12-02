import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/font/iconfont.css'

// 引入全局的样式文件
import './assets/css/global.less'
import axios from 'axios'

// 请求基准路径配置
axios.defaults.baseURL= 'http://127.0.0.1:8888/api/'
// 在别的组件中 this.$http
Vue.prototype.$http = axios

// 将全局的echarts对象挂载在Vue的原型对象上
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
