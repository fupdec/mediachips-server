<template>
  <vuescroll>
    <v-pagination
      v-model="page"
      @input="init"
      :length="totalPages"
      total-visible="5"
      class="pt-4"
    />

    <Loading v-show="isQueryRun" />

    <v-container
      v-if="route.includes('media')"
      fluid
      class="card-grid wide-image videos-selection"
      :class="[`card-size-${itemSize}`]"
    >
      <ItemVideo v-for="i in items" :key="i.id" :video="i" :media="items" />
    </v-container>
    <v-container
      v-else-if="route.includes('meta')"
      fluid
      class="card-grid"
      :class="[`card-size-${itemSize}`]"
    >
      <ItemMeta v-for="i in items" :key="i.id" :item="i" :meta="meta" />
    </v-container>

    <v-pagination
      v-model="page"
      @input="init"
      :length="totalPages"
      total-visible="5"
      class="pb-10"
    />
  </vuescroll>
</template>


<script>
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
  mounted() {
    this.$nextTick(async () => {
      await this.init();
      this.$root.$on("searchItems", async (searchString) => {
        this.searchString = searchString;
        await this.init();
      });
      this.$root.$on("updateItemSize", async (size) => {
        this.itemSize = size;
      });
      this.$root.$on("updatePerPage", async (size) => {
        this.perPage = size;
        await this.init();
      });
    });
  },
  data: () => ({
    meta: null,
    items: [],
    pageSettings: {},
    totalItems: 0,
    totalPages: 0,
    page: 1,
    itemSize: 3,
    perPage: 20,
    isQueryRun: false,
    searchString: "",
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    route() {
      return this.$route.path;
    },
  },
  methods: {
    async init() {
      let url = "/api/";
      if (this.route.includes("meta")) {
        await this.getMeta();
        url += `item?metaId=${this.$route.query.metaId}`;
      } else if (this.route.includes("media")) {
        url += `media?type=1`;
      }
      url += `&page=${this.page - 1}&size=${this.perPage}&query=${
        this.searchString
      }`;
      this.getPageSettings();
      this.getItems(url);
    },
    async getPageSettings() {
      let query = "";
      if (this.route.includes("meta")) {
        query = `?metaId=${this.meta.id}`;
      } else if (this.route.includes("media")) {
        query = `?typeId=${1}`;
      }
      let url = `/api/PageSetting`;
      await axios
        .get(this.apiUrl + url + query)
        .then((res) => {
          this.pageSettings = res.data;
        })
        .catch((e) => {
          console.log(e);
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
    getItems(url) {
      this.isQueryRun = true;
      axios
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
  },
  watch: {},
};
</script>