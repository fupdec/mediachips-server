<template>
  <vuescroll>
    <div class="headline text-h4 d-flex align-center justify-center pt-4">
      <v-icon left>mdi-{{ page.icon }}</v-icon> {{ page.name }}
      <span v-if="total != totalInDb" class="text-h6 ml-2">
        ({{ total }} of {{ totalInDb }})
      </span>
      <span v-else class="text-h6 ml-2">({{ total }})</span>
    </div>

    <v-pagination
      v-show="items.length"
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
      v-show="items.length"
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

    <div v-show="appSets.navigationSide == '2'" class="py-6"></div>
  </vuescroll>
</template>


<script>
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
    await this.init();
  },
  mounted() {
    this.$nextTick(async () => {});
  },
  data: () => ({
    meta: null,
    items: [],
    total: 1,
    totalInDb: 0,
    pages: 0,
    isQueryRun: false,
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
    route() {
      return this.$route.path;
    },
    isMetaPage() {
      return Vue.prototype.$checkCurrentPage("meta");
    },
    isMediaPage() {
      return Vue.prototype.$checkCurrentPage("media");
    },
    filters: {
      get() {
        return this.$store.state.filters;
      },
      set(value) {
        return (this.$store.state.filters = value);
      },
    },
  },
  methods: {
    async init() {
      if (this.isMetaPage) await this.getMeta();
      else if (this.isMediaPage) await this.getMedia();
      await this.getPageSettings();
      await this.getItems();
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
    async getItems() {
      let url = "/api/";
      let sets = {};
      if (this.isMetaPage) {
        url += "item/filter";
        sets.metaId = this.$route.query.metaId;
      } else if (this.isMediaPage) {
        url += "media/filter";
        sets.typeId = this.$route.query.typeId;
      }
      sets.page = this.sets.page - 1;
      sets.limit = this.sets.limit;
      sets.sortBy = this.sets.sortBy;
      sets.sortDir = this.sets.sortDir;
      sets.query = this.sets.query || "";
      sets.filters = this.filters;

      this.isQueryRun = true;
      await axios({
        method: "post",
        url: this.apiUrl + url,
        data: sets,
      })
        .then((res) => {
          this.isQueryRun = false;
          this.items = res.data.items;
          this.total = res.data.total;
          this.pages = res.data.pages;
          this.totalInDb = res.data.totalRows;
          // TODO jump to the fisrt page if current page greater than total pages
        })
        .catch((e) => {
          this.isQueryRun = false;
          console.log(e);
        });
    },
    async changePage(e) {
      this.sets.page = e;
      await this.updatePageSetting({ page: e });
      await this.getItems();
    },
  },
  watch: {
    "sets.query"(val, old) {
      if (val === old) return;
      this.updatePageSetting({
        page: 1,
        query: val,
      });
      this.sets.page = 1;
      this.getItems();
    },
    "sets.limit"(val, old) {
      if (val === old) return;
      this.updatePageSetting({
        page: 1,
        limit: val,
      });
      this.sets.page = 1;
      this.getItems();
    },
    "sets.size"(val, old) {
      if (val === old) return;
      this.updatePageSetting({ size: val });
    },
    "sets.sortBy"(val, old) {
      if (val === old) return;
      this.updatePageSetting({ sortBy: val });
      this.getItems();
    },
    "sets.sortDir"(val, old) {
      if (val === old) return;
      this.updatePageSetting({ sortDir: val });
      this.getItems();
    },
    filters() {
      this.getItems();
    },
  },
};
</script>