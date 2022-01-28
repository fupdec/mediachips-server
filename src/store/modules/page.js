import _ from "lodash";

const Page = {
  state: () => ({
    page: 1,
    limit: 20,
    filterId: null,
    size: 3,
    view: 1,
    sortBy: "name",
    sortDir: "asc",
    items: [],
    name: "Items",
    nameSingular: "Item",
    icon: "shape",
    isSelect: false,
    selection: [],
    isScrolled: false,
    savedFilter: {},
    filters: [],
    assigned: [], // assigned meta
  }),
  mutations: {
    updateStatePage(state, {
      key,
      value
    }) {
      state[key] = _.cloneDeep(value)
    },
  },
  actions: {},
  getters: {}
}

export default Page