<template>
  <v-menu
    offset-y
    nudge-bottom="10"
    content-class="search-menu"
    :close-on-content-click="false"
  >
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-badge
            :value="content"
            :content="content"
            offset-x="44"
            offset-y="23"
          >
            <v-btn v-on="{ ...onMenu, ...onTooltip }" icon>
              <v-icon>mdi-text-search</v-icon>
            </v-btn>
          </v-badge>
        </template>
        <span>Quick Search by {{ by }}</span>
      </v-tooltip>
    </template>

    <v-sheet>
      <v-text-field
        :value="searchString"
        @input="update($event)"
        @click:clear="clear"
        @click:append="search"
        @keypress.enter="search"
        append-icon="mdi-magnify"
        outlined
        rounded
        dense
        autofocus
        hide-details
        clearable
        class="pt-0"
      />
    </v-sheet>
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
      return Vue.prototype.$checkCurrentPage("meta") ? "name" : "path";
    },
    filters() {
      return this.$store.state.Page.filters;
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
      if (this.index > -1) this.$root.$emit("removeFilter", this.index);
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


<style lang="scss">
.search-menu {
  border-radius: 50px;
  .v-input__slot {
    padding: 0 14px !important;
  }
}
</style>