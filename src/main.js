import Vue from 'vue'
import router from './router'
import vuetify from './plugins/vuetify.js'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app')
