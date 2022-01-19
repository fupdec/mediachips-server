<template>
  <div class="app-bar-container">
    <div class="d-flex">
      <ItemsAdd v-if="!isMediaPage" />
      <ItemsFilter />
      <ItemsSearch />
      <ItemsFavorite />
      <ItemsSort />
    </div>

    <v-spacer></v-spacer>

    <div class="d-flex">
      <ItemsLimit />
      <ItemsSize />
    </div>
  </div>
</template>


<script>
import Vue from "vue";

export default {
  name: "ItemsAppbar",
  components: {
    ItemsAdd: () => import("@/components/app/appbar/elements/ItemsAdd.vue"),
    ItemsFilter: () =>
      import("@/components/app/appbar/elements/ItemsFilter.vue"),
    ItemsSearch: () =>
      import("@/components/app/appbar/elements/ItemsSearch.vue"),
    ItemsSort: () => import("@/components/app/appbar/elements/ItemsSort.vue"),
    ItemsFavorite: () =>
      import("@/components/app/appbar/elements/ItemsFavorite.vue"),
    ItemsLimit: () => import("@/components/app/appbar/elements/ItemsLimit.vue"),
    ItemsSize: () => import("@/components/app/appbar/elements/ItemsSize.vue"),
  },
  computed: {
    isMediaPage() {
      return Vue.prototype.$checkCurrentPage("media");
    },
  },
};
</script>