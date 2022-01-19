<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn @click="toggle" v-on="on" icon>
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
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    filters() {
      return this.$store.state.filters;
    },
    index() {
      return this.filters.findIndex(
        (i) => i.by == "favorite" && i.appbar == true
      );
    },
  },
  methods: {
    init() {
      if (this.index > -1) this.favorite = this.filters[this.index].cond == "=";
      else this.favorite = false;
    },
    toggle() {
      this.favorite = !this.favorite;
      const values = {
        index: this.index,
        favorite: this.favorite,
      };
      this.$root.$emit("toggleFavorite", values);
    },
  },
  watch: {
    filters() {
      this.init();
    },
  },
};
</script>