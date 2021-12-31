<template>
  <vuescroll>
    <v-pagination
      :value="sets.page"
      @input="changePage($event)"
      :length="totalPages"
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
      <ItemVideo v-for="i in items" :key="i.id" :video="i" :media="items" />
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
      :value="sets.page"
      @input="changePage($event)"
      :length="totalPages"
      total-visible="5"
      class="pb-10"
    />
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
      this.updatePageSetting("query", val);
      this.sets.query = val;
      await this.getItems();
    });
    this.$root.$on("updatePerPage", async (val) => {
      this.updatePageSetting("perPage", val);
      this.sets.perPage = val;
      await this.getItems();
    });
    this.$root.$on("updateItemSize", async (val) => {
      this.updatePageSetting("size", val);
      this.sets.size = val;
    });
  },
  beforeDestroy() {
    this.$root.$off("searchItems");
    this.$root.$off("updatePerPage");
    this.$root.$off("updateItemSize");
  },
  data: () => ({
    meta: null,
    items: [],
    sets: {
      page: 1,
      perPage: 20,
      query: "",
      size: 3,
    },
    totalItems: 0,
    totalPages: 0,
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
    updatePageSetting(option, value) {
      let query = "";
      if (this.isMetaPage) {
        query = `?metaId=${this.meta.id}`;
      } else if (this.isMediaPage) {
        query = `?typeId=${1}`;
      }
      axios({
        method: "put",
        url: this.apiUrl + "/api/PageSetting" + query,
        data: {
          option,
          value,
        },
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
      url += `&page=${this.sets.page - 1}`;
      url += `&size=${this.sets.perPage}`;
      url += `&query=${this.sets.query || ""}`;

      this.isQueryRun = true;
      await axios
        .get(this.apiUrl + url)
        .then((response) => {
          this.isQueryRun = false;
          this.items = response.data.items;
          this.totalItems = response.data.totalItems;
          this.totalPages = response.data.totalPages;
        })
        .catch((e) => {
          this.isQueryRun = false;
          console.log(e);
        });
    },
    async changePage(e) {
      this.sets.page = e;
      await this.updatePageSetting("page", e);
      await this.getItems();
    },
  },
  watch: {},
};
</script>