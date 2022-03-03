<template>
  <div>
    <div class="headline text-h4 d-flex align-center justify-center pt-4 pb-2">
      <v-icon left>mdi-{{ page.icon }}</v-icon> {{ page.name }}
      <span v-if="total != totalInDb" class="body-1 text--secondary ml-2">
        ({{ total }} of {{ totalInDb }})
      </span>
      <span v-else class="body-1 text--secondary ml-2">({{ total }})</span>
    </div>

    <v-container
      v-if="page.filters.length > 0"
      class="d-flex justify-center align-start"
      fluid
    >
      <FiltersChips :filters="page.filters" />
    </v-container>

    <v-container
      v-if="itemsOnPage.length && !isInfiniteScroll"
      class="d-flex justify-center align-center"
      fluid
    >
      <v-pagination
        :value="page.page"
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
              v-model="page.jumpPage"
              @keypress.enter="jumpToPage(page.jumpPage)"
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
      v-if="isMediaPage || isItemPage"
      fluid
      class="wide-image videos-selection"
      :class="[
        `item-size-${page.size}`,
        `gap-size-${sets.gapSize}`,
        { 'card-grid': page.view == '1' },
        { 'line-grid': page.view == '2' },
      ]"
    >
      <ItemVideo
        v-for="(i, x) in itemsOnPage"
        :key="i.id"
        :video="i"
        :reg="reg"
        :x="x"
      />
    </v-container>

    <v-container
      v-else-if="isMetaPage"
      fluid
      :class="[
        `item-size-${page.size}`,
        `gap-size-${sets.gapSize}`,
        { 'card-grid': page.view == '1' },
        { 'chips-grid': page.view == '2' },
      ]"
    >
      <ItemMeta
        v-for="i in itemsOnPage"
        :key="i.id"
        :item="i"
        :meta="meta"
        :upd="upd"
      />
    </v-container>

    <v-pagination
      v-show="itemsOnPage.length && !isInfiniteScroll"
      :value="page.page"
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

    <div v-if="itemsOnPage.length && isInfiniteScroll" class="text-center py-6">
      <Loading
        v-if="loader.show && page.page != pages"
        v-intersect="infiniteScrolling"
      />
      <v-btn
        v-if="page.page == pages"
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

    <div v-show="sets.navigationSide == '2'" class="py-6"></div>
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
    ItemMeta: () => import("@/components/items/ItemMeta.vue"),
    FiltersChips: () => import("@/components/elements/FiltersChips.vue"),
    Loading: () => import("@/components/elements/Loading.vue"),
  },
  mixins: [GeneratingThumbsForVideos, ComputedForItemsPage],
  async beforeMount() {
    this.itemsOnPage = [];
    this.$store.commit("updateStatePage", {
      key: "isSelect",
      value: false,
    });
    this.$store.commit("updateStatePage", {
      key: "selection",
      value: [],
    });
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
      this.$store.commit("updateStatePage", {
        key: "page",
        value: 1,
      });
      if (val == 101) this.itemsOnPage = [];
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
    meta: null,
    itemsOnPage: [],
    total: 1,
    totalInDb: 0,
    pages: 0,
    isQueryRun: false,
    loader: {
      show: false,
      timeout: false,
    },
    upd: [],
  }),
  computed: {
    isInfiniteScroll() {
      return this.page.limit === 101;
    },
    reg() {
      return this.$store.getters.reg;
    },
  },
  methods: {
    async init() {
      if (this.isMetaPage) await this.getMeta();
      else if (this.isMediaPage || this.isItemPage) await this.getMedia();
      await this.getPageSettings();
      await this.getAssignedMeta();
      await this.getFilters();
      await this.getItemsFromDb();
    },
    async getFilters() {
      let query = "?";
      if (this.isMediaPage) {
        if (this.typeId) query += `typeId=${this.typeId}`;
      } else if (this.isItemPage) {
        if (this.itemId) query += `itemId=${this.itemId}`;
        if (this.typeId) query += `&typeId=${this.typeId}`;
      } else if (this.isMetaPage) {
        if (this.metaId) query += `metaId=${this.metaId}`;
      }
      await axios
        .get(this.apiUrl + "/api/SavedFilter/page" + query)
        .then((res) => {
          const filters =
            res.data.filters.map((i) => {
              let by = i.filterRow.by;
              if (/\d/.test(by)) i.filterRow.by = +by;
              delete i.filterRow.createdAt;
              delete i.filterRow.updatedAt;
              return i.filterRow;
            }) || [];
          this.$store.commit("updateStatePage", {
            key: "filters",
            value: filters,
          });
          this.$store.commit("updateStatePage", {
            key: "savedFilter",
            value: res.data.savedFilter || {},
          });
          if (this.isItemPage) this.initFilterForItemPage();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    initFilterForItemPage() {
      const index = this.page.filters.findIndex(
        (i) => i.metaId == this.metaId && i.lock == true
      );
      if (index < 0)
        this.page.filters.push({
          id: null,
          by: this.metaId,
          type: "array",
          cond: "in",
          val: [this.itemId],
          flag: null,
          lock: true,
          appbar: false,
          union: "AND",
          metaId: this.metaId,
        });
    },
    async getPageSettings() {
      let query = "";
      if (this.isMetaPage) {
        query = `?metaId=${this.meta.id}`;
      } else if (this.isMediaPage) {
        query = `?typeId=${this.typeId}`;
      } else if (this.isItemPage) {
        query = `?typeId=${this.typeId}&itemId=${this.itemId}`;
      }
      let url = "/api/PageSetting";
      await axios
        .get(this.apiUrl + url + query)
        .then((res) => {
          this.$store.commit("updateStatePage", {
            key: "page",
            value: res.data.page,
          });
          this.$store.commit("updateStatePage", {
            key: "limit",
            value: res.data.limit,
          });
          this.$store.commit("updateStatePage", {
            key: "size",
            value: res.data.size,
          });
          this.$store.commit("updateStatePage", {
            key: "view",
            value: res.data.view,
          });
          this.$store.commit("updateStatePage", {
            key: "sortBy",
            value: res.data.sortBy,
          });
          this.$store.commit("updateStatePage", {
            key: "sortDir",
            value: res.data.sortDir,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    updatePageSetting(data) {
      let query = "";
      if (this.isMetaPage) {
        query = `?metaId=${this.metaId}`;
      } else if (this.isMediaPage) {
        query = `?typeId=${this.typeId}`;
      }
      axios({
        method: "put",
        url: this.apiUrl + "/api/PageSetting" + query,
        data: data,
      });
    },
    async getMeta() {
      await axios
        .get(this.apiUrl + "/api/meta/" + this.metaId)
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
        .get(this.apiUrl + "/api/MediaType/" + this.typeId)
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
      sets.sortBy = this.page.sortBy;
      sets.sortDir = this.page.sortDir;
      sets.filters = _.cloneDeep(this.page.filters);
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
          this.$store.commit("updateStatePage", {
            key: "items",
            value: res.data.items,
          });
          this.total = res.data.items.length;
          this.totalInDb = res.data.total;
          this.itemsOnPage = [];
          this.page.page = 1;
          this.getItemsOnPage();
        })
        .catch((e) => {
          this.isQueryRun = false;
          console.log(e);
        });
    },
    getItemsOnPage() {
      const items = _.cloneDeep(this.page.items);
      const limit = this.isInfiniteScroll ? 25 : this.page.limit;
      const start = (this.page.page - 1) * limit;
      const end = start + limit;
      const pages = Math.ceil(this.total / limit);
      this.pages = pages;
      if (this.isInfiniteScroll) {
        this.itemsOnPage = [...this.itemsOnPage, ...items.slice(start, end)];
      } else {
        this.itemsOnPage = items.slice(start, end);
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
          this.$store.commit("updateStatePage", {
            key: "assigned",
            value: res.data,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    changePage(val) {
      this.$store.commit("updateStatePage", {
        key: "page",
        value: val,
      });
      this.getItemsOnPage();
      this.updatePageSetting({ page: val });
    },
    infiniteScrolling() {
      if (this.page.page >= this.pages) return;
      this.$store.commit("updateStatePage", {
        key: "page",
        value: this.page.page + 1,
      });
      this.getItemsOnPage();
    },
    scrollTop() {
      const main = document.getElementsByClassName("v-main__wrap")[0];
      main.scrollTop = 0;
    },
    jumpToPage() {
      if (this.page.jumpPage === null) return;
      let val = Number(this.page.jumpPage);
      if (val < 1) val = 1;
      else if (val > this.pages) val = this.pages;
      if (val !== this.page.page) this.page.page = val;
      this.page.jumpPage = val;
      this.changePage(val);
    },
  },
  watch: {
    "page.size"(val, old) {
      if (val === old) return;
      this.updatePageSetting({ size: val });
    },
  },
};
</script>