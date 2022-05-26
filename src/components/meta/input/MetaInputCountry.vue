<template>
  <v-autocomplete
    @input="setVal($event)"
    :value="val"
    :items="countries"
    :filter="filterCountry"
    :rules="[rules]"
    :disabled="disabled"
    :prepend-icon="showIcons && !dialog ? 'mdi-flag' : ''"
    :hide-details="dialog ? true : false"
    append-icon="mdi-chevron-down"
    item-text="name"
    item-value="name"
    label="Country"
    ref="field"
    class="val"
    hide-selected
    multiple
    clearable
  >
    <template v-slot:selection="{ attrs, item }">
      <v-chip v-bind="attrs" @click="remove(item)" class="pl-0" label>
        <country-flag :country="item.code" size="big" class="lang-flag" />
        <span v-text="item.name" />
      </v-chip>
    </template>
    <template v-slot:item="{ item, parent }">
      <country-flag :country="item.code" size="big" class="lang-flag" />
      <span class="pl-2" v-html="parent.genFilteredText(item.name)" />
    </template>
  </v-autocomplete>
</template>


<script>
import Vue from "vue";
import CountryFlag from "vue-country-flag";
import Countries from "@/assets/Countries.js";

export default {
  name: "MetaInputCountry",
  props: {
    value: Array,
    dialog: String,
    cond: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CountryFlag,
  },
  mounted() {
    this.val = this.value;
  },
  data: () => ({
    val: [],
    search: null,
    countries: Countries,
  }),
  computed: {
    showIcons() {
      return (
        this.$store.state.settings.showIconsInsteadTextOnFiltersChips == "1"
      );
    },
  },
  methods: {
    setVal(val) {
      this.$refs.field.lazySearch = null;
      this.val = val;
      this.$emit("input", val);
    },
    remove(country) {
      console.log(country.name);
      const index = this.val.indexOf(country.name);
      if (index > -1) this.val.splice(index, 1);
    },
    filterCountry(item, queryText) {
      const country = item.name.toLowerCase();
      const code = item.code.toLowerCase();
      const query = queryText.toLowerCase();
      const foundByChars = (text, query) => {
        return Vue.prototype.$foundByChars(text, query);
      };

      if (this.$store.state.settings.typingFiltersDefault == "1")
        return country.indexOf(query) > -1 || code.indexOf(query) > -1;
      else return foundByChars(country, query) || foundByChars(code, query);
    },
    rules() {
      if (this.dialog !== "filtering") return true;
      if (this.val !== null && this.val.length > 0) return true;
      else if (this.cond === "is null" || this.cond === "null") return true;
      else return "Value is required";
    },
  },
  watch: {
    value(val) {
      this.val = val;
    },
  },
};
</script>