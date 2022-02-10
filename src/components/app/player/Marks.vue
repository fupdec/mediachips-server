<template>
  <v-card v-show="p.marksVisible" class="marks-wrapper" elevation="20" outlined>
    <v-card-actions class="pa-1">
      <v-icon left>mdi-map-mark</v-icon>
      <span>Marks</span>
      <v-spacer></v-spacer>
      <v-btn @click="p.marksVisible = false" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-actions class="pa-0">
      <v-btn-toggle
        v-model="marksType"
        tile
        dense
        mandatory
        multiple
        color="primary"
        class="toggle"
      >
        <v-btn
          value="favorite"
          :style="`width:${100 / (metaMarks.length + 2)}%`"
        >
          <v-icon>mdi-heart</v-icon>
        </v-btn>
        <v-btn
          value="bookmark"
          :style="`width:${100 / (metaMarks.length + 2)}%`"
        >
          <v-icon>mdi-bookmark</v-icon>
        </v-btn>
        <v-btn
          v-for="m in metaMarks"
          :key="m.id"
          :value="m.id"
          :style="`width:${100 / (metaMarks.length + 2)}%`"
        >
          <v-icon>mdi-{{ m.settings.icon }}</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-card-actions>
    <vuescroll class="items">
      <v-card-text class="pa-0">
        <div v-if="p.marks.length">
          <div v-for="mark in p.marks" :key="mark.id" class="mark-wrapper">
            <div v-if="marksType.includes(mark.type)">
              <div @click="jumpTo(mark.time)" class="mark">
                <v-img :src="mark.thumb" :aspect-ratio="16 / 9" class="thumb">
                  <span class="time">{{ getDuration(mark.time) }}</span>
                  <div class="name">
                    <v-icon small class="mr-1" :color="getColor(mark)">
                      mdi-{{ getIcon(mark) }}
                    </v-icon>
                    <span
                      v-if="mark.type == 'meta'"
                      v-html="mark['item.name']"
                    />
                    <span v-else v-html="mark.name" />
                  </div>
                </v-img>
              </div>
              <v-btn
                @click="openDialogRemoveMark(mark)"
                height="25"
                width="25"
                outlined
                icon
                color="red"
                class="delete"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
        <div v-else class="text-center pt-6">
          <v-icon class="mb-2" large>mdi-ghost-outline</v-icon> <br />
          <span>No marks</span>
        </div>
      </v-card-text>
    </vuescroll>
  </v-card>
</template>


<script>
import Vue from "vue";
import vuescroll from "vuescroll";

const path = require("path");

export default {
  name: "Marks",
  props: {},
  components: {
    vuescroll,
  },
  mounted() {
    this.$root.$on("updateMarkImage", (id) => {
      if (this.p.marks.some((i) => i.id === id)) this.getThumbs();
    });
  },
  data: () => ({
    markBookmarkText: "",
    metaForMark: "",
    markMetaId: null,
    nameForNewMetaCard: "",
    dialogMarkMeta: false,
    dialogAddNewMetaCard: false,
    dialogListView: false,
    dialogMarkBookmark: false,
    dialogRemoveMark: false,
    markForRemove: {},
    marksType: ["favorite", "bookmark", "meta"],
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
    metaMarks() {
      return [];
    },
  },
  methods: {
    async getThumbs() {
      for (let i of this.p.marks) {
        let p = path.join(__dirname, `/userfiles/media/marks/${i.id}.jpg`);
        i.thumb = await Vue.prototype.$getLocalImage(p);
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
  },
  watch: {
    "p.marks"() {
      this.getThumbs();
    },
  },
};
</script>