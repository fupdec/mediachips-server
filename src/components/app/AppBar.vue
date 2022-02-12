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

        <div v-if="page.isSelect" class="d-flex align-center">
          <v-btn @click="toggleSelect" icon class="mr-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>

          {{
            page.selection.length
              ? `${page.selection.length} selected`
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
    // logoPath() {
    //   return path.join(__dirname, "/icons/icon.png");
    // },
    color() {
      if (this.$vuetify.theme.dark) return this.sets.appColorDarkHeader;
      return this.sets.appColorLightHeader;
    },
    gradient() {
      if (this.sets.headerGradient == "0") return "";
      let gradient = "";
      if (this.$vuetify.theme.dark) gradient = this.sets.headerGradientDark;
      else gradient = this.sets.headerGradientLight;
      gradient = gradient.replace("linear-gradient(", "");
      gradient = gradient.replace(")", "");
      return gradient;
    },
    page() {
      return this.$store.state.Page;
    },
    sets() {
      return this.$store.state.settings;
    },
    reg() {
      return this.$store.getters.reg;
    },
    // tabs() { return this.$store.getters.tabs },
  },
  methods: {
    toggleSelect() {
      this.$store.commit("updateStatePage", {
        key: "isSelect",
        value: !this.page.isSelect,
      });
      this.$store.commit("updateStatePage", {
        key: "selection",
        value: [],
      });
    },
    register() {
      if (this.$router.history.current.name !== "Settings")
        this.$router.push("/settings/?tab=about");
    },
  },
};
</script>