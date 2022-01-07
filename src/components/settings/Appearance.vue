<template>
  <v-card outlined class="mt-10 pa-4">
    <div class="headline text-center pb-4">App</div>

    <div class="pt-7 d-flex">
      <span class="mr-6">Navigation bar:</span>
      <v-radio-group
        :value="sets.navigationSide"
        @change="setOption($event, 'navigationSide')"
        mandatory
        row
        hide-details
        class="mt-0 pt-0"
      >
        <v-radio label="Side" value="1"></v-radio>
        <v-radio label="Bottom" value="2"></v-radio>
      </v-radio-group>
    </div>

    <div class="pt-7 d-flex align-center flex-wrap">
      <span class="mr-6">Zoom: {{ Math.floor(sets.zoom * 100) }}%</span>
      <v-slider
        :value="sets.zoom"
        @change="setOption($event, 'zoom')"
        min="0.5"
        step="0.01"
        max="2"
        hide-details
        prepend-icon="mdi-magnify-minus-outline"
        append-icon="mdi-magnify-plus-outline"
        @click:prepend="zoomOut"
        @click:append="zoomIn"
      />
      <v-btn
        @click="setOption(1, 'zoom')"
        color="secondary"
        rounded
        class="ml-10"
      >
        <v-icon left size="18">mdi-restore</v-icon> Reset to Default Zoom
      </v-btn>
    </div>

    <div class="headline text-center py-8">Page</div>

    <div class="d-flex">
      <span class="mr-6">Position of header image on meta card page:</span>
      <v-radio-group
        :value="sets.showHeaderImageAboveProfile"
        @change="setOption($event, 'showHeaderImageAboveProfile')"
        mandatory
        row
        hide-details
        class="mt-0 pt-0"
      >
        <v-radio label="Behind" value="0"></v-radio>
        <v-radio label="Above" value="1"></v-radio>
      </v-radio-group>
    </div>

    <div class="pt-7 d-flex">
      <span class="mr-6">Saved filters under header:</span>
      <v-radio-group
        :value="sets.showSavedFilters"
        @change="setOption($event, 'showSavedFilters')"
        mandatory
        row
        hide-details
        class="mt-0 pt-0"
      >
        <v-radio label="Hide" value="0"></v-radio>
        <v-radio label="Show" value="1"></v-radio>
      </v-radio-group>
    </div>

    <div class="pt-7 d-flex flex-wrap">
      <span class="mr-6">Icons of meta in editing dialog:</span>
      <v-radio-group
        :value="sets.showIconsOfMetaInEditingDialog"
        @change="setOption($event, 'showIconsOfMetaInEditingDialog')"
        mandatory
        row
        hide-details
        class="mt-0 pt-0"
      >
        <v-radio label="Hide" value="0"></v-radio>
        <v-radio label="Show" value="1"></v-radio>
      </v-radio-group>
      <v-spacer></v-spacer>
      <v-text-field
        value="Sample"
        dense
        class="pa-0 ma-0"
        readonly
        hide-details
        style="max-width:200px"
        :prepend-inner-icon="
          sets.showIconsOfMetaInEditingDialog == '1' ? `mdi-account` : ''
        "
      />
    </div>

    <div class="pt-7 d-flex flex-wrap">
      <span class="mr-6">Icons instead of text on filter chips:</span>
      <v-radio-group
        :value="sets.showIconsInsteadTextOnFiltersChips"
        @change="setOption($event, 'showIconsInsteadTextOnFiltersChips')"
        mandatory
        row
        hide-details
        class="mt-0 pt-0"
      >
        <v-radio label="Hide" value="0"></v-radio>
        <v-radio label="Show" value="1"></v-radio>
      </v-radio-group>
      <v-spacer></v-spacer>
      <div>
        <v-icon left>mdi-filter</v-icon>
        <v-chip
          v-if="sets.showIconsInsteadTextOnFiltersChips == '0'"
          small
          color="primary"
        >
          "Name" not equal "Sample"
        </v-chip>
        <v-chip v-else small color="primary">
          <v-icon>mdi-alphabetical-variant</v-icon>
          <v-icon>mdi-not-equal-variant</v-icon> "Sample"
        </v-chip>
      </div>
    </div>

    <div class="pt-6">
      <span class="mr-6">Gap in Card Grid:</span>
      <v-btn-toggle
        :value="sets.gapSize"
        @change="setOption($event, 'gapSize')"
        dense
        mandatory
        color="primary"
      >
        <v-btn outlined value="xs">xs</v-btn>
        <v-btn outlined value="s">s</v-btn>
        <v-btn outlined value="m">m</v-btn>
        <v-btn outlined value="l">l</v-btn>
        <v-btn outlined value="xl">xl</v-btn>
      </v-btn-toggle>
    </div>

    <div class="headline text-center py-8">Cards</div>

    <div class="d-flex">
      <span class="mr-6">
        Position of icons
        <v-icon color="yellow darken-2">mdi-star</v-icon> rating and
        <v-icon color="pink">mdi-heart</v-icon> favorite:
      </span>
      <v-radio-group
        :value="sets.ratingAndFavoriteInCard"
        @change="setOption($event, 'ratingAndFavoriteInCard')"
        mandatory
        row
        hide-details
        class="mt-0 pt-0"
      >
        <v-radio label="Above image" value="0"></v-radio>
        <v-radio label="In description" value="1"></v-radio>
      </v-radio-group>
    </div>

    <div class="pt-7 d-flex">
      <span class="mr-6">Empty meta value in card:</span>
      <v-radio-group
        :value="sets.showEmptyMetaValueInCard"
        @change="setOption($event, 'showEmptyMetaValueInCard')"
        mandatory
        row
        hide-details
        class="mt-0 pt-0"
      >
        <v-radio label="Hide" value="0"></v-radio>
        <v-radio label="Show" value="1"></v-radio>
      </v-radio-group>
    </div>
  </v-card>
</template>


<script>
import Vue from "vue";

export default {
  name: "Appearance",
  mounted() {
    this.$nextTick(async () => {});
  },
  data: () => ({
    darkMode: false,
  }),
  computed: {
    sets: {
      get() {
        return this.$store.state.settings;
      },
      set(value) {
        return (this.$store.state.settings = value);
      },
    },
  },
  methods: {
    async setOption(value, option) {
      this.sets[option] = value;
      await Vue.prototype.$setOption(option, value);
    },
    zoomOut() {
      const zoom = this.sets.zoom - 0.01 || 0.5;
      this.setOption(zoom, "zoom");
    },
    zoomIn() {
      const zoom = this.sets.zoom + 0.01 || 2;
      this.setOption(zoom, "zoom");
    },
  },
};
</script>