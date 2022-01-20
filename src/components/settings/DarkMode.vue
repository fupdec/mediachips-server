<template>
  <v-btn @click="toggleDarkMode" color="primary" class="mx-4" depressed rounded>
    <v-icon left> mdi-theme-light-dark </v-icon>
    Toggle Dark Mode
  </v-btn>
</template>


<script>
import Vue from "vue";

export default {
  name: "DarkMode",
  mounted() {
    this.$nextTick(async () => {
      let option = await Vue.prototype.$getOption("darkMode");
      this.darkMode = option.data.value === "1" ? true : false;
    });
  },
  data: () => ({
    darkMode: false,
  }),
  methods: {
    async toggleDarkMode() {
      this.darkMode = !this.darkMode;
      this.$vuetify.theme.dark = this.darkMode;
      const value = this.darkMode === true ? "1" : "0";
      await Vue.prototype.$setOption("darkMode", value);
    },
  },
};
</script>