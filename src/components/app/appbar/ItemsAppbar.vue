<template>
  <div class="app-bar-container">
    <div>
      <ItemSearch />
      <ItemsSort />
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
    ItemsSort: () =>
      import("@/components/app/appbar/elements/ItemsSort.vue"),
    ItemsLimit: () => import("@/components/app/appbar/elements/ItemsLimit.vue"),
    ItemSize: () => import("@/components/app/appbar/elements/ItemSize.vue"),
  },
};
</script>