<template>
  <div>
    <v-card outlined class="mt-6 pa-4 mx-2">
      <div class="headline text-center pb-6">App</div>

      <div class="d-flex">
        <span class="mr-4">Navigation bar</span>
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

      <div class="pt-4 d-flex align-center flex-wrap">
        <span class="mr-4">Zoom {{ Math.floor(sets.zoom * 100) }}%</span>
        <v-slider
          :value="sets.zoom"
          @change="setOption($event, 'zoom')"
          @click:prepend="zoomOut"
          @click:append="zoomIn"
          min="0.5"
          step="0.01"
          max="2"
          hide-details
          prepend-icon="mdi-magnify-minus-outline"
          append-icon="mdi-magnify-plus-outline"
          style="max-width: 300px"
        />
        <v-btn @click="setOption(1, 'zoom')" class="ma-2" outlined rounded>
          <v-icon left size="18">mdi-restore</v-icon> Reset
        </v-btn>
      </div>
    </v-card>

    <v-card outlined class="mt-6 pa-4 mx-2">
      <div class="headline text-center pb-6">Page</div>

      <div class="d-flex">
        <span class="mr-6">Position of header image on meta item's page</span>
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
        <span class="mr-6">Saved filters under header</span>
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

      <div class="pt-7 d-flex flex-wrap align-center">
        <span class="mr-6">Icons of meta in editing dialog</span>
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
          class="pa-0 ma-2 ma-sm-0"
          readonly
          hide-details
          style="max-width: 200px"
          :prepend-inner-icon="
            sets.showIconsOfMetaInEditingDialog == '1' ? `mdi-account` : ''
          "
        />
      </div>

      <div class="pt-7 d-flex flex-wrap">
        <span class="mr-6">Icons instead of text on filter chips</span>
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
        <div class="ma-2 ma-sm-0">
          <v-btn color="error" class="mr-4" fab x-small depressed>
            <v-icon>mdi-filter-off</v-icon>
          </v-btn>
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
        <span class="mr-6">Gap in Card Grid</span>
        <v-btn-toggle
          :value="sets.gapSize"
          @change="setOption($event, 'gapSize')"
          color="primary"
          class="ma-2 ma-sm-0"
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

      <div class="pt-6">
        <span class="mr-6">Number of visible pages in pagination</span>
        <v-btn-toggle
          :value="sets.numberOfPagesLimit"
          @change="setOption($event, 'numberOfPagesLimit')"
          color="primary"
          class="ma-2 ma-sm-0"
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
    </v-card>

    <v-card outlined class="mt-6 pa-4 mx-2">
      <div class="headline text-center pb-6">Cards</div>

      <div class="d-flex">
        <span class="mr-6">
          Position of icons
          <v-icon color="yellow darken-2">mdi-star</v-icon> rating and
          <v-icon color="pink">mdi-heart</v-icon> favorite
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
        <span class="mr-6">Empty meta value in card</span>
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
  </div>
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
};
</script>