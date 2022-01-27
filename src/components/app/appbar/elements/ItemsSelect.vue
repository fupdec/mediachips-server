<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn @click="toggleSelect" v-on="on" icon>
        <v-icon>mdi-checkbox-marked-outline</v-icon>
      </v-btn>
    </template>
    <span>Select Multiple {{ page.name }}</span>
  </v-tooltip>
</template>


<script>
export default {
  name: "ItemsSelect",
  components: {},
  data: () => ({}),
  computed: {
    isSelect: {
      get() {
        return this.$store.state.isSelect;
      },
      set(value) {
        this.$store.commit("updateStatePage", {
          key: "isSelect",
          value: value,
        });
      },
    },
    page() {
      return this.$store.state.Page;
    },
  },
  methods: {
    toggleSelect() {
      this.$store.commit("updateStatePage", {
        key: "selection",
        value: [],
      });
      this.isSelect = !this.isSelect;
    },
  },
};
</script>