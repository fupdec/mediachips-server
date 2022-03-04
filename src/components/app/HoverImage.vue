<template>
  <div
    v-show="hover.show"
    class="hover-image"
    :style="`top:${hover.y + 30}px; 
        left:${hover.x + 30}px;`"
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
    hover() {
      return this.$store.state.hover;
    },
  },
  methods: {
    async getHoveredImage() {
      let imgPath = path.join(
        __dirname,
        "/userfiles/media/meta/",
        `${this.hover.metaId}`,
        `${this.hover.itemId}_main.jpg`
      );
      this.src = await Vue.prototype.$getLocalImage(imgPath);
    },
  },
  watch: {
    async "hover.itemId"() {
      this.src = null;
      await this.getHoveredImage();
    },
  },
};
</script>