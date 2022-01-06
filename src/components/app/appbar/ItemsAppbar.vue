<template>
  <div class="app-bar-container">
    <div>
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
export default {
  name: "ItemsAppbar",
  components: {
    ItemsSearch: () => import("@/components/app/appbar/elements/ItemsSearch.vue"),
    ItemsSort: () =>
      import("@/components/app/appbar/elements/ItemsSort.vue"),
    ItemsFavorite: () => import("@/components/app/appbar/elements/ItemsFavorite.vue"),
    ItemsLimit: () => import("@/components/app/appbar/elements/ItemsLimit.vue"),
    ItemsSize: () => import("@/components/app/appbar/elements/ItemsSize.vue"),
  },
};
</script>