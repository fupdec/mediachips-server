<template>
  <div class="d-flex">
    <ItemsAdd v-if="!isMediaPage" />
    <MediaAdd v-if="isMediaPage" />
    <ItemsFilter />
    <ItemsSearch />
    <ItemsFavorite />
    <ItemsSort />
    <ItemsAppearance />
    <ItemsSelect />
  </div>
</template>


<script>
import Vue from "vue";

export default {
  name: "ItemsAppbar",
  components: {
    ItemsAdd: () => import("@/components/app/appbar/elements/ItemsAdd.vue"),
    MediaAdd: () => import("@/components/app/appbar/elements/MediaAdd.vue"),
    ItemsFilter: () =>
      import("@/components/app/appbar/elements/ItemsFilter.vue"),
    ItemsSearch: () =>
      import("@/components/app/appbar/elements/ItemsSearch.vue"),
    ItemsSort: () => import("@/components/app/appbar/elements/ItemsSort.vue"),
    ItemsFavorite: () =>
      import("@/components/app/appbar/elements/ItemsFavorite.vue"),
    ItemsAppearance: () => import("@/components/app/appbar/elements/ItemsAppearance.vue"),
    ItemsSelect: () =>
      import("@/components/app/appbar/elements/ItemsSelect.vue"),
  },
  computed: {
    isMediaPage() {
      return Vue.prototype.$checkCurrentPage("media");
    },
  },
};
</script>