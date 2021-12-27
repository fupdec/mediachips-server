<template>
  <div>
    <v-card outlined class="pa-4 mt-8">
      <div class="overline text-center">Settings for Rating</div>

      <div class="d-flex justify-center align-center mb-2">
        <v-rating
          v-model="rating"
          :length="
            settings.ratingMax > 10
              ? 10
              : settings.ratingMax < 2
              ? 2
              : settings.ratingMax
          "
          hover
          :full-icon="`mdi-${settings.ratingIcon}`"
          :empty-icon="`mdi-${settings.ratingIconEmpty || settings.ratingIcon}`"
          :color="settings.ratingColor"
          background-color="grey"
          class="meta-rating"
          clearable
          :half-increments="settings.ratingHalf"
          :half-icon="`mdi-${settings.ratingIconHalf || settings.ratingIcon}`"
        />
        <span class="mx-2">{{ rating }}</span>
      </div>

      <div class="text--secondary caption mb-1">Full icon</div>
      <div class="d-flex">
        <v-icon>mdi-{{ settings.ratingIcon }}</v-icon>
        <v-btn
          @click="selectIcon('ratingIcon')"
          small
          rounded
          outlined
          class="ml-4"
        >
          <v-icon left>mdi-shape-plus</v-icon>
          Change icon
        </v-btn>
      </div>
      <div class="text--secondary caption mt-4 mb-1">Empty icon</div>
      <div class="d-flex">
        <v-icon>mdi-{{ settings.ratingIconEmpty }}</v-icon>
        <v-btn
          @click="selectIcon('ratingIconEmpty')"
          small
          rounded
          outlined
          class="ml-4"
        >
          <v-icon left>mdi-shape-plus</v-icon>
          Change icon</v-btn
        >
      </div>
      <v-text-field
        v-model="settings.ratingMax"
        type="number"
        :rules="[(v) => (v > 1 && v < 11) || 'Incorrect value']"
        label="Max value"
        class="mt-6"
        style="max-width: 200px"
        :hint="`The rating will be from 0 to ${settings.ratingMax}`"
      />
      <div class="d-flex">
        <v-icon :color="settings.ratingColor" large left>mdi-circle</v-icon>
        <v-btn
          @click="dialogPalette = true"
          rounded
          small
          outlined
          class="my-2"
        >
          <v-icon left>mdi-palette</v-icon> change color
        </v-btn>
      </div>
      <v-switch v-model="settings.ratingHalf" label="Half increment" />
      <div v-if="settings.ratingHalf" class="text--secondary caption mb-1">
        Half icon
      </div>
      <div v-if="settings.ratingHalf" class="d-flex">
        <v-icon>mdi-{{ settings.ratingIconHalf }}</v-icon>
        <v-btn
          @click="selectIcon('ratingIconHalf')"
          small
          rounded
          outlined
          class="ml-4"
        >
          <v-icon left>mdi-shape-plus</v-icon>
          Change icon
        </v-btn>
      </div>
    </v-card>

    <DialogIcons
      v-if="dialogIcons"
      @close="dialogIcons = false"
      @apply="changeIcon($event)"
    />

    <ColorPicker
      :dialog="dialogPalette"
      :color="settings.ratingColor"
      @close="dialogPalette = false"
      @getColor="changeColor($event)"
    />
  </div>
</template>


<script>
export default {
  props: {
    meta: Object,
  },
  name: "MetaSettingsRating",
  components: {
    DialogIcons: () => import("@/components/dialogs/DialogIcons.vue"),
    ColorPicker: () => import("@/components/elements/ColorPicker.vue"),
  },
  mounted() {
    this.$nextTick(() => {
      this.initSettings();
    });
  },
  data: () => ({
    rating: 2,
    settings: {
      ratingIcon: "star",
      ratingIconEmpty: "star-outline",
      ratingIconHalf: "star-half-full",
      ratingHalf: false,
      ratingMax: 5,
      ratingColor: "#ffab00",
    },
    iconType: "",
    dialogIcons: false,
    dialogPalette: false,
  }),
  computed: {},
  methods: {
    initSettings() {
      const settings = this.meta.metaSetting;
      if (!settings) return;
      this.settings = { ...this.settings, ...settings };
    },
    selectIcon(type) {
      this.iconType = type;
      this.dialogIcons = true;
    },
    changeIcon(icon) {
      this.dialogIcons = false;
      this.settings[this.iconType] = icon;
    },
    changeColor(e) {
      this.settings.ratingColor = e;
      this.dialogPalette = false;
    },
    updateRating() {
      this.$emit("update", this.settings);
    },
  },
  watch: {
    'settings.ratingMax': function (val) {
      val = parseInt(val);
      if (val < 2 || val > 10) return;
      else if (this.rating > val) this.rating = val;
    },
    settings: {
      handler: 'updateRating',
      deep: true
    },
  },
};
</script>