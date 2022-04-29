<template>
  <div>
    <div class="headline text-h4 d-flex align-center justify-center pt-4 pb-2">
      <v-icon left>mdi-cog-outline</v-icon> {{ $t("headings.settings") }}
    </div>

    <v-tabs
      v-model="tab"
      centered
      show-arrows
      center-active
      icons-and-text
      class="fullwidth-tabs transparent-tabs"
    >
      <v-tab href="#general" draggable="false">
        {{ $t("settings.tabs.general") }}
        <v-icon>mdi-application-cog-outline</v-icon>
      </v-tab>
      <v-tab href="#appearance" draggable="false">
        {{ $t("settings.tabs.appearance") }} <v-icon>mdi-brush-variant</v-icon>
      </v-tab>
      <v-tab href="#meta" draggable="false">
        {{ $t("settings.tabs.meta") }} <v-icon>mdi-shape-outline</v-icon>
      </v-tab>
      <v-tab href="#media" draggable="false">
        {{ $t("settings.tabs.media") }} <v-icon>mdi-file-outline</v-icon>
      </v-tab>
      <v-tab href="#database" draggable="false">
        {{ $t("settings.tabs.database") }} <v-icon>mdi-database-outline</v-icon>
      </v-tab>
      <v-tab href="#about" draggable="false">
        {{ $t("settings.tabs.about") }} <v-icon>mdi-information-variant</v-icon>
      </v-tab>
    </v-tabs>

    <v-divider></v-divider>

    <v-tabs-items v-model="tab" class="fullwidth-tabs transparent-tabs">
      <v-tab-item value="general">
        <v-card flat max-width="800" style="margin: auto" class="py-6">
          <SettingsGeneral />
          <SettingsVideoPlayer />
          <SettingsWatchedFolders />
          <SettingsLogin />
        </v-card>
      </v-tab-item>
      <v-tab-item value="appearance">
        <v-card flat max-width="800" style="margin: auto" class="py-6">
          <SettingsAppearance />
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
          <SettingsBackups />
          <v-divider class="mt-10 mb-2" />
          <div class="subtitle-2 text-right mb-4">Clear generated images</div>
          <SettingsClearGeneratedImages button="Marks" imageType="marks" />
          <SettingsClearGeneratedImages button="Grids" imageType="grids" />
          <SettingsClearGeneratedImages
            button="Timelines"
            imageType="timelines"
          />
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
    SettingsDatabases: () =>
      import("@/components/settings/SettingsDatabases.vue"),
    SettingsBackups: () => import("@/components/settings/SettingsBackups.vue"),
    SettingsClearGeneratedImages: () =>
      import("@/components/settings/SettingsClearGeneratedImages.vue"),
    SettingsGeneral: () => import("@/components/settings/SettingsGeneral.vue"),
    SettingsRegistration: () =>
      import("@/components/settings/SettingsRegistration.vue"),
    About: () => import("@/components/app/About.vue"),
  },
  mounted() {
    if (this.$route.query.tab == "about") this.tab = "about";
  },
  data: () => ({
    tab: "general",
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