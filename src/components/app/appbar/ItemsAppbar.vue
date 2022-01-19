<template>
  <div class="app-bar-container">
    <vuescroll>
      <div class="d-flex">
        <ItemsAdd v-if="!isMediaPage" />
        <ItemsFilter />
        <ItemsSearch />
        <ItemsFavorite />
        <ItemsSort />
        <ItemsLimit />
        <ItemsSize />
      </div>
    </vuescroll>

    <v-spacer></v-spacer>

    <div class="d-flex">
      <GlobalSearch />
      <Notifications />
    </div>
  </div>
</template>


<script>
import Vue from "vue";
import vuescroll from "vuescroll";

export default {
  name: "ItemsAppbar",
  components: {
    vuescroll,
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
    GlobalSearch: () =>
      import("@/components/app/appbar/elements/GlobalSearch.vue"),
    Notifications: () =>
      import("@/components/app/appbar/elements/Notifications.vue"),
  },
  computed: {
    isMediaPage() {
      return Vue.prototype.$checkCurrentPage("media");
    },
  },
};
</script>