<template>
  <div class="app-bar-container">
    <div>
      <ItemsAdd v-if="!isMediaPage" />
      <ItemsSearch />
      <ItemsSort />
      <!-- <ItemsFavorite /> -->
    </div>

    <v-spacer></v-spacer>

    <div>
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
    ItemsSearch: () => import("@/components/app/appbar/elements/ItemsSearch.vue"),
    ItemsSort: () =>
      import("@/components/app/appbar/elements/ItemsSort.vue"),
    ItemsFavorite: () => import("@/components/app/appbar/elements/ItemsFavorite.vue"),
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