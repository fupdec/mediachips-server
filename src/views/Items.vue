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

    <div
      v-if="0 == total && total == totalInDb"
      class="text-center"
    >
      <v-icon x-large class="my-4">mdi-ghost-outline</v-icon>
      <div>There are no items</div>
    </div>

    <div
      v-if="0 == total && total !== totalInDb"
      class="text-center"
    >
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
    this.$root.$on("searchItems", async (val) => {
      this.updatePageSetting({
        page: 1,
        query: val,
      });
      this.sets.page = 1;
      this.sets.search = val;
      await this.getItems();
    });
    this.$root.$on("updateLimit", async (val) => {
      this.updatePageSetting({
        page: 1,
        limit: val,
      });
      this.sets.page = 1;
      this.sets.limit = val;
      await this.getItems();
    });
    this.$root.$on("updateItemSize", async (val) => {
      this.updatePageSetting({ size: val });
      this.sets.size = val;
    });
  },
  beforeDestroy() {
    this.$root.$off("searchItems");
    this.$root.$off("updateLimit");
    this.$root.$off("updateItemSize");
  },
  data: () => ({
    meta: null,
    items: [],
    sets: {
      page: 1,
      limit: 20,
      search: "",
      size: 3,
    },
    total: 1,
    totalInDb: 0,
    pages: 0,
    isQueryRun: false,
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
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
        query = `?metaId=${this.meta.id}`;
      } else if (this.isMediaPage) {
        query = `?typeId=${1}`;
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
      if (this.isMetaPage) {
        url += `item?metaId=${this.$route.query.metaId}`;
      } else if (this.isMediaPage) {
        url += `media?typeId=1`;
      }
      url += `&page=${this.sets.page-1}`;
      url += `&limit=${this.sets.limit}`;
      url += `&search=${this.sets.search || ""}`;

      this.isQueryRun = true;
      await axios
        .get(this.apiUrl + url)
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
  watch: {},
};
</script>