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
      <v-tab href="#appearance" draggable="false">
        Appearance <v-icon>mdi-brush-variant</v-icon>
      </v-tab>
      <v-tab href="#app" draggable="false">
        Application <v-icon>mdi-application-cog-outline</v-icon>
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
      <v-tab-item value="appearance">
        <v-card flat max-width="800" style="margin: auto" class="py-6">
          <SettingsAppearance />
        </v-card>
      </v-tab-item>
      <v-tab-item value="app">
        <v-card flat max-width="800" style="margin: auto" class="py-6">
          <SettingsGeneral />
          <SettingsVideoPlayer />
          <SettingsWatchedFolders />
          <SettingsLogin />
        </v-card>
      </v-tab-item>
      <v-tab-item value="meta">
        <SettingsMeta />
      </v-tab-item>
      <v-tab-item value="media">
        <v-card flat max-width="800" style="margin: auto" class="py-6">
          <div class="headline text-center pb-2">Meta assigned to media</div>
          <TableMetaInMediaTypes />
          <SettingsVideoPreview />
        </v-card>
      </v-tab-item>
      <v-tab-item value="database">
        <v-card flat max-width="800" style="margin: auto" class="py-6">
          <SettingsDatabases />
        </v-card>
      </v-tab-item>
      <v-tab-item value="about">
        <v-card flat max-width="800" style="margin: auto" class="py-6">
          <SettingsRegistration />
          <v-divider class="my-8"></v-divider>
          <About />
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>


<script>
export default {
  name: "Settings",
  components: {
    SettingsAppearance: () =>
      import("@/components/settings/SettingsAppearance.vue"),
    SettingsWatchedFolders: () =>
      import("@/components/settings/SettingsWatchedFolders.vue"),
    SettingsMeta: () => import("@/components/settings/SettingsMeta.vue"),
    SettingsVideoPreview: () =>
      import("@/components/settings/SettingsVideoPreview.vue"),
    SettingsVideoPlayer: () =>
      import("@/components/settings/SettingsVideoPlayer.vue"),
    TableMetaInMediaTypes: () =>
      import("@/components/settings/TableMetaInMediaTypes.vue"),
    SettingsLogin: () => import("@/components/settings/SettingsLogin.vue"),
    SettingsDatabases: () => import("@/components/settings/SettingsDatabases.vue"),
    SettingsGeneral: () => import("@/components/settings/SettingsGeneral.vue"),
    SettingsRegistration: () =>
      import("@/components/settings/SettingsRegistration.vue"),
    About: () => import("@/components/app/About.vue"),
  },
  mounted() {
    if (this.$route.query.tab == "about") this.tab = "about";
  },
  data: () => ({
    tab: "appearance",
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