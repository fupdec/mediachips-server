import Vue from 'vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify.js'
import Readable from './plugins/readable.js'
import ApiCalls from './plugins/api-calls.js'
import App from './App.vue'
import vuescroll from 'vuescroll'

Vue.use(vuescroll, {
  ops: {
    rail: {
      size: '15px',
      specifyBorderRadius: '15px',
      gutterOfEnds: '0',
      gutterOfSide: '0',
    },
    bar: {
      background: '#555',
      opacity: 0.7,
      minSize: 0.2,
      size: '15px',
    }
  }
})
Vue.config.productionTip = false

Vue.use(Readable, { store, router })
Vue.use(ApiCalls, { store, router })

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
