<template>
  <div class="mx-4">
    <v-select
      :value="sets.locale"
      @change="setLang($event)"
      :items="locales"
      :menu-props="{ offsetY: true }"
      item-text="name"
      item-value="value"
      label="Language"
      rounded
      outlined
    >
      <template v-slot:selection="data">
        <country-flag :country="data.item.flag" size="big" class="lang-flag" />
        <span class="pl-2">{{ data.item.name }}</span>
      </template>
      <template v-slot:item="data">
        <country-flag :country="data.item.flag" size="big" class="lang-flag" />
        <span class="pl-2">{{ data.item.name }}</span>
      </template>
    </v-select>

    <v-checkbox
      v-model="sets.typingFiltersDefault"
      @change="setOption($event, 'typingFiltersDefault')"
      false-value="0"
      true-value="1"
      class="mt-0"
    >
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Use exact filtering when typing</div>
          <div class="subtitle-2 filtering-sample mt-1">
            <span v-if="sets.typingFiltersDefault == '1'">
              Typing: <b>favo</b> / Result: <b>favo</b>rite video
            </span>
            <span v-else>
              Typing: <b>fade</b> / Result: <b>fa</b>vorite vi<b>de</b>o
            </span>
          </div>
        </div>
      </template>
    </v-checkbox>

    <v-checkbox
      v-model="sets.showExperimentalFeatures"
      @change="setOption($event, 'showExperimentalFeatures')"
      false-value="0"
      true-value="1"
      class="mt-0"
    >
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Experimental features</div>
          <div class="subtitle-2 mt-1">
            Features that do not work or are in the early stages of development
          </div>
        </div>
      </template>
    </v-checkbox>

    <v-checkbox
      v-model="sets.countNumberOfViews"
      @change="setOption($event, 'countNumberOfViews')"
      false-value="0"
      true-value="1"
      class="mt-0"
    >
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Count number of views</div>
          <div class="subtitle-2 mt-1">
            Views are added when media or item is opened
          </div>
        </div>
      </template>
    </v-checkbox>
  </div>
</template>


<script>
import Vue from "vue";
import CountryFlag from "vue-country-flag";

export default {
  name: "SettingsGeneral",
  components: {
    CountryFlag,
  },
  data: () => ({
    locales: [
      {
        value: "cn",
        flag: "cn",
        name: "漢語",
      },
      {
        value: "en",
        flag: "gb",
        name: "English",
      },
      {
        value: "es",
        flag: "es",
        name: "Español",
      },
      {
        value: "ru",
        flag: "ru",
        name: "Русский",
      },
    ],
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
    async setLang(locale) {
      this.$root.$i18n.locale = locale;
      await this.setOption(locale, "locale");
    },
  },
};
</script>


<style lang="scss" scoped>
.filtering-sample {
  b {
    color: var(--v-primary-base);
  }
}
</style>