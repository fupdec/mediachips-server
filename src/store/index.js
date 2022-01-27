import Vue from 'vue'
import Vuex from 'vuex'
import Page from './modules/page.js'
import Player from './modules/player.js'
const Settings = require('./../../default-settings.js')

Vue.use(Vuex)

export default new Vuex.Store({
  state: () => ({
    localhost: 'http://localhost:5555',
    scan: {
      folders: [],
      files: [],
      stage: 0,
    },
    items: [],
    meta: [],
    notifications: [],
    hover: {
      show: false,
      itemId: null,
      metaId: null,
      time: 0,
      x: 0,
      y: 0,
    },
    contextMenu: false,
    contextMenuContent: [],
    pathToUserData: '',
    videoPlayerVideoId: null,
    videoPlayerPlaylist: null,
    foldersData: [],
    dialogFolder: false,
    navDrawer: true,
    clipboardMeta: {},
    updateFoldersData: 0,
    tasks: [],
    settings: Settings,
  }),
  mutations: {
    updateState(state, {
      key,
      value
    }) {
      state[key] = value
    },
    addLog(state, {
      text,
      type,
      color
    }) {
      state.log.push({
        type: type,
        text: text,
        color: color,
        time: Date.now(),
      })
    },
    setNotification(state, {
      text,
      type,
      icon
    }) {
      const id = Vue.prototype.$getRandomId()
      state.notifications.push({
        id,
        text,
        type,
        icon,
        show: true
      })
      setTimeout(() => {
        let x = state.notifications.findIndex(i => i.id == id)
        if (x > -1) state.notifications[x].show = false
        return false
      }, 5000);
    },
  },
  actions: {},
  getters: {},
  modules: {
    Page,
    Player,
  }
})