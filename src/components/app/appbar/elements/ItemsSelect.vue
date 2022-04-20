<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn @click="toggleSelect" v-on="on" icon>
        <v-icon>mdi-checkbox-marked-outline</v-icon>
      </v-btn>
    </template>
    <span>Select Multiple {{ Items.name }}</span>
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
        this.$store.commit("updateStateItems", {
          key: "isSelect",
          value: value,
        });
      },
    },
    Items() {
      return this.$store.state.Items;
    },
  },
  methods: {
    toggleSelect() {
      this.$store.commit("updateStateItems", {
        key: "selection",
        value: [],
      });
      this.isSelect = !this.isSelect;
    },
  },
};
</script>