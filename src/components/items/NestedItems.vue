<template>
  <div>
    <!-- Video meta -->
    <v-chip v-if="type == 'video'" label outlined>
      <v-icon left>mdi-monitor-screenshot</v-icon>
      {{ metadata.resolution }}
    </v-chip>

    <v-chip v-if="type == 'video'" label outlined>
      <v-icon left>mdi-harddisk</v-icon>
      {{ metadata.filesize }}
    </v-chip>

    <v-chip v-if="type == 'video'" label outlined>
      <v-icon left>mdi-file-video-outline</v-icon>
      {{ metadata.fileExtension }}
    </v-chip>

    <v-chip v-if="type == 'meta'" label outlined title="Number of videos">
      <v-icon class="mr-1">mdi-video-outline</v-icon> {{ numberOfMedia }}
    </v-chip>

    <v-chip label outlined title="Number of views">
      <v-icon class="mr-1">mdi-eye-outline</v-icon> {{ item.views }}
    </v-chip>

    <v-chip
      v-for="(i, x) in items"
      :key="i.item.name + x"
      @mouseover.stop="hoverImage($event, i.item.metaId, i.itemId)"
      @mouseleave.stop="$store.state.hover.show = false"
      :color="i.item.color"
      :text-color="getTextColor(i.item.color)"
      v-show="checkShow(i.item.metaId)"
    >
      <v-icon class="mr-1">mdi-{{ i.item.meta.icon }}</v-icon>
      {{ i.item.name }}
    </v-chip>

    <v-chip
      v-for="(i, x) in values"
      :key="i.meta.name + x"
      label
      outlined
      :title="i.meta.name"
      v-show="checkShow(i.metaId)"
    >
      <v-icon class="mr-1">mdi-{{ i.meta.icon }}</v-icon>
      {{ i.value }}
    </v-chip>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import ComputedForItemsPage from "@/mixins/ComputedForItemsPage";

export default {
  name: "NestedItems",
  props: {
    item: Object,
    items: Array,
    values: Array,
    metadata: Object,
    type: String,
  },
  mixins: [ComputedForItemsPage],
  mounted() {
    if (this.type == "meta") this.countMediaInItem();
  },
  data: () => ({
    numberOfMedia: 0,
  }),
  computed: {
    assigned() {
      return this.$store.state.Page.assigned;
    },
  },
  methods: {
    countMediaInItem() {
      let url = `/api/media/countInItem?typeId=1&itemId=${this.item.id}`;
      axios
        .get(this.apiUrl + url)
        .then((res) => {
          this.numberOfMedia = res.data.count;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getTextColor(color) {
      if (!color) return "";
      let value = Vue.prototype.$checkColorForDarkText(color);
      if (value) return "white";
      else return "black";
    },
    hoverImage(event, metaId, itemId) {
      Vue.prototype.$showHoverImage(event, metaId, itemId);
    },
    checkShow(metaId) {
      let assigned = this.assigned;
      let itemName = "metaId";
      if (this.isMetaPage) itemName = "childMetaId";
      let x = assigned.findIndex((i) => i[itemName] == metaId);
      if (x > -1) return assigned[x].show == 1 ? true : false;
      else return false;
    },
  },
};
</script>