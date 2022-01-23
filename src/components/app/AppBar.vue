<template>
  <v-app-bar :color="color" clipped-left dense app>
    <template v-slot:img="{ props }">
      <v-img v-bind="props" :gradient="gradient"></v-img>
    </template>
    <div class="app-bar-container">
      <vuescroll>
        <!-- <v-btn @click="toggleNavbar" icon class="ml-0">
      <img :src="logoPath" alt="mediaChips" width="28" height="28" />
    </v-btn> -->

        <router-view name="appbar" :key="$route.fullPath" />
      </vuescroll>

      <v-spacer></v-spacer>

      <div class="d-flex">
        <GlobalSearch />
        <Tasks />
        <Notifications />
      </div>
    </div>

    <!-- <template v-slot:extension v-if="tabs.length>0"> <Tabs /> </template> -->
  </v-app-bar>
</template>


<script>
const path = require("path");
import vuescroll from "vuescroll";

export default {
  name: "AppBar",
  components: {
    vuescroll,
    // Tabs: () => import('@/components/elements/Tabs.vue'),
    GlobalSearch: () =>
      import("@/components/app/appbar/elements/GlobalSearch.vue"),
    Tasks: () => import("@/components/app/appbar/elements/Tasks.vue"),
    Notifications: () =>
      import("@/components/app/appbar/elements/Notifications.vue"),
  },
  mounted() {},
  data: () => ({
    collapse: false,
  }),
  computed: {
    logoPath() {
      return path.join(__dirname, "/icons/icon.png");
    },
    isScrolled() {
      return this.$store.state.isScrolled;
    },
    color() {
      if (this.$vuetify.theme.dark) return this.appSets.appColorDarkHeader;
      return this.appSets.appColorLightHeader;
    },
    gradient() {
      if (this.appSets.headerGradient == "0") return "";
      let gradient = "";
      if (this.$vuetify.theme.dark) gradient = this.appSets.headerGradientDark;
      else gradient = this.appSets.headerGradientLight;
      gradient = gradient.replace("linear-gradient(", "");
      gradient = gradient.replace(")", "");
      return gradient;
    },
    page: {
      get() {
        return this.$store.state.page;
      },
      set(value) {
        this.$store.commit("updateState", {
          key: "page",
          value: value,
        });
      },
    },
    appSets: {
      get() {
        return this.$store.state.settings;
      },
      set(value) {
        this.$store.commit("updateState", {
          key: "settings",
          value: _.cloneDeep(value),
        });
      },
    },
    // headerColor() {
    //   if (this.$store.state.Settings.headerGradient) {
    //     if (this.$vuetify.theme.isDark) {
    //       return this.$store.state.Settings.headerGradientDark
    //     } else return this.$store.state.Settings.headerGradientLight
    //   } else {
    //     if (this.$vuetify.theme.isDark) {
    //       return this.$store.state.Settings.appColorDarkHeader
    //     } else return this.$store.state.Settings.appColorLightHeader
    //   }
    // },
    // tabs() { return this.$store.getters.tabs },
    nav: {
      get() {
        return this.$store.state.navDrawer;
      },
      set(value) {
        this.$store.state.navDrawer = value;
      },
    },
  },
  methods: {
    toggleNavbar() {
      this.nav = !this.nav;
    },
  },
};
</script>