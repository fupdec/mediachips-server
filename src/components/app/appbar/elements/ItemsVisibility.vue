<template>
  <v-menu offset-y nudge-bottom="10" :close-on-content-click="false">
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-btn v-on="{ ...onMenu, ...onTooltip }" icon>
            <v-icon>mdi-eye-outline</v-icon>
          </v-btn>
        </template>
        <span> Visibility of Elements </span>
      </v-tooltip>
    </template>

    <v-card min-width="150" max-height="50vh">
      <v-list dense>
        <v-subheader>Meta</v-subheader>

        <v-list-item
          v-for="(i, x) in assigned"
          :key="x"
          @click="toggle(i)"
          link
        >
          <v-list-item-content>
            <v-list-item-title>
              <v-icon left>mdi-{{ i["meta.icon"] }}</v-icon>
              {{ i["meta.name"] }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon v-if="i.show"> mdi-check </v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>


<script>
import vuescroll from "vuescroll";
import axios from "axios";
import ComputedForItemsPage from "@/mixins/ComputedForItemsPage";

export default {
  name: "ItemsView",
  components: {
    vuescroll,
  },
  mixins: [ComputedForItemsPage],
  data: () => ({}),
  computed: {
    assigned() {
      return this.$store.state.Page.assigned;
    },
  },
  methods: {
    async toggle(meta) {
      let val = meta.show === 1 ? 0 : 1;
      let url = this.apiUrl + "/api/";
      let data = {
        data: { show: val },
      };
      if (this.isMetaPage) {
        url += "ChildMeta";
        data.metaId = this.metaId;
        data.childMetaId = meta.childMetaId;
      } else if (this.isMediaPage) {
        url += "MetaInMediaType";
        data.metaId = meta.metaId;
        data.typeId = this.typeId;
      }
      await axios({
        method: "put",
        url: url,
        data: data,
      });
      this.$root.$emit("updateAssignedMeta");
    },
  },
};
</script>