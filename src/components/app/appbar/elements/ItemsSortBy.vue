<template>
  <v-menu offset-y nudge-bottom="10" :close-on-content-click="false">
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-btn v-on="{ ...onMenu, ...onTooltip }" icon tile>
            <v-icon>mdi-{{ icon }}</v-icon>
          </v-btn>
        </template>
        <span>Sort Items By</span>
      </v-tooltip>
    </template>

    <v-list dense>
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
  name: "ItemsSortBy",
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
      return this.list[this.index] ? this.list[this.index].by : '';
    },
    icon() {
      return this.list[this.index] ? this.list[this.index].icon : 'shape';
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
    update(val) {
      this.sets.sortBy = val;
    },
  },
};
</script>