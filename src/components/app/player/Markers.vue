<template>
  <v-card v-show="isMarkersVisible" class="markers-wrapper">
    <v-card-actions class="pa-1">
      <v-icon left>mdi-map-mark</v-icon>
      <span>Markers</span>
      <v-spacer></v-spacer>
      <v-btn @click="isMarkersVisible = false" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-actions class="pa-0">
      <v-btn-toggle
        v-model="markersType"
        tile
        dense
        mandatory
        multiple
        color="primary"
        class="toggle"
      >
        <v-btn
          value="favorite"
          :style="`width:${100 / (metaMarkers.length + 2)}%`"
        >
          <v-icon>mdi-heart</v-icon>
        </v-btn>
        <v-btn
          value="bookmark"
          :style="`width:${100 / (metaMarkers.length + 2)}%`"
        >
          <v-icon>mdi-bookmark</v-icon>
        </v-btn>
        <v-btn
          v-for="m in metaMarkers"
          :key="m.id"
          :value="m.id"
          :style="`width:${100 / (metaMarkers.length + 2)}%`"
        >
          <v-icon>mdi-{{ m.settings.icon }}</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-card-actions>
    <vuescroll class="items">
      <v-card-text class="pa-0">
        <div v-if="markers.length">
          <div v-for="mark in markers" :key="mark.id" class="mark-wrapper">
            <div v-if="markersType.includes(mark.type)">
              <div @click="jumpTo(mark.time)" class="mark">
                <v-img
                  :src="mark.thumb"
                  :aspect-ratio="16 / 9"
                  class="thumb"
                  :gradient="gradient"
                >
                  <span class="time">{{ getDuration(mark.time) }}</span>
                  <div class="name">
                    <v-icon small left :color="getColor(mark)">
                      mdi-{{ getIcon(mark) }}
                    </v-icon>
                    <span v-if="mark.type == 'meta'">{{
                      mark["Item.name"]
                    }}</span>
                    <span v-else>{{ mark.name }}</span>
                  </div>
                </v-img>
              </div>
              <v-btn
                @click="openDialogRemoveMarker(mark)"
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
          <span>No markers</span><br />
          <v-icon size="60">mdi-close</v-icon>
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
  name: "Markers",
  props: {},
  components: {
    vuescroll,
  },
  mounted() {},
  data: () => ({
    markerBookmarkText: "",
    metaForMarker: "",
    markerMetaId: null,
    nameForNewMetaCard: "",
    dialogMarkerMeta: false,
    dialogAddNewMetaCard: false,
    dialogListView: false,
    dialogMarkerBookmark: false,
    dialogRemoveMarker: false,
    markerForRemove: {},
    markersType: ["favorite", "bookmark", "meta"],
  }),
  computed: {
    isMarkersVisible: {
      get() {
        return this.$store.state.Player.markersVisible;
      },
      set(value) {
        this.$store.state.Player.markersVisible = value;
      },
    },
    markers: {
      get() {
        return this.$store.state.Player.markers;
      },
      set(value) {
        this.$store.state.Player.markers = value;
      },
    },
    gradient() {
      if (this.$vuetify.theme.dark)
        return "to bottom, rgba(0, 0, 0, 0.5), transparent";
      else return "to bottom, rgba(255, 255, 255, 0.5), transparent";
    },
    metaMarkers() {
      return [];
    },
  },
  methods: {
    async getThumbs() {
      for (let i of this.markers) {
        let p = path.join(__dirname, `/userfiles/media/markers/${i.id}.jpg`);
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
      else if (mark.type == "meta") color = mark["Item.color"];
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
    markers() {
      this.getThumbs();
    },
  },
};
</script>