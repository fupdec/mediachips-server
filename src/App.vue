<template>
  <v-app v-if="isApiReady">
    <SystemBar v-if="sysBar" :os="sysBar" :disabled="login" />
    <AppBar />

    <SideBar v-if="sets.bottomBar == '0'" />
    <BottomBar v-if="sets.bottomBar == '1'" />

    <Player v-show="isPlayerActive" />

    <v-main app :class="[{ 'bottom-bar': sets.bottomBar == '1' }]">
      <router-view :key="$route.fullPath" />
    </v-main>

    <HoverImage />

    <Snackbars />

    <ContextMenu v-if="$store.state.contextMenu.show" />

    <v-dialog v-model="isServerError" persistent overlay-opacity="1">
      <v-alert type="error" text outlined class="mb-0">
        Failed to start the server. The settings may be incorrect. After
        updating the settings, please refresh the page.
      </v-alert>
    </v-dialog>

    <DialogLogin :login="login" @close="closeApp" @success="login = false" />

    <DialogError v-if="$store.state.Dialogs.error.show" />
    <DialogMediaAddingProcess
      v-if="$store.state.Tasks.mediaAdding.dialogProcess"
      @close="$store.state.Tasks.mediaAdding.dialogProcess = false"
      :dialog="$store.state.Tasks.mediaAdding.dialogProcess"
    />
    <DialogMediaEditing
      v-if="$store.state.Dialogs.mediaEditing.show"
      @close="$store.state.Dialogs.mediaEditing.show = false"
      :dialog="$store.state.Dialogs.mediaEditing.show"
      :media="$store.state.Dialogs.mediaEditing.media"
      :mediaType="$store.state.Dialogs.mediaEditing.mediaType"
    />
    <DialogItemEditing
      v-if="$store.state.Dialogs.itemEditing.show"
      @close="$store.state.Dialogs.itemEditing.show = false"
      :dialog="$store.state.Dialogs.itemEditing.show"
      :item="$store.state.Dialogs.itemEditing.item"
      :meta="$store.state.Dialogs.itemEditing.meta"
    />
    <DialogFolder v-if="$store.state.Watcher.dialogFolder" />
  </v-app>
</template>


<script>
import Vue from "vue";
import axios from "axios";
import AddingMedia from "@/mixins/AddingMedia.vue";
import Watcher from "@/mixins/Watcher.vue";
import SystemBar from "@/components/app/SystemBar.vue";
/* TODO
 * playlists: remake as meta
 * toggle visibility of each meta in items on page
 * settings for meta list for each meta
 */
export default {
  name: "App",
  components: {
    SystemBar,
    AppBar: () => import("@/components/app/AppBar.vue"),
    SideBar: () => import("@/components/app/SideBar.vue"),
    BottomBar: () => import("@/components/app/BottomBar.vue"),
    ContextMenu: () => import("@/components/app/ContextMenu.vue"),
    Player: () => import("@/components/app/Player.vue"),
    DialogLogin: () => import("@/components/dialogs/DialogLogin.vue"),
    HoverImage: () => import("@/components/app/HoverImage.vue"),
    Snackbars: () => import("@/components/app/Snackbars.vue"),
    DialogError: () => import("@/components/dialogs/DialogError.vue"),
    DialogMediaAddingProcess: () =>
      import("@/components/dialogs/DialogMediaAddingProcess.vue"),
    DialogMediaEditing: () =>
      import("@/components/dialogs/DialogMediaEditing.vue"),
    DialogItemEditing: () =>
      import("@/components/dialogs/DialogItemEditing.vue"),
    DialogFolder: () => import("@/components/dialogs/DialogFolder.vue"),
  },
  mixins: [AddingMedia, Watcher],
  async mounted() {
    await Vue.prototype.$initConfig();
    this.isApiReady = true;
    await this.initSettings();
    await this.applyTheme();
    await this.getMediaTypes();
    await this.getItems();
    await this.getMeta();
    this.checkLogin();
    this.checkElectronRunning();
    await this.getMachineId();
    await this.getFolders();
    this.$root.$on("getItems", () => {
      this.getItems();
    });
    this.$root.$on("getMeta", () => {
      this.getMeta();
    });
  },
  beforeDestroy() {
    this.$root.$off("getItems");
    this.$root.$off("getMeta");
  },
  data: () => ({
    isServerError: false,
    isApiReady: false,
    login: false,
  }),
  computed: {
    sysBar() {
      if (!window.os) return false
      else return window.os.type();
    },
    apiUrl() {
      return this.$store.state.localhost;
    },
    isPlayerActive() {
      return this.$store.state.Player.active;
    },
    page() {
      return this.$store.state.Page;
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
          this.$root.$i18n.locale = this.sets.locale;
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
    async getFolders() {
      this.$store.state.Watcher.folders =
        await Vue.prototype.$getWatchedFolders();
    },
    checkElectronRunning() {
      const ua = navigator.userAgent.toLowerCase();
      this.$store.state.isElectron = ua.indexOf(" electron/") > -1;
    },
  },
  watch: {
    $route(to) {
      document.title = to.name + " - mediaChips";
    },
    "page.name"(name) {
      document.title = name + " - mediaChips";
    },
  },
};
</script>


<style lang="scss">
@import "@/assets/styles/app.scss";
</style>