<template>
  <div>
    <div class="headline text-h4 d-flex align-center justify-center pt-4 pb-2">
      <v-icon left>mdi-cog-outline</v-icon> Settings
    </div>

    <v-tabs
      v-model="tab"
      centered
      show-arrows
      center-active
      icons-and-text
      class="fullwidth-tabs transparent-tabs"
    >
      <v-tab href="#app" draggable="false">
        App <v-icon>mdi-application-cog-outline</v-icon>
      </v-tab>
      <v-tab href="#appearance" draggable="false">
        Appearance <v-icon>mdi-brush-variant</v-icon>
      </v-tab>
      <v-tab href="#meta" draggable="false">
        Meta <v-icon>mdi-shape-outline</v-icon>
      </v-tab>
      <v-tab href="#media" draggable="false">
        Media <v-icon>mdi-file-outline</v-icon>
      </v-tab>
      <v-tab href="#database" draggable="false">
        Database <v-icon>mdi-database-outline</v-icon>
      </v-tab>
      <v-tab href="#about" draggable="false">
        About <v-icon>mdi-information-variant</v-icon>
      </v-tab>
    </v-tabs>

    <v-divider></v-divider>

    <v-tabs-items v-model="tab" class="fullwidth-tabs transparent-tabs">
      <v-tab-item value="app">
        <v-card flat max-width="800" style="margin: auto" class="py-6">
          <!-- <WatchedFolders /> -->
          <Login />
        </v-card>
      </v-tab-item>
      <v-tab-item value="appearance">
        <v-card flat max-width="800" style="margin: auto" class="py-6">
          <Appearance />
        </v-card>
      </v-tab-item>
      <v-tab-item value="meta">
        <MetaList />
      </v-tab-item>
      <v-tab-item value="media">
        <v-card flat max-width="800" style="margin: auto" class="py-6">
          <div class="headline text-center pb-2">Meta assigned to media</div>
          <TableMetaInMediaTypes />
          <VideoPreview />
        </v-card>
      </v-tab-item>
      <v-tab-item value="database">
        <v-card flat max-width="800" style="margin: auto" class="py-6">
        </v-card>
      </v-tab-item>
      <v-tab-item value="about">
        <v-card flat max-width="800" style="margin: auto" class="py-6">
          <Registration />
          <About />
        </v-card>
      </v-tab-item>
    </v-tabs-items>

    <div v-show="appSets.navigationSide == '2'" class="py-6"></div>
  </div>
</template>


<script>
export default {
  name: "Settings",
  components: {
    Appearance: () => import("@/components/settings/Appearance.vue"),
    WatchedFolders: () => import("@/components/settings/WatchedFolders.vue"),
    MetaList: () => import("@/components/settings/MetaList.vue"),
    VideoPreview: () => import("@/components/settings/VideoPreview.vue"),
    TableMetaInMediaTypes: () =>
      import("@/components/settings/TableMetaInMediaTypes.vue"),
    Login: () => import("@/components/settings/Login.vue"),
    Registration: () => import("@/components/settings/Registration.vue"),
    About: () => import("@/components/app/About.vue"),
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$route.query.tab == "about") this.tab = "about";
    });
  },
  data: () => ({
    tab: "app",
  }),
  computed: {
    appSets: {
      get() {
        return this.$store.state.settings;
      },
      set(value) {
        this.$store.state.settings = value;
      },
    },
  },
};
</script>