import Vue from 'vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify.js'
import Readable from './plugins/readable.js'
import ApiCalls from './plugins/api-calls.js'
import App from './App.vue'
import _ from 'lodash'

import VueI18n from 'vue-i18n'
import cn from './i18n/cn.js'
import en from './i18n/en.js'
import es from './i18n/es.js'
import ru from './i18n/ru.js'

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

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    cn,
    en,
    es,
    ru
  },
})

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')