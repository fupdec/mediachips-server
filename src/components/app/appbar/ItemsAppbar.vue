<template>
  <div class="app-bar-container">
    <div>
      <ItemSearch />
      <ItemsSortBy />
      <ItemsSortDirection />
    </div>

    <v-spacer></v-spacer>

    <div>
      <ItemsLimit />
      <ItemSize />
    </div>
  </div>
</template>


<script>
export default {
  name: "ItemsAppbar",
  components: {
    ItemSearch: () => import("@/components/app/appbar/elements/ItemSearch.vue"),
    ItemsSortBy: () =>
      import("@/components/app/appbar/elements/ItemsSortBy.vue"),
    ItemsSortDirection: () =>
      import("@/components/app/appbar/elements/ItemsSortDirection.vue"),
    ItemsLimit: () => import("@/components/app/appbar/elements/ItemsLimit.vue"),
    ItemSize: () => import("@/components/app/appbar/elements/ItemSize.vue"),
  },
};
</script>