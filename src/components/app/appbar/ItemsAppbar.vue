<template>
  <div class="app-bar-container">
    <div>
      <ItemSearch :query="sets.query" @update="updateQuery($event)" />
    </div>

    <v-spacer></v-spacer>

    <div>
      <ItemsPerPage :perPage="sets.perPage" @update="updatePerPage($event)" />
      <ItemSize :size="sets.size" @update="updateSize($event)" />
    </div>
  </div>
</template>


<script>
import Vue from "vue";
import axios from "axios";

export default {
  name: "ItemsAppbar",
  components: {
    ItemSearch: () => import("@/components/app/appbar/elements/ItemSearch.vue"),
    ItemsPerPage: () =>
      import("@/components/app/appbar/elements/ItemsPerPage.vue"),
    ItemSize: () => import("@/components/app/appbar/elements/ItemSize.vue"),
  },
  mounted() {
    this.getPageSettings();
  },
  data: () => ({
    sets: {
      page: 1,
      perPage: 20,
      query: "",
      size: 3,
    },
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    isMetaPage() {
      return Vue.prototype.$checkCurrentPage("meta");
    },
    isMediaPage() {
      return Vue.prototype.$checkCurrentPage("media");
    },
  },
  methods: {
    async getPageSettings() {
      let query = "";
      if (this.isMetaPage) {
        query = `?metaId=${this.$route.query.metaId}`;
      } else if (this.isMediaPage) {
        query = `?typeId=${this.$route.query.typeId}`;
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
    updateQuery(e) {
      this.sets.query = e;
    },
    updatePerPage(e) {
      this.sets.perPage = e;
    },
    updateSize(e) {
      this.sets.size = e;
    },
  },
};
</script>