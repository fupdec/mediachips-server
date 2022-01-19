<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn @click="dialogFilter = true" v-on="on" icon>
        <v-badge
          :value="filters"
          :content="filters"
          overlap
          bottom
          style="z-index: 5"
        >
          <v-icon>mdi-filter-outline</v-icon>
        </v-badge>
      </v-btn>
      <DialogItemsFilter
        :dialog="dialogFilter"
        @close="dialogFilter = false"
      />
    </template>
    <span>Filter {{ page.name }}</span>
  </v-tooltip>
</template>


<script>
export default {
  name: "ItemsFilter",
  components: {
    DialogItemsFilter: () =>
      import("@/components/dialogs/DialogItemsFilter.vue"),
  },
  data: () => ({
    dialogFilter: false,
  }),
  computed: {
    page() {
      return this.$store.state.page;
    },
    filters() {
      return this.$store.state.filters.length;
    },
  },
};
</script>