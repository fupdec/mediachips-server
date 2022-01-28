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

    <v-card min-width="150" max-height="50vh">
      <v-list dense>
        <v-subheader>View</v-subheader>
        <v-list-item-group
          :value="view"
          @change="update($event)"
          mandatory
          color="primary"
        >
          <v-list-item v-for="(i, x) in list" :key="x" :value="i.val">
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
    page() {
      return this.$store.state.Page;
    },
    index() {
      return this.list.findIndex((i) => i.val == this.page.view);
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
  },
  methods: {
    init() {
      if (Vue.prototype.$checkCurrentPage("media")) {
        this.list.push({
          val: "2",
          icon: "view-sequential",
          text: "Timeline",
        });
      } else if (Vue.prototype.$checkCurrentPage("meta")) {
        this.list.push({
          val: "2",
          icon: "format-line-style",
          text: "Chip",
        });
      }
    },
    update(val) {
      this.$store.commit("updateStatePage", {
        key: "view",
        value: val,
      });
      this.$root.$emit("setItemsView", val);
    },
  },
};
</script>