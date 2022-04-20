<template>
  <v-app-bar :color="color" extension-height="28" clipped-left dense app>
    <template v-slot:img="{ props }">
      <v-img v-bind="props" :gradient="gradient"></v-img>
    </template>

    <div class="app-bar-container px-1">
      <div class="scrollable">
        <div class="scrollable-child">
          <!-- <v-btn @click="toggleNavbar" icon class="ml-0">
      <img :src="logoPath" alt="mediaChips" width="28" height="28" />
    </v-btn> -->

          <div v-if="Items.isSelect" class="d-flex align-center">
            <v-btn @click="toggleSelect" icon class="mr-2">
              <v-icon>mdi-close</v-icon>
            </v-btn>

            {{
              Items.selection.length
                ? `${Items.selection.length} selected`
                : `Please select ${Items.name.toLowerCase()}`
            }}
          </div>

          <router-view v-else name="appbar" :key="$route.fullPath" />
        </div>
      </div>

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

    <template v-slot:extension v-if="tabs.length > 0"> <Tabs /> </template>

    <DialogTabEditing />
  </v-app-bar>
</template>


<script>
export default {
  name: "AppBar",
  components: {
    Tabs: () => import("@/components/app/appbar/Tabs.vue"),
    GlobalSearch: () => import("@/components/app/appbar/GlobalSearch.vue"),
    Tasks: () => import("@/components/app/appbar/Tasks.vue"),
    Notifications: () => import("@/components/app/appbar/Notifications.vue"),
    DialogTabEditing: () => import("@/components/dialogs/DialogTabEditing.vue"),
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
    Items() {
      return this.$store.state.Items;
    },
    sets() {
      return this.$store.state.settings;
    },
    reg() {
      return this.$store.getters.reg;
    },
    tabs() {
      return this.$store.state.tabs;
    },
  },
  methods: {
    toggleSelect() {
      this.$store.commit("updateStateItems", {
        key: "isSelect",
        value: !this.Items.isSelect,
      });
      this.$store.commit("updateStateItems", {
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