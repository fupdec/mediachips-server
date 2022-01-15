<template>
  <v-menu offset-y nudge-bottom="10">
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-badge
            :icon="`mdi-${icon}`"
            overlap
            offset-x="23"
            offset-y="44"
            class="badge-sort"
          >
            <v-btn v-on="{ ...onMenu, ...onTooltip }" icon tile>
              <v-icon>mdi-sort-variant</v-icon>
              <v-icon
                v-if="sets.sortDir == 'asc'"
                size="16"
                class="badge-sort-icon"
              >
                mdi-arrow-down-thin
              </v-icon>
              <v-icon v-else size="16" class="badge-sort-icon">
                mdi-arrow-up-thin
              </v-icon>
            </v-btn>
          </v-badge>
        </template>
        <span>Sort {{ page.name }}</span>
      </v-tooltip>
    </template>

    <v-list dense>
      <v-subheader>Sort Direction</v-subheader>
      <v-list-item @click="toggleDir">
        <v-list-item-content>
          <v-list-item-title>
            <span v-if="sets.sortDir == 'asc'">
              <v-icon left> mdi-sort-ascending </v-icon>
              Ascending
            </span>
            <span v-else>
              <v-icon left> mdi-sort-descending </v-icon>
              Descending
            </span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-subheader>Sort By</v-subheader>
      <v-list-item-group
        :value="sortBy"
        @change="update($event)"
        mandatory
        color="primary"
      >
        <v-list-item v-for="i in list" :key="i.by" :value="i.by">
          <v-list-item-content>
            <v-list-item-title>
              <v-icon left>mdi-{{ i.icon }}</v-icon>
              {{ i.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>


<script>
import vuescroll from "vuescroll";
import Vue from "vue";

export default {
  name: "ItemsSort",
  components: {
    vuescroll,
  },
  mounted() {
    this.$nextTick(async () => {
      this.init();
    });
  },
  data: () => ({
    list: [
      {
        by: "name",
        icon: "alphabetical-variant",
        name: "Name",
      },
      {
        by: "createdAt",
        icon: "calendar-plus",
        name: "Date Added",
      },
      {
        by: "updatedAt",
        icon: "calendar-edit",
        name: "Date of Editing",
      },
      {
        by: "rating",
        icon: "star",
        name: "Rating",
      },
    ],
  }),
  computed: {
    page() {
      return this.$store.state.page;
    },
    sets: {
      get() {
        return this.$store.state.pageSettings;
      },
      set(value) {
        return (this.$store.state.pageSettings = value);
      },
    },
    index() {
      return this.list.findIndex((i) => i.by == this.sets.sortBy);
    },
    sortBy() {
      return this.list[this.index] ? this.list[this.index].by : "";
    },
    icon() {
      return this.list[this.index] ? this.list[this.index].icon : "shape";
    },
    isMediaPage() {
      return Vue.prototype.$checkCurrentPage("media");
    },
  },
  methods: {
    init() {
      if (this.isMediaPage) {
        this.list.shift();
        this.list.unshift({
          by: "path",
          icon: "alphabetical-variant",
          name: "Path",
        });
      }
    },
    toggleDir() {
      this.sets.sortDir = this.sets.sortDir === "asc" ? "desc" : "asc";
      this.$root.$emit("setItemsSortDir", this.sets.sortDir)
    },
    update(val) {
      this.sets.sortBy = val;
      this.$root.$emit("setItemsSortBy", val)
    },
  },
};
</script>