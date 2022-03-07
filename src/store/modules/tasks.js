import Vue from "vue";

const Tasks = {
  state: () => ({
    list: [],
    mediaAdding: {
      paths: "",
      dialogProcess: false,
      active: false,
      stopped: false,
      finished: false,
      status: "",
      processed: "",
      progress: 0,
      current: 0,
      total: 0,
      errors: [],
      duplicates: [],
      added: [],
    },
  }),
  mutations: {},
  actions: {
    setTask({
      state
    }, {
      text,
      subtitle,
      icon,
      click,
      action,
      progress
    }) {
      const id = Vue.prototype.$getRandomId()

      state.list.push({
        id,
        text,
        subtitle,
        icon,
        click,
        action,
        progress,
      })

      return id
    },
    updateTask({
      state
    }, {
      id,
      data
    }) {
      const x = state.list.findIndex((i) => i.id === id);
      if (x > -1)
        for (let i in data)
          Vue.set(state.list[x], i, data[i])
    },
    removeTask({
      state
    }, id) {
      const x = state.list.findIndex((i) => i.id === id);
      if (x > -1) state.list.splice(x, 1);
    },
  },
  getters: {}
}

export default Tasks