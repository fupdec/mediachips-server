<template>
  <v-tabs v-model="active" :key="tabs.length" optional centered class="borders">
    <draggable
      v-model="tabs"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
    >
      <transition-group type="transition" class="d-flex">
        <v-tab
          v-for="(tab, x) in tabs"
          @click.middle.prevent.stop="closeTab($event, tab.id)"
          @contextmenu.stop="showContextMenu($event, tab.id, x)"
          :key="tab.id"
          :id="tab.id"
          :to="getTabUrl(tab)"
          :ripple="false"
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
    async closeTab(e, tabId) {
      e.preventDefault();
      if (this.tabId == tabId) this.$router.push("/");
      await axios.delete(this.apiUrl + "/api/tab/" + tabId);
      this.$root.$emit("getTabs");
    },
    async closeTabsOnRight(index) {
      if (index < -1) return; // tab doesn't exists
      const indexCurrent = this.tabs.findIndex((i) => i.id == this.tabId);
      if (indexCurrent > index) this.changeRoute(index);
      const closed = this.tabs.slice(index + 1);
      await this.deleteTabs(closed);
      this.$root.$emit("getTabs");
    },
    async closeTabsOther(tabId, index) {
      const closed = this.tabs.filter((i) => i.id !== tabId);
      if (this.tabId && this.tabId !== tabId) this.changeRoute(index);
      await this.deleteTabs(closed);
      this.$root.$emit("getTabs");
    },
    async closeTabsAll() {
      if (this.tabId) this.$router.push("/");
      await this.deleteTabs(this.tabs);
      this.$root.$emit("getTabs");
    },
    changeRoute(tabIndex) {
      const tab = this.tabs[tabIndex];
      const url = this.getTabUrl(tab);
      this.$router.push(url);
    },
    getTabUrl(tab) {
      return Vue.prototype.$getTabUrl(tab);
    },
    async deleteTabs(tabs) {
      for (let tab of tabs)
        await axios.delete(this.apiUrl + "/api/tab/" + tab.id);
    },
    showContextMenu(e, tabId, index) {
      e.preventDefault();
      let contextMenu = [
        {
          name: `Close Tab`,
          type: "item",
          icon: "close",
          action: () => {
            this.closeTab(e, tabId);
          },
        },
        {
          name: `Close Tabs on the Right`,
          type: "item",
          icon: "format-horizontal-align-right",
          action: () => {
            this.closeTabsOnRight(index);
          },
          disabled: this.tabs.length - 1 == index,
        },
        {
          name: `Close Other Tabs`,
          type: "item",
          icon: "swap-horizontal",
          action: () => {
            this.closeTabsOther(tabId, index);
          },
          disabled: this.tabs.length == 1,
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