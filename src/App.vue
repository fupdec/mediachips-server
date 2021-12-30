<template>
  <v-app v-if="isApiReady">
    <AppBar />

    <SideBar />
    <Player v-show="isPlayerActive" />

    <v-main app>
      <router-view :key="$route.fullPath" />
    </v-main>

    <v-dialog v-model="isServerError" persistent overlay-opacity="1">
      <v-alert type="error" text outlined class="mb-0">
        Failed to start the server. The settings may be incorrect. After
        updating the settings, please refresh the page.
      </v-alert>
    </v-dialog>
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
  async beforeMount() {},
  async mounted() {
    await Vue.prototype.$getLocalhost();
    this.isApiReady = true;
    await this.applyTheme()
      .then(() => {
        this.isServerError = false;
      })
      .catch(() => {
        this.isServerError = true;
      });
  },
  data: () => ({
    isServerError: false,
    isApiReady: false,
  }),
  computed: {
    isPlayerActive() {
      return this.$store.state.Player.active;
    },
  },
  methods: {
    async applyTheme() {
      let option = await Vue.prototype.$getOption("darkMode");
      this.$vuetify.theme.dark = option.data.value === "1" ? true : false;
      this.$vuetify.theme.themes.light.primary = "#7059b7";
      this.$vuetify.theme.themes.light.secondary = "#e98700";
      this.$vuetify.theme.themes.light.accent = "#7059b7";
      this.$vuetify.theme.themes.dark.primary = "#7059b7";
      this.$vuetify.theme.themes.dark.secondary = "#e98700";
      this.$vuetify.theme.themes.dark.accent = "#7059b7";
    },
  },
};
</script>


<style lang="scss">
@import "@/assets/styles/app.scss";
</style>