<template>
  <div class="d-flex flex-wrap justify-center">
    <v-tooltip v-if="!isTooltip" top>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          @click="removeAll"
          color="error"
          class="mr-4"
          depressed
          x-small
          dark
          fab
        >
          <v-icon>mdi-filter-off</v-icon>
        </v-btn>
      </template>
      <span>Remove All Filters</span>
    </v-tooltip>

    <v-chip
      v-for="(i, x) in filters"
      :key="x"
      @click="remove(x)"
      :disabled="i.lock && !isTooltip"
      :color="isTooltip ? '#fff' : 'primary'"
      :outlined="isTooltip"
      :class="[{ readonly: isTooltip }]"
      :title="isTooltip ? '' : 'Remove filter'"
      class="ma-1 px-2"
      small
      dark
    >
      <span v-if="showIcons">
        <v-icon small class="mr-1"> mdi-{{ getByIcon(i.by) }} </v-icon>
        <v-icon small>mdi-{{ getCondIcon(i.type, i.cond) }}</v-icon>
      </span>
      <span v-else>
        <span class="mr-1"> "{{ getByText(i.by) }}" </span>
        <span> {{ getCondText(i.type, i.cond) }} </span>
      </span>

      <span v-if="i.type == 'array'" class="ml-1">
        "{{ getItemName(i.by, i.val) }}"
      </span>
      <span v-else-if="i.type == 'boolean'"></span>
      <span v-else class="ml-1">"{{ i.val }}"</span>
      <!-- TODO remove empty quotes and create function for getting values -->
    </v-chip>
  </div>
</template>


<script>
import Vue from "vue";

export default {
  name: "FiltersChips",
  props: {
    filters: Array,
  },
  data: () => ({
    isTooltip: false,
  }),
  computed: {
    filtersState() {
      return this.type.toLowerCase() + "Filters";
    },
    showIcons() {
      return (
        this.$store.state.settings.showIconsInsteadTextOnFiltersChips == "1"
      );
    },
    meta() {
      return this.$store.state.meta;
    },
    items() {
      return this.$store.state.items;
    },
  },
  methods: {
    removeAll() {
      this.$root.$emit("removeAllFilters");
    },
    remove(index) {
      this.$root.$emit("removeFilter", index);
    },
    getByIcon(metaId) {
      const meta = this.meta.find((i) => i.id == metaId);
      if (meta) return meta.icon;
      return "shape";
    },
    getByText(metaId) {
      const meta = this.meta.find((i) => i.id == metaId);
      if (meta) return meta.name;
      return "";
    },
    getCondIcon(type, cond) {
      const conds = Vue.prototype.$getListCond(type);
      const x = conds.findIndex((i) => i.cond == cond);
      if (x > -1) return conds[x].icon;
      return "shape";
    },
    getCondText(type, cond) {
      const conds = Vue.prototype.$getListCond(type);
      const x = conds.findIndex((i) => i.cond == cond);
      if (x > -1) return conds[x].text;
      return "";
    },
    getItemName(metaId, val) {
      const items = this.items.filter((i) => i.metaId == metaId);
      return val
        .map((id) => {
          let item = _.find(items, { id });
          if (item) return item.name;
          else return "";
        })
        .join(", ");
    },
  },
};
</script>


<style lang="scss">
.readonly {
  pointer-events: none;
}
</style>