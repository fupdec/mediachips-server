import Vue from 'vue'
import Vuex from 'vuex'
import Dialogs from './modules/dialogs.js'
import Page from './modules/page.js'
import Player from './modules/player.js'
import Reg from './modules/reg.js'
import Tasks from './modules/tasks.js'
const Settings = require('./../../default-settings.js')

Vue.use(Vuex)

export default new Vuex.Store({
  state: () => ({
    localhost: 'http://localhost:5555',
    pathToUserData: '',
    isElectron: null,
    hover: {
      show: false,
      itemId: null,
      metaId: null,
      timeout: 0,
      delay: 0,
      x: 0,
      y: 0,
    },
    contextMenu: {
      show: false,
      content: null,
      x: 0,
      y: 0,
    },
    mediaTypes: [],
    items: [],
    meta: [],
    notifications: [],
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
  actions: {
    showContextMenu({
      state
    }, {
      x,
      y,
      content,
    }) {
      const parseMenu = (entry) => {
        for (let i of entry) {
          i.id = Vue.prototype.$getRandomId()
          i.show = false
          if (i.type == "menu") parseMenu(i.menu);
        }
      };
      parseMenu(content)
      state.contextMenu.x = x
      state.contextMenu.y = y
      state.contextMenu.content = content
      state.contextMenu.show = true
    },
  },
  getters: {},
  modules: {
    Dialogs,
    Page,
    Player,
    Reg,
    Tasks,
  }
})