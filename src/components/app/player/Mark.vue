<template>
  <div @click="jumpTo" class="mark" :style="position">
    <span class="breaker"></span>
    
    <v-icon :color="color" class="mark-icon">mdi-{{ icon }}</v-icon>

    <v-sheet class="tooltip text-center" :color="color" outlined rounded>
      <v-img :src="thumb" :aspect-ratio="16 / 9" class="thumb">
        <span class="time" v-html="time" />
      </v-img>

      <span class="mark-name">
        <v-icon v-if="mark.type == 'meta'" small class="mr-1">
          mdi-{{ mark.meta.icon }}
        </v-icon>
        <span v-if="mark.type == 'meta'" v-html="mark['item.name']" />
        <span v-else v-html="mark.name" />
      </span>
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
  mounted() {
    this.getImg();
    this.$root.$on("updateMarkImage", (id) => {
      if (this.mark.id === id) this.getImg();
    });
  },
  data: () => ({
    thumb: null,
  }),
  computed: {
    icon() {
      let icon = "tooltip";
      if (this.mark.type == "favorite") icon = "heart";
      else if (this.mark.type == "bookmark") icon = "bookmark";
      return icon;
    },
    color() {
      let color = "primary";
      if (this.mark.type == "favorite") color = "#e91e63";
      else if (this.mark.type == "bookmark") color = "#f44336";
      else if (this.mark.type == "meta") color = this.mark["item.color"];
      return color;
    },
    time() {
      return Vue.prototype.$getReadableDuration(this.mark.time);
    },
  },
  methods: {
    async getImg() {
      let imgPath = path.join(
        __dirname,
        "/userfiles/media/marks/",
        this.mark.id + ".jpg"
      );
      this.thumb = await Vue.prototype.$getLocalImage(imgPath);
    },
    jumpTo() {
      this.$store.dispatch("playerJumpTo", { time: this.mark.time });
    },
  },
};
</script>