import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import('../views/Home.vue')
const Media = () => import('../views/Media.vue')
const Meta = () => import('../views/Meta.vue')
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
    path: '/media',
    name: 'Media',
    components: {
      default: Media,
    }
  },
  {
    path: '/meta',
    name: 'Meta',
    components: {
      default: Meta,
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
