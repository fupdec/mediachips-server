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
    backgroundProcesses: [],
    settings: Settings,
  }),
  getters: {
    getNotifications(state) {
      return state.notifications
    },
    getPathToUserData(state) {
      return path.join(state.pathToUserData, 'userfiles')
    },
  },
  mutations: {
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
    addBackgroundProcess(state, backgroundProcess) {
      state.backgroundProcesses.push(backgroundProcess)
    },
    updateTextBackgroundProcess(state, {
      id,
      text
    }) {
      const index = state.backgroundProcesses.findIndex(x => x.id === id)
      if (index > -1) state.backgroundProcesses[index].text = text
    },
    removeBackgroundProcess(state, id) {
      state.backgroundProcesses = state.backgroundProcesses.filter(i => i.id !== id)
    },
    setNotification(state, notification) {
      state.notifications.push({
        id: Math.ceil(Math.random() * new Date().getTime()),
        showing: true,
        type: notification.type,
        text: notification.text,
      })
    },
    removeNotification(state, id) {
      state.notifications = state.notifications.filter(n => n.id !== id)
    },
    clearAllNotifications(state) {
      state.notifications = []
    },
    stopLoading(state) {
      state.itemsLoading = false
    },
    resetLoading(state) {
      state.itemsLoading = true
    },
  },
  actions: {
    setNotification({
      state,
      commit
    }, notification) {
      commit('setNotification', notification)
    },
    removeNotification({
      state,
      commit
    }, id) {
      commit('removeNotification', id)
    },
    clearAllNotifications({
      state,
      commit
    }) {
      commit('clearAllNotifications')
    },
  },
  modules: {
    Player,
  }
})