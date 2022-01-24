import Vue from 'vue'
import Vuex from 'vuex'
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
    page: {
      name: "Items",
      nameSingular: "Item",
      icon: "shape",
      items: [],
    },
    items: [],
    savedFilter: {},
    filters: [],
    pageSettings: {
      page: 1,
      limit: 20,
      filterId: null,
      size: 3,
      sortBy: "name",
      sortDir: "asc",
    },
    itemsLoading: true,
    log: [],
    isLogVisible: false,
    notifications: [],
    hover: {
      show: false,
      itemId: null,
      metaId: null,
      time: 0,
      x: 0,
      y: 0,
    },
    isSelect: false,
    selected: [],
    isScrolled: false,
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
  getters: {
    getPathToUserData(state) {
      return path.join(state.pathToUserData, 'userfiles')
    },
  },
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
  modules: {
    Player,
  }
})