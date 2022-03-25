<template>
  <v-card
    v-if="p.marksVisible"
    class="marks-window player-window"
    elevation="20"
    outlined
  >
    <v-card-actions class="pa-1">
      <v-icon left>mdi-tooltip</v-icon>
      <span>Marks</span>
      <v-spacer></v-spacer>
      <v-btn @click="p.marksVisible = false" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-actions>

    <v-chip-group v-model="marksType" color="primary" show-arrows multiple>
      <v-chip value="favorite" small class="px-2">
        <v-icon small v-text="`mdi-heart`" />
      </v-chip>
      <v-chip value="bookmark" small class="px-2">
        <v-icon small v-text="`mdi-bookmark`" />
      </v-chip>
      <v-chip
        v-for="i in assigned"
        :key="i.meta.id"
        :value="i.meta.id"
        small
        class="px-2"
      >
        <v-icon small v-text="`mdi-${i.meta.icon}`" />
      </v-chip>
    </v-chip-group>

    <div class="items">
      <div v-for="mark in p.marks" :key="mark.id" class="mark">
        <v-img
          v-if="checkMarkVisibility(mark)"
          @click="jumpTo(mark.time)"
          :src="mark.thumb"
          :aspect-ratio="16 / 9"
          class="thumb"
        >
          <span class="time">{{ getDuration(mark.time) }}</span>
          <div class="name">
            <v-icon
              :color="getColor(mark)"
              v-text="`mdi-${getIcon(mark)}`"
              class="mr-1"
              small
            />
            <span v-if="mark.type == 'meta'" v-html="mark['item.name']" />
            <span v-else v-html="mark.name" />
          </div>
          <v-btn
            @click.stop="del(mark)"
            class="delete"
            color="error"
            x-small
            fab
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-img>
      </div>
      <div v-if="p.marks.length == 0" class="text-center pt-6">
        <v-icon class="mb-2" large>mdi-ghost-outline</v-icon> <br />
        <span>No marks</span>
      </div>
    </div>
  </v-card>
</template>


<script>
import Vue from "vue";
const path = require("path");

export default {
  name: "Marks",
  mounted() {
    this.$root.$on("updateMarkImage", (id) => {
      if (this.p.marks.some((i) => i.id === id)) this.getThumbs();
    });
  },
  beforeDestroy() {
    this.$root.$off("updateMarkImage");
  },
  data: () => ({
    marksType: ["favorite", "bookmark"],
  }),
  computed: {
    assigned() {
      let list = this.$store.state.Page.assigned;
      return list.filter((i) => i.meta.metaSetting.marks);
    },
    p: {
      get() {
        return this.$store.state.Player;
      },
      set(value) {
        this.$store.state.Player = value;
      },
    },
  },
  methods: {
    async getThumbs() {
      for (let i of this.p.marks) {
        let imgPath = path.join(
          this.$store.state.mediaPath,
          "videos/marks",
          `${i.id}.jpg`
        );
        i.thumb = await Vue.prototype.$getLocalImage(imgPath);
      }
    },
    getIcon(mark) {
      let icon = "map-marker";
      if (mark.type == "favorite") icon = "heart";
      else if (mark.type == "bookmark") icon = "bookmark";
      else if (mark.type == "meta") icon = mark.meta.icon;
      return icon;
    },
    getColor(mark) {
      let color = "primary";
      if (mark.type == "favorite") color = "#e91e63";
      else if (mark.type == "bookmark") color = "#f44336";
      else if (mark.type == "meta") color = mark["item.color"];
      return color;
    },
    getDuration(duration) {
      return Vue.prototype.$getReadableDuration(duration);
    },
    jumpTo(time) {
      this.$store.dispatch("playerJumpTo", { time });
    },
    checkMarkVisibility(mark) {
      let type = mark.type;
      if (type == "meta") type = mark.meta.id;
      return this.marksType.includes(type);
    },
    del(mark) {
      this.p.markDel.show = true;
      this.p.markDel.mark = mark;
    },
  },
  watch: {
    "p.marks"() {
      this.getThumbs();
    },
    assigned(arr) {
      arr.forEach((i) => {
        if (!this.marksType.includes(i.meta.id)) this.marksType.push(i.meta.id);
      });
    },
  },
};
</script>