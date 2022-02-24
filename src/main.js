import Vue from 'vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify.js'
import Readable from './plugins/readable.js'
import ApiCalls from './plugins/api-calls.js'
import App from './App.vue'
import _ from 'lodash'

Vue.set(Vue.prototype, '$_', _)
Vue.config.productionTip = false

Vue.use(Readable, {
  store,
  router
})
Vue.use(ApiCalls, {
  store,
  router
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')