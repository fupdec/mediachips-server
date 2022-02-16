import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import('../views/Home.vue')
const ItemsAppbar = () => import('@/components/app/appbar/ItemsAppbar.vue')
const Items = () => import('../views/Items.vue')
const Settings = () => import('../views/Settings.vue')
const ItemAppbar = () => import('@/components/app/appbar/ItemAppbar.vue')
const Item = () => import('../views/Item.vue')

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
    alias: '/meta',
    name: 'Items',
    components: {
      default: Items,
      appbar: ItemsAppbar,
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    components: {
      default: Settings,
    }
  },
  {
    path: '/item',
    name: 'Item',
    components: {
      default: Item,
      appbar: ItemAppbar,
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  routes: routes,
})

export default router
