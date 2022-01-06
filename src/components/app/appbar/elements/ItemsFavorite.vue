<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn @click="toggle" v-on="on" icon tile>
        <v-icon v-if="favorite">mdi-heart</v-icon>
        <v-icon v-else>mdi-heart-outline</v-icon>
      </v-btn>
    </template>
    <span>Toggle Favorites</span>
  </v-tooltip>
</template>


<script>
export default {
  name: "ItemsFavorite",
  data: () => ({
    favorite: false,
  }),
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
      this.favorite = !this.favorite;
    },
  },
};
</script>