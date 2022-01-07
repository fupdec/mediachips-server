import Vue from 'vue'
import Vuex from 'vuex'
import Player from './modules/player.js'
const defaultSettings = require('./../../default-settings.json')

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
    pageSettings: {
      page: 1,
      limit: 20,
      query: "",
      size: 3,
      sortBy: "name",
      sortDir: "asc",
    },
    itemsLoading: true,
    log: [],
    isLogVisible: false,
    notifications: [],
    hoveredImage: false,
    hoveredImageId: '',
    hoveredImageMetaId: '',
    hoveredImageType: '',
    hoveredImageTime: 0,
    hoveredImageX: 0,
    hoveredImageY: 0, // TODO create object for hovered values
    x: 0,
    y: 0,
    contextMenu: false,
    contextMenuContent: [],
    pathToUserData: '',
    videoPlayerVideoId: null,
    videoPlayerPlaylist: null,
    foldersData: [],
    dialogFolder: false,
    navDrawer: false,
    clipboardMeta: {},
    updateFoldersData: 0,
    backgroundProcesses: [],
    settings: defaultSettings,
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