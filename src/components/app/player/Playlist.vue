<template>
  <v-card
    v-show="isPlaylistVisible"
    class="playlist-wrapper"
    elevation="20"
    outlined
  >
    <v-card-actions class="pa-1">
      <v-icon left>mdi-format-list-bulleted</v-icon>
      <span>Playlist</span>
      <v-spacer></v-spacer>
      <v-btn @click="isPlaylistVisible = false" icon>
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
              v-for="(video, i) in playlist"
              :key="video.id"
              :ref="`videoItem${i}`"
              @click="play(i)"
              class="video-item"
            >
              <img :src="video.thumb" class="thumb" />
              <span class="video-name">
                <b>{{ i + 1 }}.</b>
                <span class="path" v-html="getFileName(video.path)" />
              </span>
              <div v-if="!reg && i > 4" class="reg-playlist">
                App not registered
              </div>
              <span class="time">
                {{ getDuration(video['videoMetadata'].duration) }}
              </span>
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
import _ from "lodash";
import Vue from "vue";
import vuescroll from "vuescroll";

const path = require("path");

export default {
  name: "Playlist",
  components: {
    vuescroll,
  },
  mounted() {
    this.$root.$on("scrollToNowPlaying", () => {
      this.scrollToNowPlaying();
    });
  },
  data: () => ({
    reg: true,
  }),
  computed: {
    playlist() {
      return this.$store.state.Player.playlist;
    },
    isPlaylistVisible: {
      get() {
        return this.$store.state.Player.playlistVisible;
      },
      set(value) {
        this.$store.state.Player.playlistVisible = value;
      },
    },
    playlistMode: {
      get() {
        return this.$store.state.Player.playlistMode;
      },
      set(value) {
        this.$store.state.Player.playlistMode = value;
      },
    },
    playlistShuffle: {
      get() {
        return this.$store.state.Player.playlistShuffle;
      },
      set(value) {
        this.$store.state.Player.playlistShuffle = value;
      },
    },
    nowPlaying: {
      get() {
        return this.$store.state.Player.nowPlaying;
      },
      set(value) {
        this.$store.state.Player.nowPlaying = value;
      },
    },
  },
  methods: {
    async getThumbs() {
      for (let i of this.playlist) {
        let imgPath = path.join(
          __dirname,
          `/userfiles/media/thumbs/${i.id}.jpg`
        );
        i.thumb = await Vue.prototype.$getLocalImage(imgPath);
      }
    },
    play(index) {
      if (this.playlistMode.includes("shuffle")) {
        let indexes = [];
        for (let i = 0; i < this.playlist.length; i++) indexes.push(i);
        this.playlistShuffle = _.shuffle(indexes);
        const i = this.playlistShuffle.indexOf(index);
        this.playlistShuffle.splice(i, 1);
        this.playlistShuffle.unshift(index);
        console.log(this.player.playlist);
        this.player.playlist.playItem(index);

        if (this.isPlaylistVisible) this.scrollToNowPlaying();
      } else this.$emit("play", this.playlist[index]);
    },
    getFileName(filePath) {
      return Vue.prototype.$getFileNameFromPath(filePath);
    },
    getDuration(time) {
      return Vue.prototype.$getReadableDuration(time);
    },
    scrollToNowPlaying() {
      const height =
        (this.nowPlaying * document.documentElement.clientWidth) / 10;
      this.$refs.playlist.scrollTo({ y: height }, 50);
    },
  },
  watch: {
    playlist() {
      this.getThumbs();
    },
    playlistMode(mode, oldMode) {
      if (!mode.includes("shuffle") && oldMode.includes("shuffle")) return;
      let index = [];
      for (let i = 0; i < this.playlist.length; i++) index.push(i);
      this.playlistShuffle = _.shuffle(index);
      this.nowPlaying = this.playlistShuffle[0];
      this.$emit("play", this.playlist[this.nowPlaying]);
      if (this.isPlaylistVisible) this.scrollToNowPlaying();
    },
  },
};
</script>