import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import('../views/Home.vue')
const Settings = () => import('../views/Settings.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      default: Home,
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    components: {
      default: Settings,
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  routes: routes,
})

export default router
