<template>
  <v-app>
    <AppBar />

    <SideBar />
    <Player v-show="isPlayerActive" />

    <v-main app>
      <router-view :key="$route.fullPath" />
    </v-main>
  </v-app>
</template>


<script>
import Vue from "vue";

export default {
  name: "App",
  components: {
    AppBar: () => import("@/components/app/AppBar.vue"),
    SideBar: () => import("@/components/app/SideBar.vue"),
    Player: () => import("@/components/app/Player.vue"),
  },
  async beforeMount() {
    await Vue.prototype.$getLocalhost();
  },
  mounted() {
    this.$nextTick(() => {
      this.applyTheme();
    });
  },
  data: () => ({}),
  computed: {
    isPlayerActive() {
      return this.$store.state.Player.active;
    },
  },
  methods: {
    applyTheme() {
      this.getDarkMode();
      this.$vuetify.theme.themes.light.primary = "#7059b7";
      this.$vuetify.theme.themes.light.secondary = "#e98700";
      this.$vuetify.theme.themes.light.accent = "#7059b7";
      this.$vuetify.theme.themes.dark.primary = "#7059b7";
      this.$vuetify.theme.themes.dark.secondary = "#e98700";
      this.$vuetify.theme.themes.dark.accent = "#7059b7";
    },
    async getDarkMode() {
      let option = await Vue.prototype.$getOption("darkMode");
      this.$vuetify.theme.dark = option.data.value === "1" ? true : false;
    },
  },
};
</script>


<style lang="scss">
@import "@/assets/styles/app.scss";
</style>