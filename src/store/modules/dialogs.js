const Dialogs = {
  state: () => ({
    mediaEditing: {
      show: false,
      media: null,
      mediaType: {
        type: null
      },
    },
    itemEditing: {
      show: false,
      item: null,
      meta: null,
    },
    markAdding: {
      show: false,
      type: null,
      meta: null,
      time: null,
      end: null,
    },
    error: {
      show: false,
      text: null,
    },
  }),
  mutations: {},
  actions: {},
  getters: {}
}

export default Dialogs