<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn @click="toggleFilters" v-on="on" icon>
        <v-badge :value="badge" :content="badge" overlap left>
          <v-icon>mdi-filter-outline</v-icon>
        </v-badge>
      </v-btn>
      <DialogItemsFilter :dialog="dialogFilter" @close="dialogFilter = false" />
    </template>
    <span>Filter {{ Items.name }}</span>
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
    Items() {
      return this.$store.state.Items;
    },
    badge() {
      return this.$store.state.Items.filters.length;
    },
  },
  methods: {
    toggleFilters() {
      this.dialogFilter = true;
      this.Items.isFilters = !this.Items.isFilters;
    },
  },
};
</script>