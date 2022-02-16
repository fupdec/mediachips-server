<template>
  <div class="d-flex">
    <!-- <ItemsFilter />
    <ItemsSearch />
    <ItemsFavorite />
    <ItemsSort />
    <ItemsAppearance />
    <ItemsSelect /> -->
  </div>
</template>


<script>
export default {
  name: "ItemAppbar",
  components: {
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
};
</script>