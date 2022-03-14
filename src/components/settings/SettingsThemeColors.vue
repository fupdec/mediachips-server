<template>
  <div>
    <v-divider class="mt-4 mb-2" />
    <div class="subtitle-2 text-right mb-4">Colors</div>

    <div class="d-flex flex-wrap align-center mb-4">
      <div class="mr-4 mb-2">Light theme</div>

      <v-btn
        v-if="sets.headerGradient == '1'"
        @click="openDialogHeaderGradientLight"
        :style="{ background: this.sets.headerGradientLight }"
        class="mr-2 mb-2"
        light
        rounded
        depressed
      >
        <v-icon left>mdi-palette</v-icon> Toolbar
      </v-btn>

      <v-btn
        v-else
        @click="openDialogPalette('appColorLightHeader')"
        :color="appColorLightHeader"
        class="mr-2 mb-2"
        light
        rounded
        depressed
      >
        <v-icon left>mdi-palette</v-icon> Toolbar
      </v-btn>

      <v-btn
        @click="openDialogPalette('appColorLightPrimary')"
        :color="appColorLightPrimary"
        class="mr-2 mb-2"
        light
        rounded
        depressed
      >
        <v-icon left>mdi-palette</v-icon> Primary
      </v-btn>

      <v-btn
        @click="openDialogPalette('appColorLightSecondary')"
        :color="appColorLightSecondary"
        class="mr-2 mb-2"
        light
        rounded
        depressed
      >
        <v-icon left>mdi-palette</v-icon> Secondary
      </v-btn>

      <v-btn
        @click="openDialogPalette('appColorLightAccent')"
        :color="appColorLightAccent"
        class="mr-2 mb-2"
        light
        rounded
        depressed
      >
        <v-icon left>mdi-palette</v-icon> Accent
      </v-btn>
    </div>

    <div class="d-flex flex-wrap align-center">
      <div class="mb-2 mr-4">Dark theme</div>

      <v-btn
        v-if="sets.headerGradient == '1'"
        @click="openDialogHeaderGradientDark"
        :style="{ background: this.sets.headerGradientDark }"
        class="mr-2 mb-2"
        dark
        rounded
        depressed
      >
        <v-icon left>mdi-palette</v-icon> Toolbar
      </v-btn>

      <v-btn
        v-else
        @click="openDialogPalette('appColorDarkHeader')"
        :color="appColorDarkHeader"
        class="mr-2 mb-2"
        dark
        depressed
        rounded
      >
        <v-icon left>mdi-palette</v-icon> Toolbar
      </v-btn>

      <v-btn
        @click="openDialogPalette('appColorDarkPrimary')"
        :color="appColorDarkPrimary"
        class="mr-2 mb-2"
        dark
        rounded
        depressed
      >
        <v-icon left>mdi-palette</v-icon> Primary
      </v-btn>

      <v-btn
        @click="openDialogPalette('appColorDarkSecondary')"
        :color="appColorDarkSecondary"
        class="mr-2 mb-2"
        dark
        rounded
        depressed
      >
        <v-icon left>mdi-palette</v-icon> Secondary
      </v-btn>

      <v-btn
        @click="openDialogPalette('appColorDarkAccent')"
        :color="appColorDarkAccent"
        class="mr-2 mb-2"
        dark
        rounded
        depressed
      >
        <v-icon left>mdi-palette</v-icon> Accent
      </v-btn>
    </div>

    <v-dialog v-model="dialogPalette" width="300">
      <v-card>
        <v-toolbar>
          <v-btn @click="applyColor" color="success" block depressed>
            <v-icon left>mdi-check</v-icon> Apply
          </v-btn>
        </v-toolbar>
        <v-color-picker @update:color="changeColor($event)" :value="palette" />
      </v-card>
    </v-dialog>

    <SettingsHeaderGradient
      v-if="dialogHeaderGradient"
      :themeDark="gradientThemeDark"
      @close="dialogHeaderGradient = false"
      @save="saveHeaderGradient($event)"
    />
  </div>
</template>


<script>
import Vue from "vue";

export default {
  name: "SettingsThemeColors",
  components: {
    SettingsHeaderGradient: () =>
      import("@/components/settings/SettingsHeaderGradient.vue"),
  },
  data: () => ({
    dialogHeaderGradient: false,
    dialogPalette: false,
    gradientThemeDark: null,
    palette: "#777777",
    colorType: null,
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
    appColorLightPrimary: {
      get() {
        return this.sets.appColorLightPrimary;
      },
      set(color) {
        this.$vuetify.theme.themes.light.primary = color;
        this.setOption(color, "appColorLightPrimary");
      },
    },
    appColorLightSecondary: {
      get() {
        return this.sets.appColorLightSecondary;
      },
      set(color) {
        this.$vuetify.theme.themes.light.secondary = color;
        this.setOption(color, "appColorLightSecondary");
      },
    },
    appColorLightAccent: {
      get() {
        return this.sets.appColorLightAccent;
      },
      set(color) {
        this.$vuetify.theme.themes.light.accent = color;
        this.setOption(color, "appColorLightAccent");
      },
    },
    appColorLightHeader: {
      get() {
        return this.sets.appColorLightHeader;
      },
      set(color) {
        this.setOption(color, "appColorLightHeader");
      },
    },
    appColorDarkPrimary: {
      get() {
        return this.sets.appColorDarkPrimary;
      },
      set(color) {
        this.$vuetify.theme.themes.dark.primary = color;
        this.setOption(color, "appColorDarkPrimary");
      },
    },
    appColorDarkSecondary: {
      get() {
        return this.sets.appColorDarkSecondary;
      },
      set(color) {
        this.$vuetify.theme.themes.dark.secondary = color;
        this.setOption(color, "appColorDarkSecondary");
      },
    },
    appColorDarkAccent: {
      get() {
        return this.sets.appColorDarkAccent;
      },
      set(color) {
        this.$vuetify.theme.themes.dark.accent = color;
        this.setOption(color, "appColorDarkAccent");
      },
    },
    appColorDarkHeader: {
      get() {
        return this.sets.appColorDarkHeader;
      },
      set(color) {
        this.setOption(color, "appColorDarkHeader");
      },
    },
    colorScroll: {
      get() {
        return this.sets.colorScroll == "1";
      },
      set(value) {
        this.setOption(value, "colorScroll");
      },
    },
  },
  methods: {
    async setOption(value, option) {
      this.sets[option] = value;
      await Vue.prototype.$setOption(option, value);
    },
    openDialogPalette(colorType) {
      this.dialogPalette = true;
      this.colorType = colorType;
      this.palette = this[colorType];
    },
    changeColor(e) {
      this.palette = e.hex;
    },
    applyColor() {
      this[this.colorType] = this.palette;
      this.dialogPalette = false;
    },
    openDialogHeaderGradientLight() {
      this.gradientThemeDark = false;
      this.dialogHeaderGradient = true;
    },
    openDialogHeaderGradientDark() {
      this.gradientThemeDark = true;
      this.dialogHeaderGradient = true;
    },
    saveHeaderGradient(values) {
      let option = "headerGradient" + (values.themeDark ? "Dark" : "Light");
      this.setOption(values.gradient, option);
    },
  },
};
</script>