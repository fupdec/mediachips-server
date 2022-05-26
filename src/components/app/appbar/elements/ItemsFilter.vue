<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn @click="toggleFilters" v-on="on" icon>
        <v-badge :value="badge" :content="badge" overlap left>
          <v-icon>mdi-filter-outline</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <span>Filter {{ Items.name }}</span>
  </v-tooltip>
</template>


<script>
export default {
  name: "ItemsFilter",
  computed: {
    Items() {
      return this.$store.state.Items;
    },
    badge() {
      return this.Items.filters.length;
    },
  },
  methods: {
    toggleFilters() {
      this.$store.state.filters.visible = !this.$store.state.filters.visible;
    },
  },
};
</script>