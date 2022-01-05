<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn @click="toggle" v-bind="attrs" v-on="on" icon tile>
        <v-icon v-if="sets.sortDir == 'asc'"> mdi-sort-ascending </v-icon>
        <v-icon v-else> mdi-sort-descending </v-icon>
      </v-btn>
    </template>
    <span>Toggle Sort Direction</span>
  </v-tooltip>
</template>


<script>
export default {
  name: "ItemsSortDirection",
  computed: {
    sets: {
      get() {
        return this.$store.state.pageSettings;
      },
      set(value) {
        return (this.$store.state.pageSettings = value);
      },
    },
  },
  methods: {
    toggle() {
      this.sets.sortDir = this.sets.sortDir === "asc" ? "desc" : "asc";
    },
  },
};
</script>