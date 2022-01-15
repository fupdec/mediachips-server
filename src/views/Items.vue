<template>
  <vuescroll>
    <div class="headline text-h4 d-flex align-center justify-center pt-4">
      <v-icon left>mdi-{{ page.icon }}</v-icon> {{ page.name }}
      <span v-if="total != totalInDb" class="body-1 text--secondary ml-2">
        ({{ total }} of {{ totalInDb }})
      </span>
      <span v-else class="body-1 text--secondary ml-2">({{ total }})</span>
    </div>

    <v-pagination
      v-show="items.length && !isInfiniteScroll"
      :value="sets.page"
      @input="changePage($event)"
      :length="pages"
      total-visible="5"
      class="pt-4"
    />

    <Loading v-show="isQueryRun" />

    <v-container
      v-if="isMediaPage"
      fluid
      class="card-grid wide-image videos-selection"
      :class="[`card-size-${sets.size}`]"
    >
      <ItemVideo v-for="i in items" :key="i.id" :video="i" :items="items" />
    </v-container>
    <v-container
      v-else-if="isMetaPage"
      fluid
      class="card-grid"
      :class="[`card-size-${sets.size}`]"
    >
      <ItemMeta v-for="i in items" :key="i.id" :item="i" :meta="meta" />
    </v-container>

    <v-pagination
      v-show="items.length && !isInfiniteScroll"
      :value="sets.page"
      @input="changePage($event)"
      :length="pages"
      total-visible="5"
      class="pb-10"
    />

    <div v-if="0 == total && total == totalInDb" class="text-center">
      <v-icon x-large class="my-4">mdi-ghost-outline</v-icon>
      <div>There are no items</div>
    </div>

    <div v-if="0 == total && total !== totalInDb" class="text-center">
      <v-icon x-large class="my-4">mdi-filter-outline</v-icon>
      <div>There is no items matching the filters</div>
    </div>

    <div v-if="items.length && isInfiniteScroll" class="text-center">
      <Loading
        v-if="loader.show && sets.page != pages"
        v-intersect="infiniteScrolling"
      />
      <v-btn
        v-if="sets.page == pages"
        class="mb-4"
        color="primary"
        rounded
        plain
      >
        <v-icon left>mdi-format-vertical-align-top</v-icon>
        Scroll to top
      </v-btn>
    </div>

    <div v-show="appSets.navigationSide == '2'" class="py-6"></div>
  </vuescroll>
</template>


<script>
import _ from "lodash";
import Vue from "vue";
import axios from "axios";
import vuescroll from "vuescroll";

