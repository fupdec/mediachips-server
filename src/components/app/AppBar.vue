<template>
  <v-app-bar app dense clipped-left extension-height="28">
    <div class="app-bar-container">
      <vuescroll>
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
  data: () => ({}),
  computed: {
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
    toggleNav() {
      this.nav = !this.nav;
    },
  },
};
</script>