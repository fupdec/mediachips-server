const Tasks = {
  state: () => ({
    list: [],
    mediaAdding: {
      paths: "",
      dialogProcess: false,
      active: false,
      stopped: false,
      finished: false,
      progress: 0,
      current: 0,
      total: 0,
      errors: [],
      duplicates: [],
      added: [],
    },
  }),
  mutations: {
  },
  actions: {
  },
  getters: {}
}

export default Tasks