<template>
  <v-menu offset-y nudge-bottom="10">
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-btn v-on="{ ...onMenu, ...onTooltip }" icon>
            <v-icon>mdi-view-grid-outline</v-icon>
          </v-btn>
        </template>
        <span> View: {{ text }} </span>
      </v-tooltip>
    </template>

    <v-list dense>
      <v-subheader>View</v-subheader>
      <v-list-item-group
        :value="view"
        @change="update($event)"
        mandatory
        color="primary"
      >
        <v-list-item v-for="i in list" :key="i.val" :value="i.val">
          <v-list-item-content>
            <v-list-item-title>
              <v-icon left>mdi-{{ i.icon }}</v-icon>
              {{ i.text }}
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
  name: "ItemsView",
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
        val: "1",
        icon: "view-module",
        text: "Card",
      },
    ],
  }),
  computed: {
    pageSets: {
      get() {
        return this.$store.state.pageSettings;
      },
      set(value) {
        this.$store.commit("updateState", {
          key: "pageSettings",
          value: _.cloneDeep(value),
        });
      },
    },
    appSets: {
      get() {
        return this.$store.state.settings;
      },
      set(value) {
        this.$store.commit("updateState", {
          key: "settings",
          value: _.cloneDeep(value),
        });
      },
    },
    index() {
      return this.list.findIndex((i) => i.val == this.pageSets.view);
    },
    view() {
      return this.list[this.index] ? this.list[this.index].val : "";
    },
    icon() {
      return this.list[this.index] ? this.list[this.index].icon : "shape";
    },
    text() {
      return this.list[this.index] ? this.list[this.index].text : "";
    },
    isMediaPage() {
      return Vue.prototype.$checkCurrentPage("media");
    },
  },
  methods: {
    init() {
      if (this.isMediaPage) {
        this.list.push({
          val: "2",
          icon: "view-sequential",
          text: "Timeline",
        });
      }
    },
    update(val) {
      this.pageSets.view = val;
      this.$root.$emit("setItemsView", val);
    },
  },
};
</script>