<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn @click="dialogFilter = true" v-on="on" icon>
        <v-badge :value="badge" :content="badge" overlap left>
          <v-icon>mdi-filter-outline</v-icon>
        </v-badge>
      </v-btn>
      <DialogItemsFilter :dialog="dialogFilter" @close="dialogFilter = false" />
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
      return this.$store.state.Page;
    },
    badge() {
      return this.$store.state.Page.filters.length;
    },
  },
};
</script>