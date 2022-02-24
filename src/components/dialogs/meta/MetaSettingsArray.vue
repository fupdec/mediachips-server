<template>
  <div class="mt-6">
    <v-divider class="mb-4" />
    <div class="text--secondary mb-6">General</div>

    <v-checkbox v-model="settings.hidden">
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Hide in navbar</div>
          <div class="subtitle-2 mt-1">
            <v-icon small color="info">mdi-information</v-icon>
            Drag the icon to change order
          </div>
        </div>
      </template>
    </v-checkbox>

    <v-checkbox v-model="settings.marks" class="mt-0">
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Marks in player</div>
          <div class="subtitle-2 mt-1">
            Marks on timeline in built-in player
          </div>
        </div>
      </template>
    </v-checkbox>

    <v-checkbox v-model="settings.parser" class="mt-0">
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Parse media for data</div>
          <div class="subtitle-2 mt-1">
            Allow the application to parse the path to the media file and look
            for meta item's name in it
          </div>
        </div>
      </template>
    </v-checkbox>

    <v-checkbox v-model="settings.nested" class="mt-0">
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Nested view</div>
          <div class="subtitle-2 mt-1">
            Drawing up a tree structure from items (experimental)
          </div>
        </div>
      </template>
    </v-checkbox>

    <v-divider class="mb-4" />

    <div class="text--secondary mb-6">Specific meta in items</div>

    <v-checkbox v-model="settings.rating">
      <template v-slot:label>
        <div class="text--primary ml-2">Rating</div>
      </template>
    </v-checkbox>

    <v-checkbox v-model="settings.favorite">
      <template v-slot:label>
        <div class="text--primary ml-2">Favorite</div>
      </template>
    </v-checkbox>

    <v-checkbox v-model="settings.bookmark" class="mt-0">
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Bookmark</div>
          <div class="subtitle-2 mt-1">Text area for notes</div>
        </div>
      </template>
    </v-checkbox>

    <v-checkbox v-model="settings.country" class="mt-0">
      <template v-slot:label>
        <div class="text--primary ml-2">Country</div>
      </template>
    </v-checkbox>

    <v-checkbox v-model="settings.career" class="mt-0">
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Career status</div>
          <div class="subtitle-2 mt-1">
            In order for the career status to be displayed correctly, you also
            need to activate the "Data Scraper" option, then click the "set up
            meta for scraper" button and add the meta to the "career start" and
            "career end" fields.
          </div>
        </div>
      </template>
    </v-checkbox>

    <v-divider class="mb-4" />

    <div class="text--secondary mb-6">Appearance of items</div>

    <div class="text--primary subtitle-1">Aspect ratio of images</div>
    <v-radio-group
      v-model="settings.imageAspectRatio"
      row
      mandatory
      hide-details
      class="mt-2"
    >
      <v-radio :value="1" class="mb-4">
        <template v-slot:label>
          1:1
          <span
            class="aspect-ratio-sample"
            :style="`width:${25}px;height:${25}px;`"
          >
            <v-icon small>mdi-image-filter-hdr</v-icon>
          </span>
        </template>
      </v-radio>
      <v-radio :value="5 / 8" class="mb-4">
        <template v-slot:label>
          5:8
          <span
            class="aspect-ratio-sample"
            :style="`width:${(30 * 5) / 8}px;height:${30}px;`"
          >
            <v-icon small>mdi-account</v-icon>
          </span>
        </template>
      </v-radio>
      <v-radio :value="43 / 61" class="mb-4">
        <template v-slot:label>
          2:3
          <span
            class="aspect-ratio-sample"
            :style="`width:${(30 * 43) / 61}px;height:${30}px;`"
          >
            <v-icon small>mdi-account</v-icon>
          </span>
        </template>
      </v-radio>
      <v-radio :value="16 / 9" class="mb-4">
        <template v-slot:label>
          16:9
          <span
            class="aspect-ratio-sample"
            :style="`width:${40}px;height:${(40 / 16) * 9}px;`"
          >
            <v-icon small>mdi-image-filter-hdr</v-icon>
          </span>
        </template>
      </v-radio>
    </v-radio-group>
    <!-- TODO add image types -->

    <div class="mt-4 mb-2 d-flex justify-space-between">
      <div class="text--primary subtitle-1">Chips Appearance</div>
      <v-chip
        :label="settings.chipLabel"
        :outlined="settings.chipOutlined"
        :color="settings.color ? getRandomColor() : ''"
        v-html="'Chip'"
      />
    </div>
    <div class="d-flex flex-wrap">
      <v-checkbox v-model="settings.color" label="Color" class="my-0 mr-6" />
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

    <div class="text--primary subtitle-1 mt-2 mb-4">Child meta in items</div>
    <MetaSettingsChildMeta :meta="meta" />
  </div>
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
  margin-right: 20px;
  margin-left: 10px;
  background-color: rgba(121, 121, 121, 0.164);
}
</style>