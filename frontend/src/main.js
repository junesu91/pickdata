// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import App from './App'
import router from './router'
import axios from 'axios'
import VueCharts from 'vue-charts'

Vue.prototype.$http = axios
Vue.prototype.$eventBus = new Vue()

Vue.config.productionTip = false
Vue.use(VueCharts)
/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
