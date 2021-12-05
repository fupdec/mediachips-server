<template>
  <div
    @click="jumpTo"
    class="marker"
    :style="position + `background-color:${color}`"
  >
    <div class="tooltip text-center">
      <v-img :src="thumb" :aspect-ratio="16 / 9" class="thumb" />
      <div>
        <v-icon small left :color="color"> mdi-{{ icon }} </v-icon>
        <span v-if="mark.type == 'meta'">{{ mark["Item.name"] }}</span>
        <span v-else>{{ mark.name }}</span>
      </div>
      <v-chip outlined small class="pa-1">{{ duration }}</v-chip>
    </div>
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
    duration() { return Vue.prototype.$getReadableDuration(this.mark.time) },
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
      this.$emit("jumpTo", this.mark.time);
    },
  },
  watch: {},
};
</script>


<style lang="scss">
.marker {
  cursor: pointer;
  position: absolute;
  width: 1px;
  height: 10px;
  background-color: var(--v-primary-base);
  transition: 0.2s all ease;
  &:hover {
    .tooltip {
      display: block;
    }
  }
  .tooltip {
    position: absolute;
    bottom: 10px;
    width: 10vw;
    left: -4vw;
    display: none;
    background-color: rgba(10, 10, 10, 0.75);
    border-radius: 2px 2px 0 0;
    font-size: 12px;
  }
}
</style>