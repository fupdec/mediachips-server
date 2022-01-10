<template>
  <v-app v-if="isApiReady">
    <AppBar />

    <SideBar v-if="sets.navigationSide == '1'" />
    <BottomBar v-if="sets.navigationSide == '2'" />

    <Player v-show="isPlayerActive" />

    <v-main app>
      <router-view :key="$route.fullPath" />
    </v-main>

    <HoverImage />

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
import axios from "axios";

export default {
  name: "App",
  components: {
    AppBar: () => import("@/components/app/AppBar.vue"),
    SideBar: () => import("@/components/app/SideBar.vue"),
    BottomBar: () => import("@/components/app/BottomBar.vue"),
    Player: () => import("@/components/app/Player.vue"),
    HoverImage: () => import("@/components/app/HoverImage.vue"),
  },
  async beforeMount() {},
  async mounted() {
    await Vue.prototype.$getLocalhost();
    this.isApiReady = true;
    await this.initSettings()
      .then(() => {
        this.isServerError = false;
      })
      .catch(() => {
        this.isServerError = true;
      });
    await this.applyTheme();
  },
  data: () => ({
    isServerError: false,
    isApiReady: false,
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    isPlayerActive() {
      return this.$store.state.Player.active;
    },
    sets: {
      get() {
        return this.$store.state.settings;
      },
      set(value) {
        return (this.$store.state.settings = value);
      },
    },
  },
  methods: {
    async initSettings() {
      await axios
        .get(this.apiUrl + "/api/Setting")
        .then((res) => {
          const settings = res.data;
          let sets = {};
          for (let i of settings) {
            sets[i.option] = i.value;
          }
          this.sets = sets;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async applyTheme() {
      const sets = this.sets;
      this.$vuetify.theme.dark = sets.darkMode === "1" ? true : false;
      this.$vuetify.theme.themes.light.primary = sets.appColorLightPrimary;
      this.$vuetify.theme.themes.light.secondary = sets.appColorLightSecondary;
      this.$vuetify.theme.themes.light.accent = sets.appColorLightAccent;
      this.$vuetify.theme.themes.dark.primary = sets.appColorDarkPrimary;
      this.$vuetify.theme.themes.dark.secondary = sets.appColorDarkSecondary;
      this.$vuetify.theme.themes.dark.accent = sets.appColorDarkAccent;
    },
  },
};
</script>


<style lang="scss">
@import "@/assets/styles/app.scss";
</style>