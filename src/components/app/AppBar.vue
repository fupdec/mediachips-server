<template>
  <v-app-bar :color="color" clipped-left dense app>
    <template v-slot:img="{ props }">
      <v-img v-bind="props" :gradient="gradient"></v-img>
    </template>

    <div class="app-bar-container px-1">
      <vuescroll>
        <!-- <v-btn @click="toggleNavbar" icon class="ml-0">
      <img :src="logoPath" alt="mediaChips" width="28" height="28" />
    </v-btn> -->

        <div v-if="isSelect" class="d-flex align-center">
          <v-btn @click="toggleSelect" icon class="mr-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>

          {{
            selected.length
              ? `${selected.length} selected`
              : `Please select ${page.name.toLowerCase()}`
          }}
        </div>

        <router-view v-else name="appbar" :key="$route.fullPath" />
      </vuescroll>

      <v-spacer></v-spacer>

      <div class="d-flex">
        <v-tooltip v-if="!reg" bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" @click="register" icon>
              <v-icon>mdi-lock-question</v-icon>
            </v-btn>
          </template>
          <span>
            In the unregistered version, <br />
            the number of media per page is limited to 10
          </span>
        </v-tooltip>

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
import Keys from "@/mixins/Keys";

export default {
  name: "AppBar",
  mixins: [Keys],
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
    selected: {
      get() {
        return this.$store.state.selected;
      },
      set(value) {
        this.$store.commit("updateState", {
          key: "selected",
          value: value,
        });
      },
    },
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
    toggleSelect() {
      this.$store.commit("updateState", {
        key: "selected",
        value: [],
      });
      this.isSelect = !this.isSelect;
    },
    register() {
      if (this.$router.history.current.name !== "Settings")
        this.$router.push("/settings/?tab=about");
    },
  },
};
</script>