export default {
  name: "Items",
  components: {
    vuescroll,
    ItemVideo: () => import("@/components/items/ItemVideo.vue"),
    ItemMeta: () => import("@/components/items/ItemMeta.vue"),
    Loading: () => import("@/components/elements/Loading.vue"),
  },
  async beforeMount() {
    this.$store.state.items = [];
    await this.init();
  },
  mounted() {
    this.$root.$on("setItemsFilters", (val) => {
      this.updatePageSetting({
        page: 1,
        query: val,
      });
      this.getItemsFromDb();
    });
    this.$root.$on("setItemsLimit", (val) => {
      this.sets.page = 1;
      this.updatePageSetting({
        page: 1,
        limit: val,
      });
      this.getItems();
    });
    this.$root.$on("setItemsSortDir", (val) => {
      this.updatePageSetting({
        page: 1,
        sortDir: val,
      });
      this.getItemsFromDb();
    });
    this.$root.$on("setItemsSortBy", (val) => {
      this.updatePageSetting({
        page: 1,
        sortBy: val,
      });
      this.getItemsFromDb();
    });
    this.$nextTick(async () => {});
  },
  beforeDestroy() {
    if (this.isInfiniteScroll) this.updatePageSetting({ page: 1 });
  },
  data: () => ({
    meta: null,
    items: [],
    total: 1,
    totalInDb: 0,
    pages: 0,
    isQueryRun: false,
    loader: {
      show: false,
      timeout: false,
    },
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    page: {
      get() {
        return this.$store.state.page;
      },
      set(value) {
        return (this.$store.state.page = value);
      },
    },
    sets: {
      get() {
        return this.$store.state.pageSettings;
      },
      set(value) {
        return (this.$store.state.pageSettings = value);
      },
    },
    appSets: {
      get() {
        return this.$store.state.settings;
      },
      set(value) {
        return (this.$store.state.settings = value);
      },
    },
    filters: {
      get() {
        return this.$store.state.filters;
      },
      set(value) {
        return (this.$store.state.filters = value);
      },
    },
    route() {
      return this.$route.path;
    },
    isMetaPage() {
      return Vue.prototype.$checkCurrentPage("meta");
    },
    isMediaPage() {
      return Vue.prototype.$checkCurrentPage("media");
    },
    typeId() {
      return +this.$router.history.current.query.typeId;
    },
    metaId() {
      return +this.$router.history.current.query.metaId;
    },
    isInfiniteScroll() {
      return this.sets.limit === 101;
    },
  },
  methods: {
    async init() {
      if (this.isMetaPage) await this.getMeta();
      else if (this.isMediaPage) await this.getMedia();
      await this.getPageSettings();
      await this.getFilters();
      await this.getItemsFromDb();
    },
    async getFilters() {
      let query = "?";
      if (this.metaId) query += `metaId=${this.metaId}`;
      if (this.typeId) query += `&typeId=${this.typeId}`;
      await axios
        .get(this.apiUrl + "/api/SavedFilter/page" + query)
        .then((res) => {
          this.$store.state.filters = res.data || [];
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getPageSettings() {
      let query = "";
      if (this.isMetaPage) {
        query = `?metaId=${this.meta.id}`;
      } else if (this.isMediaPage) {
        query = `?typeId=${1}`;
      }
      let url = "/api/PageSetting";
      await axios
        .get(this.apiUrl + url + query)
        .then((res) => {
          this.sets = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /**
     * Updating settings for page.
     * @param {string} option - name of a column in table pageSettings.
     * @param {any} value - value in the column.
     */
    updatePageSetting(data) {
      let query = "";
      if (this.isMetaPage) {
        query = `?metaId=${this.$route.query.metaId}`;
      } else if (this.isMediaPage) {
        query = `?typeId=${this.$route.query.typeId}`;
      }
      axios({
        method: "put",
        url: this.apiUrl + "/api/PageSetting" + query,
        data: data,
      });
    },
    async getMeta() {
      await axios
        .get(this.apiUrl + "/api/meta/" + this.$route.query.metaId)
        .then((res) => {
          this.meta = res.data;
          this.page.name = this.meta.name;
          this.page.nameSingular = this.meta.nameSingular;
          this.page.icon = this.meta.icon;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getMedia() {
      await axios
        .get(this.apiUrl + "/api/MediaType/" + this.$route.query.typeId)
        .then((res) => {
          const mediaType = res.data;
          this.page.name = mediaType.name;
          this.page.nameSingular = mediaType.nameSingular;
          this.page.icon = mediaType.icon;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getItemsFromDb() {
      let url = "/api/";
      let sets = {};
      sets.sortBy = this.sets.sortBy;
      sets.sortDir = this.sets.sortDir;
      sets.filters = this.filters;
      if (this.isMetaPage) {
        url += "item/filter";
        sets.metaId = this.$route.query.metaId;
        sets.query = Vue.prototype.$filterItems(sets, "items");
      } else if (this.isMediaPage) {
        url += "media/filter";
        sets.typeId = this.$route.query.typeId;
        sets.query = Vue.prototype.$filterItems(sets, "media");
      }

      this.isQueryRun = true;
      this.loader.show = false;
      await axios({
        method: "post",
        url: this.apiUrl + url,
        data: sets,
      })
        .then((res) => {
          this.isQueryRun = false;
          clearTimeout(this.loader.timeout);
          this.loader.timeout = setTimeout(() => {
            this.loader.show = true;
          }, 500);
          const items = res.data.items;
          this.$store.state.items = _.cloneDeep(items);
          this.total = items.length;
          this.totalInDb = res.data.total;
          this.items = [];
          this.sets.page = 1;
          this.getItems();
        })
        .catch((e) => {
          this.isQueryRun = false;
          console.log(e);
        });
    },
    getItems() {
      const countPages = () => {
        const limit = this.isInfiniteScroll ? 25 : this.sets.limit;
        const start = (this.sets.page - 1) * limit;
        const end = start + limit;
        const pages = Math.ceil(this.total / limit);
        return {
          start,
          end,
          pages,
        };
      };

      console.log("get items");
      const items = _.cloneDeep(this.$store.state.items);
      const { start, end, pages } = countPages();
      this.pages = pages;
      if (this.isInfiniteScroll) {
        this.items = [...this.items, ...items.slice(start, end)];
      } else {
        this.items = items.slice(start, end);
      }
      // TODO jump to the fisrt page if current page greater than total pages
    },
    changePage(e) {
      this.sets.page = e;
      this.getItems();
      this.updatePageSetting({ page: e });
    },
    infiniteScrolling() {
      if (this.sets.page >= this.pages) return;
      this.sets.page++;
      this.getItems();
    },
  },
  watch: {
    "sets.size"(val, old) {
      if (val === old) return;
      this.updatePageSetting({ size: val });
    },
  },
};
</script>