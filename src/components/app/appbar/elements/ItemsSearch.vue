<template>
  <v-menu offset-y nudge-bottom="10" :close-on-content-click="false">
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-badge
            :value="content"
            :content="content"
            overlap
            offset-x="23"
            offset-y="44"
          >
            <v-btn v-on="{ ...onMenu, ...onTooltip }" icon tile>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-badge>
        </template>
        <span>Quick Search</span>
      </v-tooltip>
    </template>
    <v-card width="350">
      <div class="pa-2 d-flex">
        <v-text-field
          :value="searchString"
          @input="update($event)"
          autofocus
          @click:clear="clear"
          @keypress.enter="search"
          outlined
          dense
          hide-details
          clearable
          class="pt-0"
        />
        <v-btn
          @click="search"
          class="ml-2"
          color="primary"
          depressed
          height="40"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div>
    </v-card>
  </v-menu>
</template>


<script>
import Vue from "vue";

export default {
  name: "ItemsSearch",
  data: () => ({
    searchString: "",
  }),
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    content() {
      if (this.index > -1 && this.searchString !== null)
        return this.searchString.substring(0, 2);
      else return "";
    },
    by() {
      return Vue.prototype.$checkCurrentPage("media") ? "path" : "name";
    },
    filters() {
      return this.$store.state.filters;
    },
    index() {
      return this.filters.findIndex((i) => i.by == this.by && i.appbar == true);
    },
  },
  methods: {
    init() {
      if (this.index > -1) this.searchString = this.filters[this.index].val;
      else this.searchString = "";
    },
    clear() {
      if (this.index > -1) this.$root.$emit("clearSearch", this.index);
    },
    search() {
      const values = {
        index: this.index,
        by: this.by,
        string: this.searchString,
      };
      this.$root.$emit("runSearch", values);
    },
    update(val) {
      this.searchString = val;
    },
  },
  watch: {
    filters() {
      this.init();
    },
  },
};
</script>