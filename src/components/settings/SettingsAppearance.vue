<template>
  <div class="mx-4">
    <v-checkbox
      v-model="sets.darkMode"
      @change="setOption($event, 'darkMode')"
      false-value="0"
      true-value="1"
      class="mt-0"
    >
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Dark Mode</div>
          <div class="subtitle-2 mt-1">Come to the dark side</div>
        </div>
      </template>
    </v-checkbox>

    <v-checkbox
      v-model="sets.navigationSide"
      @change="setOption($event, 'navigationSide')"
      false-value="1"
      true-value="2"
      class="mt-0"
    >
      <template v-slot:label>
        <div class="text--primary ml-2">Navigation bar at the bottom</div>
      </template>
    </v-checkbox>

    <div class="d-flex flex-wrap align-center mt-4">
      <div class="text--primary">
        <span>Scale</span>
        <div class="subtitle-2">{{ Math.floor(sets.zoom * 100) }}%</div>
      </div>
      <v-slider
        :value="sets.zoom"
        @change="setOption($event, 'zoom')"
        @click:prepend="zoomOut"
        @click:append="zoomIn"
        prepend-icon="mdi-magnify-minus-outline"
        append-icon="mdi-magnify-plus-outline"
        style="max-width: 300px"
        class="mx-4"
        min="0.5"
        step="0.01"
        max="2"
        hide-details
      />
      <v-btn v-if="sets.zoom != '1'" @click="setOption(1, 'zoom')" small icon>
        <v-icon>mdi-restore</v-icon>
      </v-btn>
    </div>

    <v-checkbox
      v-model="sets.headerGradient"
      @change="setOption($event, 'headerGradient')"
      false-value="0"
      true-value="1"
      class="mt-6"
    >
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Gradient</div>
          <div class="subtitle-2 mt-1">
            Use multiple colors for app bar background
          </div>
        </div>
      </template>
    </v-checkbox>

    <SettingsThemeColors />

    <v-divider class="mt-8 mb-2" />
    <div class="subtitle-2 text-right mb-4">Page</div>

    <v-checkbox
      v-model="sets.showSavedFilters"
      @change="setOption($event, 'showSavedFilters')"
      false-value="0"
      true-value="1"
      class="mt-0"
    >
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Saved filters</div>
          <div class="subtitle-2 mt-1">On the item page, under the heading</div>
        </div>
      </template>
    </v-checkbox>

    <v-checkbox
      v-model="sets.showIconsOfMetaInEditingDialog"
      @change="setOption($event, 'showIconsOfMetaInEditingDialog')"
      false-value="0"
      true-value="1"
      class="mt-0"
    >
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Meta icons in the item edit dialog</div>
          <div class="d-flex align-center subtitle-2">
            <span class="mr-2">Sample</span>
            <v-text-field
              value="John"
              class="pa-0 ma-0"
              style="max-width: 150px"
              :prepend-icon="
                sets.showIconsOfMetaInEditingDialog == '1' ? `mdi-account` : ''
              "
              hide-details
              readonly
              dense
            />
          </div>
        </div>
      </template>
    </v-checkbox>

    <v-checkbox
      v-model="sets.showIconsInsteadTextOnFiltersChips"
      @change="setOption($event, 'showIconsInsteadTextOnFiltersChips')"
      false-value="0"
      true-value="1"
      class="mt-0"
    >
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Icons in filter chips</div>
          <div class="subtitle-2 mt-1">
            <span class="mr-2">Sample</span>
            <v-chip
              v-if="sets.showIconsInsteadTextOnFiltersChips == '0'"
              color="primary"
              small
            >
              "Actor" not equal "John"
            </v-chip>
            <v-chip v-else color="primary" small>
              <v-icon>mdi-account</v-icon>
              <v-icon>mdi-not-equal-variant</v-icon> "John"
            </v-chip>
          </div>
        </div>
      </template>
    </v-checkbox>

    <div class="d-flex align-center flex-wrap mb-4">
      <div class="text--primary mb-2 mr-4">Gap between items</div>
      <v-btn-toggle
        :value="sets.gapSize"
        @change="setOption($event, 'gapSize')"
        color="primary"
        class="mb-2"
        dense
        mandatory
      >
        <v-btn outlined value="xs">XS</v-btn>
        <v-btn outlined value="s">S</v-btn>
        <v-btn outlined value="m">M</v-btn>
        <v-btn outlined value="l">L</v-btn>
        <v-btn outlined value="xl">XL</v-btn>
      </v-btn-toggle>
    </div>

    <div class="d-flex align-center flex-wrap">
      <div class="text--primary mb-2 mr-4">
        Number of visible pages in pagination
      </div>
      <v-btn-toggle
        :value="sets.numberOfPagesLimit"
        @change="setOption($event, 'numberOfPagesLimit')"
        color="primary"
        class="mb-2"
        dense
        mandatory
      >
        <v-btn outlined value="5">5</v-btn>
        <v-btn outlined value="7">7</v-btn>
        <v-btn outlined value="9">9</v-btn>
        <v-btn outlined value="11">11</v-btn>
        <v-btn outlined value="13">13</v-btn>
        <v-btn outlined value="15">15</v-btn>
      </v-btn-toggle>
    </div>

    <v-divider class="mt-8 mb-2" />
    <div class="subtitle-2 text-right mb-4">Cards</div>

    <v-checkbox
      v-model="sets.ratingAndFavoriteInCard"
      @change="setOption($event, 'ratingAndFavoriteInCard')"
      false-value="0"
      true-value="1"
      class="mt-0"
    >
      <template v-slot:label>
        <div class="text--primary ml-2">Rating and favorite in description</div>
      </template>
    </v-checkbox>

    <v-checkbox
      v-model="sets.showEmptyMetaValueInCard"
      @change="setOption($event, 'showEmptyMetaValueInCard')"
      false-value="0"
      true-value="1"
      class="mt-0"
    >
      <template v-slot:label>
        <div class="text--primary ml-2">Show empty meta value</div>
      </template>
    </v-checkbox>
  </div>
</template>


<script>
import Vue from "vue";

export default {
  name: "SettingsAppearance",
  components: {
    SettingsThemeColors: () =>
      import("@/components/settings/SettingsThemeColors.vue"),
  },
  computed: {
    sets: {
      get() {
        return this.$store.state.settings;
      },
      set(value) {
        this.$store.state.settings = value;
      },
    },
  },
  methods: {
    async setOption(value, option) {
      this.sets[option] = value;
      await Vue.prototype.$setOption(option, value);
    },
    zoomOut() {
      const zoom = +this.sets.zoom - 0.01 || 0.5;
      this.setOption(zoom, "zoom");
    },
    zoomIn() {
      const zoom = +this.sets.zoom + 0.01 || 2;
      this.setOption(zoom, "zoom");
    },
  },
  watch: {
    "sets.darkMode"(val) {
      this.$vuetify.theme.dark = val == "1";
    },
  },
};
</script>