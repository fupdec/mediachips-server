<template>
  <div>
    <div class="headline text-h4 d-flex align-center justify-center pt-4 pb-2">
      <v-icon left>mdi-{{ Items.icon }}</v-icon> {{ Items.name }}
      <span v-if="total != totalInDb" class="body-1 text--secondary ml-2">
        ({{ total }} of {{ totalInDb }})
      </span>
      <span v-else class="body-1 text--secondary ml-2">({{ total }})</span>
    </div>

    <Filters :isReady="isFiltersReady" />

    <v-container
      v-if="Items.filters.length > 0"
      class="d-flex justify-center align-start"
      fluid
    >
      <FiltersChips :filters="Items.filters" />
    </v-container>

    <v-container
      v-if="Items.itemsOnPage.length && !isInfiniteScroll"
      class="d-flex justify-center align-center"
      fluid
    >
      <v-pagination
        :value="Items.page"
        @input="changePage($event)"
        :length="pages"
        :total-visible="$vuetify.breakpoint.xs ? 5 : sets.numberOfPagesLimit"
      />

      <v-menu v-if="pages > 4" :close-on-content-click="false" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon>
            <v-icon>mdi-redo</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-card-text>
            <div>Jump to page</div>
            <v-text-field
              v-model="Items.jumpPage"
              @keypress.enter="jumpToPage(Items.jumpPage)"
              type="number"
              autofocus
              dense
              outlined
              hide-details
              class="my-4"
            />
            <v-btn @click="jumpToPage($event)" color="success" block depressed>
              <v-icon left>mdi-check</v-icon> Apply
            </v-btn>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-container>

    <Loading v-show="isQueryRun" />

    <v-container
      v-if="mediaType.type == 'video' || isItemPage"
      :class="[
        `item-size-${Items.size}`,
        `gap-size-${sets.gapSize}`,
        { 'card-grid': Items.view == '1' },
        { 'line-grid': Items.view == '2' },
      ]"
      class="wide-image"
      fluid
    >
      <ItemVideo
        v-for="(i, x) in Items.itemsOnPage"
        :key="i.id"
        :media="i"
        :reg="reg"
        :upd="upd"
        :x="x"
      />
    </v-container>

    <v-container
      v-if="['image', 'audio', 'text'].includes(mediaType.type)"
      :class="[`item-size-${Items.size}`, `gap-size-${sets.gapSize}`]"
      class="card-grid"
      fluid
    >
      <ItemImage
        v-for="(i, x) in Items.itemsOnPage"
        :key="i.id"
        :media="i"
        :reg="reg"
        :upd="upd"
        :x="x"
      />
    </v-container>

    <v-container
      v-else-if="isMetaPage"
      fluid
      :class="[
        `item-size-${Items.size}`,
        `gap-size-${sets.gapSize}`,
        { 'card-grid': Items.view == '1' },
        { 'chips-grid': Items.view == '2' },
      ]"
    >
      <ItemMeta
        v-for="i in Items.itemsOnPage"
        :key="i.id"
        :item="i"
        :meta="meta"
        :upd="upd"
      />
    </v-container>

    <!-- TODO init saved page number -->
    <v-pagination
      v-show="Items.itemsOnPage.length && !isInfiniteScroll"
      :value="Items.page"
      @input="changePage($event)"
      :length="pages"
      :total-visible="$vuetify.breakpoint.xs ? 5 : sets.numberOfPagesLimit"
      class="pb-10 pt-2"
    />

    <div v-if="0 == total && total == totalInDb" class="text-center">
      <v-icon x-large class="my-4">mdi-ghost-outline</v-icon>
      <div>There are no items</div>
    </div>

    <div v-if="0 == total && total !== totalInDb" class="text-center">
      <v-icon x-large class="my-4">mdi-filter-outline</v-icon>
      <div>There is no items matching the filters</div>
    </div>

    <div
      v-if="Items.itemsOnPage.length && isInfiniteScroll"
      class="text-center py-6"
    >
      <Loading
        v-if="loader.show && Items.page != pages"
        v-intersect="infiniteScrolling"
      />
      <v-btn
        v-if="Items.page == pages"
        @click="scrollTop"
        class="mb-4"
        color="primary"
        rounded
        plain
      >
        <v-icon left>mdi-format-vertical-align-top</v-icon>
        Scroll to top
      </v-btn>
    </div>
  </div>
</template>


<script>
import Vue from "vue";
import axios from "axios";
import GeneratingThumbsForVideos from "@/mixins/GeneratingThumbsForVideos";
import ComputedForItemsPage from "@/mixins/ComputedForItemsPage";

