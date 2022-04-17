<template>
  <v-menu offset-y nudge-bottom="10" :close-on-content-click="false">
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-btn v-on="{ ...onMenu, ...onTooltip }" icon>
            <v-icon>mdi-tune</v-icon>
          </v-btn>
        </template>
        <span> Item Settings </span>
      </v-tooltip>
    </template>

    <v-card min-width="150" max-height="50vh">
      <v-list dense>
        <v-subheader>Items Per Page</v-subheader>
        <v-btn-toggle
          :value="page.limit"
          @change="updateLimit($event)"
          color="primary"
          mandatory
          dense
          group
        >
          <v-btn class="ma-0" :value="25">25</v-btn>
          <v-btn class="ma-0" :value="50">50</v-btn>
          <v-btn class="ma-0" :value="75">75</v-btn>
          <v-btn class="ma-0" :value="99">99</v-btn>
          <v-btn class="ma-0" :value="101">∞</v-btn>
        </v-btn-toggle>

        <v-subheader>Item Size</v-subheader>
        <v-btn-toggle
          :value="page.size"
          @change="updateSize($event)"
          color="primary"
          mandatory
          dense
          group
        >
          <v-btn class="ma-0" :value="1">XS</v-btn>
          <v-btn class="ma-0" :value="2">S</v-btn>
          <v-btn class="ma-0" :value="3">M</v-btn>
          <v-btn class="ma-0" :value="4">L</v-btn>
          <v-btn class="ma-0" :value="5">XL</v-btn>
        </v-btn-toggle>

        <v-subheader>View</v-subheader>
        <ItemsView />

        <v-subheader v-if="page.assigned.length">Meta</v-subheader>
        <v-list-item
          v-for="(i, x) in page.assigned"
          :key="x"
          @click="toggle(i)"
          link
        >
          <v-list-item-content>
            <v-list-item-title>
              <v-icon left>mdi-{{ i.meta.icon }}</v-icon>
              {{ i.meta.name }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon v-if="i.show"> mdi-check </v-icon>
            <v-icon v-else> mdi-eye-off-outline </v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>


<script>
import Vue from "vue";
import axios from "axios";
import ComputedForItemsPage from "@/mixins/ComputedForItemsPage";

export default {
  name: "ItemsAppearance",
  components: {
    ItemsView: () => import("@/components/app/appbar/elements/ItemsView.vue"),
  },
  mixins: [ComputedForItemsPage],
  data: () => ({}),
  computed: {
    page() {
      return this.$store.state.Page;
    },
  },
  methods: {
    async toggle(meta) {
      let url = this.apiUrl + "/api/";
      let data = {
        data: { show: !meta.show },
      };
      if (this.isMetaPage) {
        url += "ChildMeta";
        data.metaId = Vue.prototype.$getUrlParam("metaId");
        data.childMetaId = meta.childMetaId;
      } else if (this.isMediaPage) {
        url += "MetaInMediaType";
        data.metaId = meta.metaId;
        data.typeId = Vue.prototype.$getUrlParam("typeId");
      }
      await axios({
        method: "put",
        url: url,
        data: data,
      });
      this.$root.$emit("updateAssignedMeta");
    },
    updateLimit(val) {
      this.$store.commit("updateStatePage", {
        key: "limit",
        value: val,
      });
      this.$root.$emit("setItemsLimit", val);
    },
    updateSize(val) {
      this.$store.commit("updateStatePage", {
        key: "size",
        value: val,
      });
    },
  },
};
</script>