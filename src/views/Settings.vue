<template>
  <vuescroll>
    <div class="headline text-h4 d-flex align-center justify-center pt-4 pb-2">
      <v-icon left>mdi-cog-outline</v-icon> Settings
    </div>

    <v-tabs v-model="tab" centered icons-and-text class="settings-tabs">
      <v-tab href="#app-settings" draggable="false">
        App<v-icon>mdi-application</v-icon>
      </v-tab>
      <v-tab href="#appearance-settings" draggable="false">
        Appearance<v-icon>mdi-palette</v-icon>
      </v-tab>
      <v-tab href="#meta-settings" draggable="false">
        Meta<v-icon>mdi-shape</v-icon>
      </v-tab>
      <v-tab href="#videos-settings" draggable="false">
        Videos<v-icon>mdi-video</v-icon>
      </v-tab>
      <v-tab href="#privacy-settings" draggable="false">
        Privacy<v-icon>mdi-key</v-icon>
      </v-tab>
      <v-tab href="#database-settings" draggable="false">
        Database<v-icon>mdi-database</v-icon>
      </v-tab>
      <v-tab href="#about-settings" draggable="false">
        About<v-icon>mdi-information-variant</v-icon>
      </v-tab>
    </v-tabs>

    <v-divider></v-divider>

    <v-tabs-items v-model="tab" class="settings-tabs">
      <v-tab-item value="app-settings">
        <v-card flat max-width="800" style="margin: auto" class="py-10">
          <WatchedFolders />
        </v-card>
      </v-tab-item>
      <v-tab-item value="appearance-settings">
        <v-card flat max-width="800" style="margin: auto" class="py-10">
          <DarkMode />
        </v-card>
      </v-tab-item>
      <v-tab-item value="meta-settings">
        <v-card flat max-width="800" style="margin: auto" class="py-10">
          <vuescroll>
            <div style="max-height: 400px">
              <TableMetaInMediaTypes />
            </div>
          </vuescroll>
        </v-card>
      </v-tab-item>
      <v-tab-item value="videos-settings">
        <v-card flat max-width="800" style="margin: auto" class="py-10">
        </v-card>
      </v-tab-item>
      <v-tab-item value="privacy-settings">
        <v-card flat max-width="800" style="margin: auto" class="py-10">
        </v-card>
      </v-tab-item>
      <v-tab-item value="database-settings">
        <v-card flat max-width="800" style="margin: auto" class="py-10">
        </v-card>
      </v-tab-item>
      <v-tab-item value="about-settings">
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
    WatchedFolders: () => import("@/components/settings/WatchedFolders.vue"),
    TableMetaInMediaTypes: () => import("@/components/settings/TableMetaInMediaTypes.vue"),
  },
  data: () => ({
    tab: "app-settings",
  }),
};
</script>