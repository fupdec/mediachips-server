<template>
  <v-card v-show="isPlaylistVisible" class="playlist-wrapper">
    <v-card-actions class="pa-1">
      <v-icon left>mdi-format-list-bulleted</v-icon>
      <span>Playlist</span>
      <v-spacer></v-spacer>
      <v-btn @click="close" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-actions class="pa-0">
      <v-btn-toggle
        v-model="playlistMode"
        tile
        dense
        multiple
        color="primary"
        class="toggle"
      >
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn value="loop" v-on="on">
              <v-icon>mdi-sync</v-icon>
            </v-btn>
          </template>
          <span>Loop</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn value="autoplay" v-on="on">
              <v-icon>mdi-play-pause</v-icon>
            </v-btn>
          </template>
          <span>Autoplay</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn value="shuffle" v-on="on">
              <v-icon>mdi-shuffle-variant</v-icon>
            </v-btn>
          </template>
          <span>Shuffle</span>
        </v-tooltip>
      </v-btn-toggle>
    </v-card-actions>
    <vuescroll ref="playlist" class="items">
      <v-card-text class="pa-0">
        <v-list dense class="pa-0">
          <v-list-item-group v-model="nowPlaying" mandatory color="primary">
            <v-list-item
              v-for="(video, i) in videos"
              :key="video.id"
              :ref="`videoItem${i}`"
              @click="play(i)"
              class="video-item"
            >
              <img :src="video.thumb" class="thumb" />
              <span class="video-name">
                <b>{{ i + 1 }}.</b>
                <span class="path">{{ video.path }}</span>
              </span>
              <div v-if="!reg && i > 4" class="reg-playlist">
                App not registered
              </div>
              <span
                v-if="nowPlaying === i"
                class="play-state overline text--primary"
              >
                <v-icon class="pl-2 pr-1">mdi-play</v-icon>
                <span class="pr-4 text">Now playing</span>
              </span>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </vuescroll>
  </v-card>
</template>


<script>
import Vue from "vue"
import vuescroll from "vuescroll"

const path = require("path")

export default {
  name: "Playlist",
  props: {
    videos: Array,
  },
  components: {
    vuescroll,
  },
  mounted() {
  },
  data: () => ({
    playlistShuffle: [],
    playlistMode: ["autoplay"],
    reg: true,
  }),
  computed: {
    isPlaylistVisible: {
      get() { return this.$store.state.player.playlistVisible },
      set(value) { this.$store.state.player.playlistVisible = value },
    },
    nowPlaying: {
      get() { return this.$store.state.player.nowPlaying },
      set(value) { this.$store.state.player.nowPlaying = value },
    },
  },
  methods: {
    close() {
      this.isPlaylistVisible = false;
    },
    async getThumbs() {
      for (let i of this.videos) {
        let imgPath = path.join(
          __dirname,
          `/userfiles/media/thumbs/${i.oldId}.jpg`
        );
        i.thumb = await Vue.prototype.$getLocalImage(imgPath);
      }
    },
    play(index) {
      this.$emit('play', this.videos[index])
      // // console.log(this.player.playlist.items.map(i=>i.mrl))
      // if (this.playlistMode.includes('shuffle')) {
      //   let indices = []
      //   for (let i = 0; i < this.videos.length; i++) indices.push(i)
      //   this.playlistShuffle = _.shuffle(indices)
      //   const i = this.playlistShuffle.indexOf(index)
      //   this.playlistShuffle.splice(i, 1)
      //   this.playlistShuffle.unshift(index)
      //   this.player.playlist.playItem(index)

      //   if (this.isPlaylistVisible) { // scroll to now playing in playlist
      //     const height = `${this.playIndex * document.documentElement.clientWidth / 10}`
      //     this.$refs.playlist.scrollTo({ y: height }, 50)
      //   }
      // } else this.playVideo(this.videos[this.playIndex])
    },
  },
  watch: {
    videos() {
      this.getThumbs();
    },
  },
};
</script>


<style lang="scss">
.playlist-wrapper {
  position: fixed;
  top: 10px;
  right: 10px;
  min-width: 18vw;
  .items {
    height: calc(100vh - 116px) !important;
  }
  .v-card__title {
    flex-wrap: nowrap;
    white-space: nowrap;
  }
  .video-item {
    position: relative;
    overflow: hidden;
    height: 10vw;
  }
  .video-name {
    font-size: 1vw;
    line-height: 1.2;
    word-break: keep-all;
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    overflow: hidden;
    .path {
      padding-left: 4px;
      position: absolute;
    }
  }
  .play-state {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    line-height: 1;
    position: absolute;
    bottom: 5px;
    left: 5px;
    z-index: 1;
    &::before {
      content: "";
      position: absolute;
      background-color: currentColor;
      width: 100%;
      height: 100%;
      border-radius: 50px;
      filter: invert(1);
      z-index: -1;
    }
    .text {
      font-size: 1vw;
    }
  }
  .thumb {
    position: absolute;
    min-height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    mask-image: linear-gradient(to top, rgba(0, 0, 0, 1), transparent);
  }
  .toggle {
    width: 100%;
    .v-btn {
      min-width: 30px;
      width: 33.33%;
      padding: 0;
    }
  }
}
</style>