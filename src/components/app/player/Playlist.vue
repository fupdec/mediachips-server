<template>
  <v-card
    v-show="p.playlistVisible"
    class="playlist-window player-window"
    elevation="20"
    outlined
  >
    <v-card-actions class="pa-1">
      <v-icon left>mdi-playlist-play</v-icon>
      <span>Playlist</span>
      <v-spacer></v-spacer>
      <v-btn @click="p.playlistVisible = false" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-actions>

    <v-btn-toggle
      v-model="p.playlistMode"
      color="primary"
      class="toggle"
      multiple
      dense
      tile
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

    <div class="items">
      <div v-for="(video, i) in p.playlist" :key="video.id" @click="play(i)">
        <v-img :src="video.thumb" :aspect-ratio="16 / 9" class="thumb">
          <span class="name">
            <b class="pr-1">{{ i + 1 }}.</b>
            <span v-text="getFileName(video.path)" />
          </span>
          <div
            v-if="!reg && i > 9"
            class="reg-playlist"
            v-text="`App not registered`"
          />
          <!-- <span class="time">
                {{ getDuration(video['videoMetadata'].duration) }}
              </span> -->
          <!-- TODO get duration -->
          <span v-if="p.nowPlaying === i" class="play-state">
            <v-icon class="pl-1 pr-1">mdi-play</v-icon>
            <span class="pr-3 text">Now playing</span>
          </span>
        </v-img>
      </div>
    </div>
  </v-card>
</template>


<script>
import Vue from "vue";
const path = require("path");

export default {
  name: "Playlist",
  mounted() {
    this.$root.$on("scrollToNowPlaying", () => {
      this.scrollToNowPlaying();
    });
  },
  beforeDestroy() {
    this.$root.$off("scrollToNowPlaying");
  },
  computed: {
    p: {
      get() {
        return this.$store.state.Player;
      },
      set(value) {
        this.$store.state.Player = value;
      },
    },
    reg() {
      return this.$store.getters.reg;
    },
    video() {
      return this.p.playlist[this.p.nowPlaying];
    },
  },
  methods: {
    async getThumbs() {
      for (let i of this.p.playlist) {
        let imgPath = path.join(
          this.$store.state.mediaPath,
          "thumbs",
          `${i.id}.jpg`
        );
        i.thumb = await Vue.prototype.$getLocalImage(imgPath);
      }
    },
    play(index) {
      this.p.paused = false;
      let current = this.video;
      if (this.p.playlistMode.includes("shuffle")) {
        let indexes = [];
        for (let i = 0; i < this.p.playlist.length; i++) indexes.push(i);
        this.p.playlistShuffle = _.shuffle(indexes);
        const i = this.p.playlistShuffle.indexOf(index);
        this.p.playlistShuffle.splice(i, 1);
        this.p.playlistShuffle.unshift(index);
        this.$emit("play", { n: this.p.playlistShuffle[index], o: current });
        if (this.p.playlistVisible) this.scrollToNowPlaying();
        // TODO fix shuffle
      } else this.$emit("play", { n: this.p.playlist[index], o: current });
    },
    getFileName(filePath) {
      return Vue.prototype.$getFileNameFromPath(filePath);
    },
    getDuration(time) {
      return Vue.prototype.$getReadableDuration(time);
    },
    scrollToNowPlaying() {
      const height =
        (this.p.nowPlaying * document.documentElement.clientWidth) / 10;
      // TODO create autoscroll function
    },
  },
  watch: {
    "p.playlist"() {
      this.getThumbs();
    },
    "p.playlistMode"(mode, oldMode) {
      if (!mode.includes("shuffle") && oldMode.includes("shuffle")) return;
      let index = [];
      let current = this.video;
      for (let i = 0; i < this.p.playlist.length; i++) index.push(i);
      this.p.playlistShuffle = _.shuffle(index);
      this.p.nowPlaying = this.p.playlistShuffle[0];
      this.$emit("play", { n: this.video, o: current });
      if (this.p.playlistVisible) this.scrollToNowPlaying();
    },
  },
};
</script>