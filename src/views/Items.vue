<template>
  <vuescroll>
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
    sets: {
      get() {
        return this.$store.state.pageSettings;
      },
      set(value) {
        return (this.$store.state.pageSettings = value);
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
  },
  methods: {
    async init() {
      if (this.isMetaPage) {
        await this.getMeta();
      }
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
        .get(this.apiUrl + "/api/meta")
        .then((res) => {
          this.meta = res.data.find((i) => i.id == this.$route.query.metaId);
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
  },
};
</script>