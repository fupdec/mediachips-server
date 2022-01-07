<template>
  <vuescroll>
    <div class="headline text-h4 d-flex align-center justify-center pt-4 pb-2">
      <v-icon left>mdi-cog-outline</v-icon> Settings
    </div>

    <v-tabs
      v-model="tab"
      centered
      show-arrows
      center-active
      icons-and-text
      class="settings-tabs"
    >
      <v-tab href="#app" draggable="false">
        App <v-icon>mdi-application</v-icon>
      </v-tab>
      <v-tab href="#appearance" draggable="false">
        Appearance <v-icon>mdi-palette</v-icon>
      </v-tab>
      <v-tab href="#meta" draggable="false">
        Meta <v-icon>mdi-shape</v-icon>
      </v-tab>
      <v-tab href="#media" draggable="false">
        Media <v-icon>mdi-heart</v-icon>
      </v-tab>
      <v-tab href="#privacy" draggable="false">
        Privacy <v-icon>mdi-key</v-icon>
      </v-tab>
      <v-tab href="#database" draggable="false">
        Database <v-icon>mdi-database</v-icon>
      </v-tab>
      <v-tab href="#about" draggable="false">
        About <v-icon>mdi-information-variant</v-icon>
      </v-tab>
    </v-tabs>

    <v-divider></v-divider>

    <v-tabs-items v-model="tab" class="settings-tabs">
      <v-tab-item value="app">
        <v-card flat max-width="800" style="margin: auto" class="py-10">
          <WatchedFolders />
        </v-card>
      </v-tab-item>
      <v-tab-item value="appearance">
        <v-card flat max-width="800" style="margin: auto" class="py-10">
          <DarkMode />
          <Appearance />
        </v-card>
      </v-tab-item>
      <v-tab-item value="meta">
        <MetaList />
      </v-tab-item>
      <v-tab-item value="media">
        <v-card flat max-width="800" style="margin: auto" class="py-10">
          <div class="headline text-center pb-2">Meta assigned to media</div>
          <vuescroll>
            <div style="max-height: 400px">
              <TableMetaInMediaTypes />
            </div>
          </vuescroll>
        </v-card>
      </v-tab-item>
      <v-tab-item value="privacy">
        <v-card flat max-width="800" style="margin: auto" class="py-10">
        </v-card>
      </v-tab-item>
      <v-tab-item value="database">
        <v-card flat max-width="800" style="margin: auto" class="py-10">
        </v-card>
      </v-tab-item>
      <v-tab-item value="about">
        <v-card flat max-width="800" style="margin: auto" class="py-10">
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </vuescroll>
</template>


<script>
import vuescroll from "vuescroll";

export default {
  name: "Settings",
  components: {
    vuescroll,
    DarkMode: () => import("@/components/settings/DarkMode.vue"),
    Appearance: () => import("@/components/settings/Appearance.vue"),
    WatchedFolders: () => import("@/components/settings/WatchedFolders.vue"),
    MetaList: () => import("@/components/settings/MetaList.vue"),
    TableMetaInMediaTypes: () =>
      import("@/components/settings/TableMetaInMediaTypes.vue"),
  },
  data: () => ({
    tab: "app",
  }),
};
</script>