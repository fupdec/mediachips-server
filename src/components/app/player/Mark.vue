<template>
  <div
    @click="jumpTo"
    class="marker"
    :style="position + `background-color:${color}`"
  >
    <v-sheet class="tooltip text-center" outlined rounded>
      <v-img :src="thumb" :aspect-ratio="16 / 9" class="thumb" />
      <v-chip small class="mr-1 px-1 py-0">
        <v-icon small class="mr-1" :color="color"> mdi-{{ icon }} </v-icon>
        <span v-if="mark.type == 'meta'">{{ mark["Item.name"] }}</span>
        <span v-else>{{ mark.name }}</span>
      </v-chip>
      <v-chip label small class="pa-1 py-0">{{ duration }}</v-chip>
    </v-sheet>
  </div>
</template>


<script>
import Vue from "vue";

const path = require("path");

export default {
  name: "Mark",
  props: {
    mark: Object,
    position: String,
  },
  components: {},
  mounted() {
    this.getImg();
    this.$root.$on("updateMarkerImage", (id) => {
      if (this.mark.id === id) this.getImg();
    });
  },
  data: () => ({
    thumb: null,
  }),
  computed: {
    icon() {
      let icon = "map-marker";
      if (this.mark.type == "favorite") icon = "heart";
      else if (this.mark.type == "bookmark") icon = "bookmark";
      else if (this.mark.type == "meta") icon = this.mark.meta.icon;
      return icon;
    },
    color() {
      let color = "primary";
      if (this.mark.type == "favorite") color = "#e91e63";
      else if (this.mark.type == "bookmark") color = "#f44336";
      else if (this.mark.type == "meta") color = this.mark["Item.color"];
      return color;
    },
    duration() {
      return Vue.prototype.$getReadableDuration(this.mark.time);
    },
  },
  methods: {
    async getImg() {
      let imgPath = path.join(
        __dirname,
        "/userfiles/media/markers/",
        this.mark.id + ".jpg"
      );
      this.thumb = await Vue.prototype.$getLocalImage(imgPath);
    },
    jumpTo() {
      this.$store.dispatch("playerJumpTo", { time: this.mark.time });
    },
  },
  watch: {},
};
</script>