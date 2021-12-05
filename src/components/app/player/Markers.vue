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
                  :src="mark.thumb" :aspect-ratio="16/9" class="thumb"
                  :gradient="gradient"
                >
                  <span class="time">{{ getDuration(mark.time) }}</span>
                  <div class="name">
                    <v-icon small left :color="getColor(mark)"> mdi-{{getIcon(mark)}} </v-icon>
                    <span v-if="mark.type == 'meta'">{{ mark["Item.name"]}}</span>
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
import Vue from "vue"
import vuescroll from "vuescroll"

const path = require("path")

export default {
  name: "Markers",
  props: {
  },
  components: {
    vuescroll,
  },
  mounted() {
  },
  data: () => ({
    markerBookmarkText: '',
    metaForMarker: '',
    markerMetaId: null,
    nameForNewMetaCard: '',
    dialogMarkerMeta: false,
    dialogAddNewMetaCard: false,
    dialogListView: false,
    dialogMarkerBookmark: false,
    dialogRemoveMarker: false,
    markerForRemove: {},
    markersType: ['favorite','bookmark','meta'],
  }),
  computed: {
    isMarkersVisible: {
      get() { return this.$store.state.player.markersVisible },
      set(value) { this.$store.state.player.markersVisible = value },
    },
    markers: {
      get() { return this.$store.state.player.markers },
      set(value) { this.$store.state.player.markers = value },
    },
    gradient() {
      if (this.$vuetify.theme.dark) return 'to bottom, rgba(0, 0, 0, 0.5), transparent'
      else return 'to bottom, rgba(255, 255, 255, 0.5), transparent'
    },
    metaMarkers() { return [] },
  },
  methods: {
    async getThumbs() {
      for (let i of this.markers) {
        let p = path.join(__dirname, `/userfiles/media/markers/${i.id}.jpg`)
        i.thumb = await Vue.prototype.$getLocalImage(p)
      }
    },
    getIcon(mark) { 
      let icon = 'map-marker'
      if (mark.type == 'favorite') icon = 'heart'
      else if (mark.type == 'bookmark') icon = 'bookmark'
      else if (mark.type == 'meta') icon = mark.meta.icon
      return icon
    },
    getColor(mark) { 
      let color = 'primary'
      if (mark.type == 'favorite') color = 'pink'
      else if (mark.type == 'bookmark') color = 'red'
      else if (mark.type == 'meta') color = mark['Item.color']
      return color
    },
    getDuration(duration) { return Vue.getReadableDuration(duration) },
    jumpTo(time) {
      this.$emit("jumpTo", time)
    },
  },
  watch: {
    markers() {
      this.getThumbs()
    },
  },
};
</script>


<style lang="scss">
.markers-wrapper {
  position: fixed;
  top: 10px;
  left: 10px;
  min-width: 18vw;
  .items {
    height: calc(100vh - 116px) !important;
  }
  .v-card__title {
    flex-wrap: nowrap;
    white-space: nowrap;
  }
  .mark {
    cursor: pointer;
    &-wrapper {
      position: relative;
      &:hover {
        .delete {
          opacity: 1;
        }
      }
    }
    .thumb {
      width: 100%;
      background-color: rgb(38, 50, 61);
    }
    .name {
      position: absolute;
      font-size: 1vw;
      display: flex;
      align-items: center;
      left: 5px;
      top: 1px;
    }
    .time {
      position: absolute;
      bottom: 1px;
      right: 1px;
      line-height: 1;
      padding: 2px;
      border-radius: 2px;
      font-size: 1vw;
      background-color: rgba(17, 17, 17, 0.6);
    }
  }
  .toggle {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .v-btn {
      min-width: 30px;
      padding: 0;
    }
  }
  .delete {
    opacity: 0;
    transition: .3s;
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 1.5vw;
    border-radius: 0 5px 0 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>