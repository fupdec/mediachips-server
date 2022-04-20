<template>
  <v-menu offset-y nudge-bottom="10">
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-btn v-on="{ ...onMenu, ...onTooltip }" icon>
            <v-icon v-if="Items.sortDir == 'asc'">mdi-sort-ascending</v-icon>
            <v-icon v-else>mdi-sort-descending</v-icon>
          </v-btn>
        </template>
        <span> Sort {{ Items.name }} by {{ text }} </span>
      </v-tooltip>
    </template>

    <v-card min-width="150" max-height="50vh">
      <v-list dense>
        <v-subheader>Sort Direction</v-subheader>
        <v-list-item @click="toggleDir">
          <v-list-item-content>
            <v-list-item-title>
              <span v-if="Items.sortDir == 'asc'">
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
                {{ i.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-menu>
</template>


<script>
import Vue from "vue";

export default {
  name: "ItemsSort",
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
        text: "Name",
      },
      {
        by: "createdAt",
        icon: "calendar-plus",
        text: "Date Added",
      },
      {
        by: "updatedAt",
        icon: "calendar-edit",
        text: "Date of Editing",
      },
      {
        by: "rating",
        icon: "star",
        text: "Rating",
      },
    ],
  }),
  computed: {
    Items() {
      return this.$store.state.Items;
    },
    index() {
      return this.list.findIndex((i) => i.by == this.Items.sortBy);
    },
    sortBy() {
      return this.list[this.index] ? this.list[this.index].by : "";
    },
    text() {
      return this.list[this.index] ? this.list[this.index].text : "";
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
          text: "Path",
        });
      }
    },
    toggleDir() {
      const val = this.Items.sortDir === "asc" ? "desc" : "asc";
      this.$store.commit("updateStateItems", {
        key: "sortDir",
        value: val,
      });
      this.$root.$emit("setItemsSortDir", val);
    },
    update(val) {
      this.$store.commit("updateStateItems", {
        key: "sortBy",
        value: val,
      });
      this.$root.$emit("setItemsSortBy", val);
    },
  },
};
</script>