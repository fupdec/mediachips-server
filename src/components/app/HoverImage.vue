<template>
  <div
    v-show="$store.state.hover.show"
    class="hover-image"
    :style="`top:${$store.state.hover.y + 30}px; 
        left:${$store.state.hover.x + 30}px;`"
  >
    <img :src="src" />
  </div>
</template>


<script>
import Vue from "vue";
const path = require("path");

export default {
  data: () => ({
    src: null,
  }),
  computed: {
    itemId() {
      return this.$store.state.hover.itemId;
    },
  },
  methods: {
    async getHoveredImage() {
      let imgPath = path.join(
        __dirname,
        "/userfiles/media/meta/",
        `${this.$store.state.hover.metaId}`,
        `${this.$store.state.hover.itemId}_main.jpg`
      );
      this.src = await Vue.prototype.$getLocalImage(imgPath);
    },
  },
  watch: {
    async itemId() {
      this.src = null;
      await this.getHoveredImage();
    },
  },
};
</script>