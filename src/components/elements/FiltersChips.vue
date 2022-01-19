<template>
  <div class="d-flex flex-wrap justify-center">
    <v-tooltip v-if="!isTooltip" top>
      <template v-slot:activator="{ on }">
        <v-btn
          @click="removeAll"
          v-on="on"
          fab
          x-small
          depressed
          dark
          color="error"
          class="mr-4"
        >
          <v-icon>mdi-filter-off</v-icon>
        </v-btn>
      </template>
      <span>Remove All Filters</span>
    </v-tooltip>

    <v-chip
      v-for="(filter, i) in filters"
      :key="i"
      @click="remove(i)"
      :disabled="filter.lock && !isTooltip"
      class="ma-1 px-2"
      small
      :color="isTooltip ? '#fff' : 'primary'"
      :outlined="isTooltip"
      :class="[{ readonly: isTooltip }]"
      :title="isTooltip ? '' : 'Remove filter'"
      dark
    >
      <span v-if="!showIcons">
        <v-icon small class="mr-1">
          <!-- mdi-{{ getMeta(filter.by).settings.icon }} -->
        </v-icon>
        <v-icon small>mdi-{{ getCondIcon(filter.type, filter.cond) }}</v-icon>
      </span>
      <span v-else>
        <span class="mr-1"> "{{ filter.by }}" </span>
        <span> {{ getCondText(filter.type, filter.cond) }} </span>
      </span>
      <span v-if="filter.type == 'array'" class="ml-1">
        "{{ filter.val }}"
      </span>
      <span v-else-if="filter.type == 'boolean'"></span>
      <span v-else class="ml-1">"{{ filter.val }}"</span>
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
      return this.$store.state.settings.showIconsInsteadTextOnFiltersChips;
    },
  },
  methods: {
    removeAll() {
      this.$root.$emit("removeAllFilters");
    },
    remove(index) {
      this.$root.$emit("removeFilter", index);
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
    getMetaItems(metaId, val) {
      let meta = this.getMeta(metaId);
      if (meta.type == "specific") {
        if (metaId == "country")
          return val.map((name) => _.find(Countries, { name }).name).join(", ");
      } else if (meta.type == "simple")
        return val
          .map((id) => {
            let item = _.find(meta.settings.items, { id });
            if (item) return item.name;
          })
          .join(", ");
      else if (meta.type == "complex")
        return val
          .map((id) => {
            let item = _.find(this.getCards(metaId), { id });
            if (item) return item.meta.name;
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