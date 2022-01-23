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
        this.$store.commit("updateState", {
          key: "isSelect",
          value: value,
        });
      },
    },
    page() {
      return this.$store.state.page;
    },
  },
  methods: {
    toggleSelect() {
      this.$store.commit("updateState", {
        key: "selected",
        value: [],
      });
      this.isSelect = !this.isSelect;
    },
  },
};
</script>