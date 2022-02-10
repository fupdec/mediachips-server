<template>
  <v-expansion-panels multiple class="mt-8 settings-meta">
    <v-expansion-panel>
      <v-expansion-panel-header> Global settings </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" left>mdi-menu</v-icon>
              </template>
              <span
                >To change the order of items in the menu - drag the icons</span
              >
            </v-tooltip>
            <v-switch
              v-model="settings.hidden"
              label="Hide in navbar"
              class="ma-0 pa-0"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" left>mdi-map-marker</v-icon>
              </template>
              <span>Marks on timeline in built-in player</span>
            </v-tooltip>
            <v-switch
              v-model="settings.marks"
              label="Marks in player"
              class="ma-0 pa-0"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" left>mdi-file-search-outline</v-icon>
              </template>
              <span>
                Allow the application to parse the path to the media file and
                look for meta item's name in it
              </span>
            </v-tooltip>
            <v-switch
              v-model="settings.parser"
              label="Parse media for data"
              class="ma-0 pa-0"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" left>mdi-file-tree</v-icon>
              </template>
              <span>Drawing up a tree structure from items (experimental)</span>
            </v-tooltip>
            <v-switch
              v-model="settings.nested"
              label="Nested view"
              class="ma-0 pa-0"
              hide-details
            />
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header>
        Specific meta in items
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-icon left color="pink">mdi-heart</v-icon>
            <v-switch
              v-model="settings.favorite"
              label="Favorite"
              class="ma-0 pa-0"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-icon left color="yellow darken-2">mdi-star</v-icon>
            <v-switch
              v-model="settings.rating"
              label="Rating"
              class="ma-0 pa-0"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" left color="red">mdi-bookmark</v-icon>
              </template>
              <span>Text area for notes</span>
            </v-tooltip>
            <v-switch
              v-model="settings.bookmark"
              label="Bookmark"
              class="ma-0 pa-0"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" left>mdi-alphabetical-variant</v-icon>
              </template>
              <span>Multiple names for one card</span>
            </v-tooltip>
            <v-switch
              v-model="settings.synonyms"
              label="Synonyms"
              class="ma-0 pa-0"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-icon left>mdi-flag</v-icon>
            <v-switch
              v-model="settings.country"
              label="Country"
              class="ma-0 pa-0"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" left>mdi-list-status</v-icon>
              </template>
              <span
                >In order for the career status to be displayed correctly,
                <br />
                you also need to activate the "Data Scraper" option, <br />
                then click the "set up meta for scraper" button <br />
                and add the meta to the "career start" and "career end"
                fields.</span
              >
            </v-tooltip>
            <v-switch
              v-model="settings.career"
              label="Career status"
              class="ma-0 pa-0"
              hide-details
            />
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header>Appearance of items</v-expansion-panel-header>
      <v-expansion-panel-content>
        <div>Aspect ratio of images:</div>
        <v-radio-group
          v-model="settings.imageAspectRatio"
          row
          mandatory
          hide-details
          class="mt-2"
        >
          <v-radio :value="1" class="mb-4">
            <template v-slot:label>
              <span
                class="aspect-ratio-sample"
                :style="`width:${25}px;height:${25}px;`"
              >
                <v-icon small>mdi-image-filter-hdr</v-icon>
              </span>
              1:1
            </template>
          </v-radio>
          <v-radio :value="5 / 8" class="mb-4">
            <template v-slot:label>
              <span
                class="aspect-ratio-sample"
                :style="`width:${(30 * 5) / 8}px;height:${30}px;`"
              >
                <v-icon small>mdi-account</v-icon>
              </span>
              5:8
            </template>
          </v-radio>
          <v-radio :value="43 / 61" class="mb-4">
            <template v-slot:label>
              <span
                class="aspect-ratio-sample"
                :style="`width:${(30 * 43) / 61}px;height:${30}px;`"
              >
                <v-icon small>mdi-account</v-icon>
              </span>
              2:3
            </template>
          </v-radio>
          <v-radio :value="16 / 9" class="mb-4">
            <template v-slot:label>
              <span
                class="aspect-ratio-sample"
                :style="`width:${40}px;height:${(40 / 16) * 9}px;`"
              >
                <v-icon small>mdi-image-filter-hdr</v-icon>
              </span>
              16:9
            </template>
          </v-radio>
        </v-radio-group>
        <!-- TODO add image types -->

        <div class="mt-2 mb-2 d-flex justify-space-between">
          <span>Chips Appearance:</span>
          <v-chip
            :label="settings.chipLabel"
            :outlined="settings.chipOutlined"
            :color="settings.color ? getRandomColor() : ''"
            v-html="'Chip'"
          />
        </div>
        <div class="d-flex flex-wrap">
          <v-checkbox
            v-model="settings.color"
            label="Color"
            class="my-0 mr-6"
          />
          <v-checkbox
            v-model="settings.chipLabel"
            label="Label"
            class="my-0 mr-6"
          />
          <v-checkbox
            v-model="settings.chipOutlined"
            label="Outlined"
            class="my-0 mr-6"
          />
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header>Child meta in items</v-expansion-panel-header>
      <v-expansion-panel-content>
        <MetaSettingsChildMeta :meta="meta" />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>


<script>
export default {
  name: "MetaSettingsArray",
  props: {
    meta: Object,
  },
  components: {
    MetaSettingsChildMeta: () =>
      import("@/components/dialogs/meta/MetaSettingsChildMeta.vue"),
  },
  mounted() {
    this.$nextTick(() => {
      this.initSettings();
    });
  },
  data: () => ({
    settings: {
      hidden: false,
      parser: false,
      imageAspectRatio: 1,
      imageTypes: "main",
      chipLabel: false,
      chipOutlined: false,
      color: false,
      favorite: false,
      rating: false,
      synonyms: false,
      bookmark: false,
      country: false,
      career: false,
      scraper: false,
      nested: false,
      marks: false,
    },
  }),
  computed: {},
  methods: {
    initSettings() {
      const settings = this.meta.metaSetting;
      if (!settings) return;
      this.settings = { ...this.settings, ...settings };
    },
    updateSettings() {
      this.$emit("update", this.settings);
    },
    getRandomColor() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    },
  },
  watch: {
    settings: {
      handler: "updateSettings",
      deep: true,
    },
  },
};
</script>


<style lang="scss">
.aspect-ratio-sample {
  border: 1px solid;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  margin-right: 10px;
  background-color: rgba(121, 121, 121, 0.164);
}
@media (max-width: 480px) {
  .settings-meta {
    .v-expansion-panel-header {
      padding: 10px;
    }
    .v-expansion-panel-content__wrap {
      padding: 0 10px 15px;
    }
  }
}
</style>