<template>
  <v-tabs v-model="active" :key="tabs.length" optional centered class="borders">
    <draggable
      v-model="tabs"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
      class="tabs-group"
    >
      <transition-group type="transition" style="display: flex">
        <v-tab
          v-for="tab in tabs"
          @click.middle.prevent.stop="closeTab($event, tab.id)"
          @contextmenu.stop="showContextMenu($event, tab.id)"
          :key="tab.id"
          :id="tab.id"
          :to="tab.link"
          :ripple="false"
          class="tabs-group-item"
          exact
        >
          <div class="tab-name" :title="tab.name">
            <v-icon size="16">{{ `mdi-${tab.icon}` }}</v-icon>
            {{ tab.name }}
          </div>
          <v-btn
            @click="closeTab($event, tab.id)"
            :ripple="false"
            class="close-btn"
            icon
            tile
          >
            <v-icon size="14">mdi-close</v-icon>
          </v-btn>
        </v-tab>
      </transition-group>
    </draggable>
  </v-tabs>
</template>


<script>
import draggable from "vuedraggable";
import axios from "axios";
import Vue from "vue";

export default {
  name: "Tabs",
  components: {
    draggable,
  },
  data: () => ({
    active: 0,
    drag: false,
    dragOptions: {
      animation: 200,
      group: "description",
      disabled: false,
      ghostClass: "ghost",
    },
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    tabs: {
      get() {
        return this.$store.state.tabs;
      },
      set(value) {
        this.$store.commit("updateState", {
          key: "tabs",
          value: _.cloneDeep(value),
        });
      },
    },
    tabId() {
      return this.$route.query.tabId;
    },
  },
  methods: {
    async closeTab(e, id) {
      e.preventDefault();
      await axios.delete(this.apiUrl + "/api/tab/" + id);
      this.$root.$emit("getTabs");
    },
    closeTabsOnRight(tabId) {
      this.tabs.length = this.getTabIndexById(tabId) + 1;
      this.tabs = this.tabs;
      if (this.getTabIndexById(this.tabId) > -1) return;
      const link = this.tabs[this.getTabIndexById(tabId)].url;
      this.$router.push(link);
    },
    closeTabsOther(tabId) {
      this.tabs = this.tabs.filter((i) => i.id == tabId);
      const tab = this.tabs[this.getTabIndexById(tabId)];
      if (this.tabId && this.tabId !== tabId) this.changeRoute(tab);
    },
    closeTabsAll() {
      this.tabs = [];
      if (this.tabId !== "default") this.$router.push("/home");
    },
    changeRoute(tab) {
      const url = Vue.prototype.$getTabUrl(tab);
      this.$router.push(this.apiUrl + url);
    },
    getTabIndexById(tabId) {
      return this.tabs.findIndex((i) => i.id == tabId);
    },
    showContextMenu(e, tabId) {
      e.preventDefault();
      let contextMenu = [
        {
          name: `Close Tab`,
          type: "item",
          icon: "close",
          action: () => {
            this.closeTab(tabId);
          },
        },
        {
          name: `Close Tabs on the Right`,
          type: "item",
          icon: "format-horizontal-align-right",
          action: () => {
            this.closeTabsOnRight(tabId);
          },
          disabled: this.tabs.length == this.getTabIndexById(tabId) + 1,
        },
        {
          name: `Close Other Tabs`,
          type: "item",
          icon: "swap-horizontal",
          action: () => {
            this.closeTabsOther(tabId);
          },
          disabled: this.tabs.length < 2,
        },
        {
          name: `Close All Tabs`,
          type: "item",
          icon: "table-row-remove",
          action: () => {
            this.closeTabsAll();
          },
        },
      ];
      this.$store.dispatch("showContextMenu", {
        x: e.clientX,
        y: e.clientY,
        content: contextMenu,
      });
    },
  },
};
</script>


<style lang="scss" scoped>
.flip-tabs-move {
  transition: transform 0.2s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.2;
  background: #777;
}
.tabs-group-item {
  cursor: default;
}
</style>