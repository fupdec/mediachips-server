<template>
  <v-app v-if="isApiReady">
    <SideBar v-if="sets.navigationSide == '1'" />
    <BottomBar v-if="sets.navigationSide == '2'" />

    <Player v-show="isPlayerActive" />

    <v-main app>
      <vuescroll ref="scroll" @handle-scroll="handleScroll">
        <AppBar />
        <router-view :key="$route.fullPath" />
      </vuescroll>
    </v-main>

    <HoverImage />

    <Snackbars />

    <v-dialog v-model="isServerError" persistent overlay-opacity="1">
      <v-alert type="error" text outlined class="mb-0">
        Failed to start the server. The settings may be incorrect. After
        updating the settings, please refresh the page.
      </v-alert>
    </v-dialog>

    <DialogLogin :login="login" @close="closeApp" @success="login = false" />
  </v-app>
</template>


<script>
import Vue from "vue";
import axios from "axios";
import vuescroll from "vuescroll";
/* TODO
 * countries array
 * playlists: remake as meta
 * toggle visibility of each meta in items on page
 * settings for meta list for each meta
 */
export default {
  name: "App",
  components: {
    vuescroll,
    AppBar: () => import("@/components/app/AppBar.vue"),
    SideBar: () => import("@/components/app/SideBar.vue"),
    BottomBar: () => import("@/components/app/BottomBar.vue"),
    Player: () => import("@/components/app/Player.vue"),
    DialogLogin: () => import("@/components/dialogs/DialogLogin.vue"),
    HoverImage: () => import("@/components/app/HoverImage.vue"),
    Snackbars: () => import("@/components/app/Snackbars.vue"),
  },
  async beforeMount() {},
  async mounted() {
    await Vue.prototype.$getLocalhost();
    this.isApiReady = true;
    await this.initSettings();
    await this.applyTheme();
    await this.getMediaTypes();
    await this.getItems();
    await this.getMeta();
    this.checkLogin();
    await this.getMachineId();
    this.$root.$on("getMeta", () => {
      this.getMeta();
    });
  },
  data: () => ({
    isServerError: false,
    isApiReady: false,
    login: false,
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
        this.$store.state.settings = value;
      },
    },
  },
  methods: {
    async initSettings() {
      await axios
        .get(this.apiUrl + "/api/Setting")
        .then((res) => {
          this.isServerError = false;
          const settings = res.data;
          let sets = {};
          for (let i of settings) {
            sets[i.option] = i.value;
          }
          this.sets = sets;
        })
        .catch((e) => {
          this.isServerError = true;
          console.log(e);
        });
    },
    async getMediaTypes() {
      await axios
        .get(this.apiUrl + "/api/mediaType")
        .then((res) => {
          this.$store.state.mediaTypes = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getItems() {
      await axios
        .get(this.apiUrl + "/api/item")
        .then((res) => {
          this.$store.state.items = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getMeta() {
      await axios
        .get(this.apiUrl + "/api/meta")
        .then((res) => {
          this.$store.state.meta = res.data;
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
    checkLogin() {
      this.login = this.sets.passwordProtection == "1";
    },
    closeApp() {
      // TODO close app
    },
    handleScroll(vertical) {
      if (vertical.scrollTop > 10) this.$store.state.isScrolled = true;
      else this.$store.state.isScrolled = false;
    },
    async getMachineId() {
      await axios
        .get(this.apiUrl + "/api/Task/getMachineId")
        .then((res) => {
          this.$store.state.Reg.machineId = res.data;
        })
        .catch((e) => {
          // console.log(e);
        });
    },
  },
};
</script>


<style lang="scss">
@import "@/assets/styles/app.scss";
</style>