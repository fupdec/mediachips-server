<template>
  <div>
    <v-card outlined class="px-4 pb-4 mt-4">
      <div class="overline text-center mt-2">Settings for Rating</div>

      <div class="d-flex justify-center align-center mb-2">
        <v-rating
          v-model="rating"
          :length="ratingMax > 10 ? 10 : ratingMax < 2 ? 2 : ratingMax"
          hover
          :full-icon="`mdi-${ratingIcon}`"
          :empty-icon="`mdi-${ratingIconEmpty || ratingIcon}`"
          :color="ratingColor"
          background-color="grey"
          class="meta-rating"
          clearable
          :half-increments="ratingHalf"
          :half-icon="`mdi-${ratingIconHalf || ratingIcon}`"
        />
        <span class="mx-2">{{ rating }}</span>
      </div>

      <div class="text--secondary caption mb-1">Full icon</div>
      <div class="d-flex">
        <v-icon>mdi-{{ ratingIcon }}</v-icon>
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
      <div class="text--secondary caption mt-2 mb-1">Empty icon</div>
      <div class="d-flex">
        <v-icon>mdi-{{ ratingIconEmpty }}</v-icon>
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
        v-model="ratingMax"
        type="number"
        :rules="[(v) => (v > 1 && v < 11) || 'Incorrect value']"
        label="Max value"
        class="mt-4"
        style="max-width: 200px"
        :hint="`The rating will be from 0 to ${ratingMax}`"
      />
      <div class="d-flex">
        <v-icon :color="ratingColor" large left>mdi-circle</v-icon>
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
      <v-switch v-model="ratingHalf" label="Half increment" />
      <div v-if="ratingHalf" class="text--secondary caption mb-1">
        Half icon
      </div>
      <div v-if="ratingHalf" class="d-flex">
        <v-icon>mdi-{{ ratingIconHalf }}</v-icon>
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
      :color="ratingColor"
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
    ratingIcon: "star",
    ratingIconEmpty: "star-outline",
    ratingIconHalf: "star-half-full",
    ratingHalf: false,
    ratingMax: 5,
    ratingColor: "#ffab00",
    iconType: "",
    dialogIcons: false,
    dialogPalette: false,
  }),
  computed: {},
  methods: {
    initSettings() {
      const settings = this.meta.metaSetting;
      if (!settings) return;
      this.ratingIcon = settings.ratingIcon || "star";
      this.ratingIconEmpty = settings.ratingIconEmpty || "star-outline";
      this.ratingIconHalf = settings.ratingIconHalf || "star-half-full";
      this.ratingHalf = settings.ratingHalf || false;
      this.ratingMax = settings.ratingMax || 5;
      this.ratingColor = settings.ratingColor || "ffab00";
    },
    selectIcon(type) {
      this.iconType = type;
      this.dialogIcons = true;
    },
    changeIcon(icon) {
      this.dialogIcons = false;
      this[this.iconType] = icon;
    },
    changeColor(e) {
      this.ratingColor = e;
      this.dialogPalette = false;
    },
    updateRating() {
      const rating = {
        ratingIcon: this.ratingIcon,
        ratingIconEmpty: this.ratingIconEmpty,
        ratingIconHalf: this.ratingIconHalf,
        ratingHalf: this.ratingHalf,
        ratingMax: this.ratingMax,
        ratingColor: this.ratingColor,
      };
      this.$emit("update", rating);
    },
  },
  watch: {
    ratingMax(val) {
      val = parseInt(val);
      if (val < 2 || val > 10) return;
      else if (this.rating > val) this.rating = val;
      this.updateRating();
    },
    ratingIcon() {
      this.updateRating();
    },
    ratingIconEmpty() {
      this.updateRating();
    },
    ratingIconHalf() {
      this.updateRating();
    },
    ratingHalf() {
      this.updateRating();
    },
    ratingMax() {
      this.updateRating();
    },
    ratingColor() {
      this.updateRating();
    },
  },
};
</script>