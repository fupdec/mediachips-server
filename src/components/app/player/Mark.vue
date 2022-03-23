<template>
  <div @click="jumpTo" class="mark" :style="position">
    <span class="breaker"></span>

    <div class="mark-icon">
      <v-icon :color="color">mdi-{{ icon }}</v-icon>
      <v-icon
        v-if="mark.type == 'meta'"
        :color="colorMetaIcon"
        class="meta-icon"
        size="14"
      >
        mdi-{{ mark.meta.icon }}
      </v-icon>
    </div>

    <v-sheet class="tooltip text-center" :color="color" outlined rounded>
      <v-img :src="thumb" :aspect-ratio="16 / 9" class="thumb">
        <v-btn @click.stop="del(mark)" class="delete" color="error" x-small fab>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-sheet class="time" v-html="time" />
      </v-img>

      <v-sheet v-if="mark.type !== 'favorite'" class="mark-name">
        <v-icon v-if="mark.type == 'meta'" small class="mr-1">
          mdi-{{ mark.meta.icon }}
        </v-icon>
        <span v-if="mark.type == 'meta'" v-html="mark['item.name']" />
        <span v-else v-html="mark.text" />
      </v-sheet>
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
    this.$root.$on("updateMarkImage", (id) => {
      if (this.mark.id === id) this.getImg();
    });
    this.$nextTick(() => {
      this.getImg();
    });
  },
  beforeDestroy() {
    this.$root.$off("updateMarkImage");
  },
  data: () => ({
    thumb: null,
  }),
  computed: {
    p: {
      get() {
        return this.$store.state.Player;
      },
      set(value) {
        this.$store.state.Player = value;
      },
    },
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
    colorMetaIcon() {
      const isDark = Vue.prototype.$checkColorForDarkText(this.color);
      return isDark ? "white" : "black";
    },
    time() {
      return Vue.prototype.$getReadableDuration(this.mark.time);
    },
  },
  methods: {
    async getImg() {
      let imgPath = path.join(
        this.$store.state.mediaPath,
        "marks",
        `${this.mark.id}.jpg`
      );
      this.thumb = await Vue.prototype.$getLocalImage(imgPath);
    },
    jumpTo() {
      this.$store.dispatch("playerJumpTo", { time: this.mark.time });
    },
    del(mark) {
      this.p.markDel.show = true;
      this.p.markDel.mark = mark;
    },
  },
};
</script>