export default {
  name: "Items",
  components: {
    ItemVideo: () => import("@/components/items/ItemVideo.vue"),
    ItemImage: () => import("@/components/items/ItemImage.vue"),
    ItemMeta: () => import("@/components/items/ItemMeta.vue"),
    Filters: () => import("@/components/app/Filters.vue"),
    FiltersChips: () => import("@/components/elements/FiltersChips.vue"),
    Loading: () => import("@/components/elements/Loading.vue"),
  },
  mixins: [GeneratingThumbsForVideos, ComputedForItemsPage],
  async beforeMount() {
    // clearing previous values
    this.Items.itemsOnPage = [];
    this.$store.commit("updateStateItems", {
      key: "isSelect",
      value: false,
    });
    this.$store.commit("updateStateItems", {
      key: "selection",
      value: [],
    });
    this.$store.commit("updateStateItems", {
      key: "filters",
      value: [],
    });
    // getting values
    this.typeId = Vue.prototype.$getUrlParam("typeId");
    this.itemId = Vue.prototype.$getUrlParam("itemId");
    this.metaId = Vue.prototype.$getUrlParam("metaId");
    this.tabId = Vue.prototype.$getUrlParam("tabId");
    await this.init();
  },
  mounted() {
    this.$root.$on("getItemsFromDb", (ids) => {
      this.upd = ids;
      this.getItemsFromDb();
    });
    this.$root.$on("setItemsFilters", async (val) => {
      this.updatePageSetting({
        page: 1,
        query: val,
      });
      await this.getFilters();
      this.getItemsFromDb();
    });
    this.$root.$on("setItemsLimit", (val) => {
      this.$store.commit("updateStateItems", {
        key: "page",
        value: 1,
      });
      if (val == 101) this.Items.itemsOnPage = [];
      this.updatePageSetting({
        page: 1,
        limit: val,
      });
      this.getItemsOnPage();
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
    this.$root.$on("setItemsView", (val) => {
      this.updatePageSetting({
        view: val,
      });
    });
    this.$root.$on("updateAssignedMeta", async () => {
      await this.getAssignedMeta();
    });
    this.$nextTick(async () => {});
  },
  beforeDestroy() {
    this.$root.$off("getItemsFromDb");
    this.$root.$off("setItemsFilters");
    this.$root.$off("setItemsLimit");
    this.$root.$off("setItemsSortDir");
    this.$root.$off("setItemsSortBy");
    this.$root.$off("updateAssignedMeta");
    if (this.isInfiniteScroll) this.updatePageSetting({ page: 1 });
  },
  data: () => ({
    itemId: null,
    typeId: null,
    metaId: null,
    tabId: null,
    meta: null,
    total: 1,
    totalInDb: 0,
    pages: 0,
    isQueryRun: false,
    isFiltersReady: false,
    loader: {
      show: false,
      timeout: false,
    },
    upd: [],
  }),
  computed: {
    isInfiniteScroll() {
      return this.Items.limit === 101;
    },
    reg() {
      return this.$store.getters.reg;
    },
  },
  methods: {
    async init() {
      if (this.isMetaPage) await this.getMeta();
      else if (this.isMediaPage || this.isItemPage) await this.getMedia();
      await this.getFilters();
      await this.getPageSettings();
      await this.getAssignedMeta();
      await this.getItemsFromDb();
    },
    async getFilters() {
      let savedFilter = {};
      await axios({
        method: "post",
        url: this.apiUrl + "/api/SavedFilter",
        data: {
          name: null,
          itemId: this.itemId,
          typeId: this.typeId,
          metaId: this.metaId,
          tabId: this.tabId,
        },
      })
        .then((res) => {
          savedFilter = res.data[0];
        })
        .catch((e) => {
          console.log(e);
        });

      if (_.isEmpty(savedFilter)) return;

      let filters = await Vue.prototype.$getFilters(savedFilter.id);

      this.$store.commit("updateStateItems", {
        key: "filters",
        value: filters,
      });

      this.$store.commit("updateStateItems", {
        key: "savedFilter",
        value: savedFilter,
      });

      if (this.isItemPage) this.initFilterForItemPage();
    },
    initFilterForItemPage() {
      const index = this.Items.filters.findIndex(
        (i) => i.metaId == this.metaId && i.lock == true
      );
      if (index < 0) {
        let fltr = Vue.prototype.$getFilterObject({
          param: this.metaId,
          type: "array",
          cond: "in",
          val: [this.itemId],
        });
        this.Items.filters.push(fltr);
      }
    },
    async getPageSettings() {
      let data = {};
      data.itemId = this.itemId;
      data.typeId = this.typeId;
      data.metaId = this.metaId;
      data.tabId = this.tabId;

      await axios({
        method: "post",
        url: this.apiUrl + "/api/PageSetting",
        data: data,
      })
        .then((res) => {
          let vals = ["page", "limit", "size", "view", "sortBy", "sortDir"];
          for (let i of vals)
            this.$store.commit("updateStateItems", {
              key: i,
              value: res.data[0][i],
            });

          // if page settings created then update filter id for it
          if (res.data[1])
            this.updatePageSetting({ filterId: this.Items.savedFilter.id });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    updatePageSetting(data) {
      let query = {};
      query.itemId = this.itemId;
      query.typeId = this.typeId;
      query.metaId = this.metaId;
      query.tabId = this.tabId;
      axios({
        method: "put",
        url: this.apiUrl + "/api/PageSetting",
        data: {
          data,
          query,
        },
      });
    },
    async getMeta() {
      await axios
        .get(this.apiUrl + "/api/meta/" + this.metaId)
        .then((res) => {
          const meta = _.cloneDeep(res.data);
          this.meta = meta;
          this.Items.name = meta.name;
          this.Items.nameSingular = meta.nameSingular;
          this.Items.icon = meta.icon;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getMedia() {
      await axios
        .get(this.apiUrl + "/api/MediaType/" + this.typeId)
        .then((res) => {
          const mediaType = _.cloneDeep(res.data);
          this.Items.name = mediaType.name;
          this.Items.nameSingular = mediaType.nameSingular;
          this.Items.icon = mediaType.icon;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getItemsFromDb() {
      let url = "/api/";
      let sets = {};
      sets.sortBy = this.Items.sortBy;
      sets.sortDir = this.Items.sortDir;
      sets.filters = _.cloneDeep(this.Items.filters);
      if (this.isMetaPage) {
        url += "item/filter";
        sets.metaId = this.metaId;
        sets.query = Vue.prototype.$filterItems(sets, "items");
      } else if (this.isMediaPage || this.isItemPage) {
        url += "media/filter";
        sets.typeId = this.typeId;
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
          clearTimeout(this.loader.timeout);
          this.loader.timeout = setTimeout(() => {
            this.loader.show = true;
          }, 500);
          this.isQueryRun = false;
          this.$store.commit("updateStateItems", {
            key: "items",
            value: res.data.items,
          });
          this.total = res.data.items.length;
          this.totalInDb = res.data.total;
          this.Items.itemsOnPage = [];
          this.Items.page = 1;
          this.getItemsOnPage();
        })
        .catch((e) => {
          this.isQueryRun = false;
          console.log(e);
        });
    },
    getItemsOnPage() {
      const items = _.cloneDeep(this.Items.items);
      const limit = this.isInfiniteScroll ? 25 : this.Items.limit;
      const start = (this.Items.page - 1) * limit;
      const end = start + limit;
      const pages = Math.ceil(this.total / limit);
      this.pages = pages;
      if (this.isInfiniteScroll) {
        this.Items.itemsOnPage = [
          ...this.Items.itemsOnPage,
          ...items.slice(start, end),
        ];
      } else {
        this.Items.itemsOnPage = items.slice(start, end);
      }
      // TODO jump to the fisrt page if current page greater than total pages
    },
    async getAssignedMeta() {
      let url = "/api/";
      if (this.isMediaPage || this.isItemPage) {
        url += "MetaInMediaType?typeId=" + this.typeId;
      } else if (this.isMetaPage) {
        url += "ChildMeta?metaId=" + this.metaId;
      }
      await axios
        .get(this.apiUrl + url)
        .then((res) => {
          this.$store.commit("updateStateItems", {
            key: "assigned",
            value: res.data,
          });
          this.isFiltersReady = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    changePage(val) {
      this.$store.commit("updateStateItems", {
        key: "page",
        value: val,
      });
      this.getItemsOnPage();
      this.updatePageSetting({ page: val });
    },
    infiniteScrolling() {
      if (this.Items.page >= this.pages) return;
      this.$store.commit("updateStateItems", {
        key: "page",
        value: this.Items.page + 1,
      });
      this.getItemsOnPage();
    },
    scrollTop() {
      const main = document.getElementsByClassName("v-main__wrap")[0];
      main.scrollTop = 0;
    },
    jumpToPage() {
      if (this.Items.jumpPage === null) return;
      let val = Number(this.Items.jumpPage);
      if (val < 1) val = 1;
      else if (val > this.pages) val = this.pages;
      if (val !== this.Items.page) this.Items.page = val;
      this.Items.jumpPage = val;
      this.changePage(val);
    },
  },
  watch: {
    "Items.size"(val, old) {
      if (val === old) return;
      this.updatePageSetting({ size: val });
    },
  },
};
</script>