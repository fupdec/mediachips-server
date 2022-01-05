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
    <v-card class="d-flex">
      <vuescroll>
        <v-card-text class="pa-0">
          <v-btn-toggle
            :value="sets.sortBy"
            @change="update($event)"
            mandatory
            class="group-buttons-sort"
            color="primary"
          >
            <v-tooltip v-for="(s, i) in sort" :key="i" bottom>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" :value="s.name" outlined>
                  <v-icon>mdi-{{ s.icon }}</v-icon>
                </v-btn>
              </template>
              <span>Sort by {{ s.tip }}</span>
            </v-tooltip>
          </v-btn-toggle>
        </v-card-text>
      </vuescroll>
    </v-card>
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
    sort: [
      {
        name: "name",
        icon: "alphabetical-variant",
        tip: "Name",
      },
      {
        name: "createdAt",
        icon: "calendar-plus",
        tip: "Date Added",
      },
      {
        name: "updatedAt",
        icon: "calendar-edit",
        tip: "Date of Editing",
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
    icon() {
      const index = this.sort.findIndex((i) => i.name == this.sets.sortBy);
      return index > -1 ? this.sort[index].icon : "shape";
    },
    isMediaPage() {
      return Vue.prototype.$checkCurrentPage("media");
    },
  },
  methods: {
    init() {
      if (this.isMediaPage) {
        this.sort.shift();
        this.sort.unshift({
          name: "path",
          icon: "alphabetical-variant",
          tip: "Path",
        });
      }
    },
    update(val) {
      this.sets.sortBy = val;
    },
  },
};
</script>