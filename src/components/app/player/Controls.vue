<template>
  <v-card
    class="controls"
    tile
    @mouseenter="mouseOverControls = true"
    @mouseleave="mouseOverControls = false"
    :style="{
      opacity:
        fullscreen && hideControls && !mouseOverControls && !paused
          ? 0
          : fullscreen
          ? 0.7
          : 1,
    }"
  >
    <v-card-actions class="timeline py-1 px-0 mx-3">
      <v-slider
        :value="seeking ? seekTime : currentTime"
        hide-details
        min="0"
        step="0.1"
        :max="duration"
        @start="startSeeking($event)"
        @end="seek($event)"
        @mousedown="handleMouseSeek($event)"
      />
      <Mark
        v-for="(mark, i) in markers"
        :key="i"
        :mark="mark"
        :position="`left: ${(mark.time / duration) * 100}%;`"
      />
    </v-card-actions>
    <v-card-actions class="buttons pa-1">
      <v-btn-toggle class="remove-active compact">
        <v-btn
          @click="paused ? play() : pause()"
          small
          class="ml-1"
          :title="paused ? 'Play' : 'Pause'"
        >
          <v-icon v-if="paused">mdi-play</v-icon>
          <v-icon v-else>mdi-pause</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle class="mx-2 remove-active compact">
        <v-btn
          @click="prev"
          small
          :disabled="isPrevDisabled"
          title="Previous Video"
        >
          <v-icon>mdi-skip-previous</v-icon>
        </v-btn>
        <v-btn @click="stop" small title="Stop Playing">
          <v-icon>mdi-stop</v-icon>
        </v-btn>
        <v-btn
          @click="next"
          small
          :disabled="isNextDisabled"
          title="Next Video"
        >
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle class="remove-active compact">
        <v-btn
          @click="toggleFullscreen"
          small
          :title="fullscreen ? 'Exit Fullscreen' : 'Fullscreen'"
        >
          <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>
        <v-btn
          @click="togglePictureInPicture"
          class="toggle-picture-in-picture"
          small
          title="Picture-in-Picture Mode"
        >
          <v-icon size="20">mdi-picture-in-picture-bottom-right</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle class="ml-4 remove-active compact fast-seek">
        <v-btn @click="jumpToSeconds(-5)" small title="- 5 seconds">
          <v-icon small>mdi-step-backward-2</v-icon>
        </v-btn>
        <v-btn @click="jumpToSeconds(-2)" small title="- 2 seconds">
          <v-icon small>mdi-step-backward</v-icon>
        </v-btn>
        <v-btn @click="jumpToSeconds(2)" small title="+ 2 seconds">
          <v-icon small>mdi-step-forward</v-icon>
        </v-btn>
        <v-btn @click="jumpToSeconds(5)" small title="+ 5 seconds">
          <v-icon small>mdi-step-forward-2</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle class="mx-4 remove-active marker-buttons compact">
        <v-btn
          @click="toggleMarkers"
          :color="isMarkersVisible ? 'primary' : ''"
          small
          title="Markers List"
        >
          <v-icon>mdi-map-marker</v-icon>
        </v-btn>
        <v-btn
          @click="jumpToPrevMarker"
          small
          class="marker-prev"
          title="Previous Marker"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn
          @click="jumpToNextMarker"
          small
          class="marker-next"
          title="Next Marker"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-menu offset-y nudge-top="40" nudge-right="400" attach=".controls">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" small title="Add Marker">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>

          <!-- <v-btn-toggle class="remove-active">
                  <v-btn @click="addMarker('favorite')" title="Favorite">
                    <v-icon size="20">mdi-heart</v-icon> 
                  </v-btn>
                  <v-btn @click="openDialogMarkerBookmark" title="Bookmark">
                    <v-icon size="20">mdi-bookmark</v-icon> 
                  </v-btn>
                  <v-btn v-for="m in metaMarkers" :key="m.id" :value="m.id" @click="openDialogMarkerMeta(m.id)" :title="m.settings.name">
                    <v-icon size="20">mdi-{{m.settings.icon}}</v-icon>
                  </v-btn>
                </v-btn-toggle> -->
        </v-menu>
      </v-btn-toggle>
      <v-btn-toggle class="remove-active compact">
        <v-btn
          @click="togglePlaylist"
          :color="isPlaylistVisible ? 'primary' : ''"
          small
          title="Playlist"
        >
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle class="mx-4 remove-active compact">
        <v-btn @click="setAsThumb" small title="Set Frame as Thumb">
          <v-icon>mdi-image</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-spacer></v-spacer>
      <div class="duration mx-2">
        <div class="time-start">{{ msToTime(currentTime) }}</div>
        <span class="mx-1">/</span>
        <div class="time-end">{{ msToTime(duration) }}</div>
      </div>
      <v-slider
        v-model="volume"
        value="1"
        min="0"
        step="0.05"
        max="1"
        hide-details
        :prepend-icon="volumeIcon"
        @click:prepend="toggleMute"
        class="volume"
      />
    </v-card-actions>
  </v-card>
</template>


<script>
import _ from "lodash";
import Vue from "vue";
import Mark from "./Mark.vue";

export default {
  name: "Controls",
  props: {},
  components: {
    Mark,
  },
  mounted() {},
  data: () => ({}),
  computed: {
    player: {
      get() {
        return this.$store.state.Player.player;
      },
      set(value) {
        this.$store.state.Player.player = value;
      },
    },
    playlist() {
      return this.$store.state.Player.playlist;
    },
    nowPlaying: {
      get() {
        return this.$store.state.Player.nowPlaying;
      },
      set(value) {
        this.$store.state.Player.nowPlaying = value;
      },
    },
    isPrevDisabled() {
      if (this.playlistMode.includes("shuffle")) {
        let shuffleIndex = this.playlistShuffle.indexOf(this.nowPlaying);
        return shuffleIndex == 0 && !this.playlistMode.includes("loop");
      } else return this.nowPlaying == 0 && !this.playlistMode.includes("loop");
    },
    isNextDisabled() {
      if (this.playlistMode.includes("shuffle")) {
        let shuffleIndex = this.playlistShuffle.indexOf(this.nowPlaying);
        return (
          shuffleIndex + 1 >= this.playlist.length &&
          !this.playlistMode.includes("loop")
        );
      } else
        return (
          this.nowPlaying + 1 >= this.playlist.length &&
          !this.playlistMode.includes("loop")
        );
    },
    volumeIcon() {
      if (this.muted) return "mdi-volume-mute";
      if (this.volume > 0.7) return "mdi-volume-high";
      if (this.volume > 0.3) return "mdi-volume-medium";
      return "mdi-volume-low";
    },
    fullscreen() {
      return this.$store.state.Player.fullscreen;
    },
    playlistShuffle() {
      return this.$store.state.Player.playlistShuffle;
    },
    isPlaylistVisible: {
      get() {
        return this.$store.state.Player.playlistVisible;
      },
      set(value) {
        this.$store.state.Player.playlistVisible = value;
      },
    },
    isMarkersVisible: {
      get() {
        return this.$store.state.Player.markersVisible;
      },
      set(value) {
        this.$store.state.Player.markersVisible = value;
      },
    },
    markers() {
      return this.$store.state.Player.markers;
    },
    volume: {
      get() {
        return this.$store.state.Player.volume;
      },
      set(value) {
        this.$store.state.Player.volume = value;
      },
    },
    duration() {
      return this.$store.state.Player.duration;
    },
    muted: {
      get() {
        return this.$store.state.Player.muted;
      },
      set(value) {
        this.$store.state.Player.muted = value;
      },
    },
    paused() {
      return this.$store.state.Player.paused;
    },
    seeking: {
      get() {
        return this.$store.state.Player.seeking;
      },
      set(value) {
        this.$store.state.Player.seeking = value;
      },
    },
    seekTime: {
      get() {
        return this.$store.state.Player.seekTime;
      },
      set(value) {
        this.$store.state.Player.seekTime = value;
      },
    },
    currentTime() {
      return this.$store.state.Player.currentTime;
    },
    hideControls() {
      return this.$store.state.Player.hideControls;
    },
    mouseOverControls: {
      get() {
        return this.$store.state.Player.mouseOverControls;
      },
      set(value) {
        this.$store.state.Player.mouseOverControls = value;
      },
    },
    playlistMode() {
      return this.$store.state.Player.playlistMode;
    },
  },
  methods: {
    msToTime(time) {
      return Vue.prototype.$getReadableDuration(time);
    },
    // ***************************************************************
    // *************************** CONTROLS **************************
    // ***************************************************************
    toggleFullscreen() {
      this.$emit("toggleFullscreen");
    },
    togglePictureInPicture() {
      this.$emit("togglePictureInPicture");
    },
    play() {
      this.$store.dispatch("playerPlay");
    },
    pause() {
      this.$store.dispatch("playerPause");
    },
    stop() {
      this.$store.dispatch("playerStop");
    },
    togglePause() {
      this.paused ? this.play() : this.pause();
    },
    prev() {
      if (this.isPrevDisabled) return;
      let isLoopMode = this.playlistMode.includes("loop");

      if (this.playlistMode.includes("shuffle")) {
        let shuffleIndex = this.playlistShuffle.indexOf(this.nowPlaying);
        shuffleIndex = shuffleIndex - 1;
        if (isLoopMode && shuffleIndex < 0)
          shuffleIndex = this.playlist.length - 1; // if loop mode
        this.nowPlaying = this.playlistShuffle[shuffleIndex];
      } else {
        this.nowPlaying = this.nowPlaying - 1;
        if (isLoopMode && this.nowPlaying < 0)
          this.nowPlaying = this.playlist.length - 1; // if loop
      }
      this.$emit("play", this.playlist[this.nowPlaying]);
      if (this.isPlaylistVisible) this.$root.$emit("scrollToNowPlaying");
    },
    next() {
      if (this.isNextDisabled) return;
      let isLoopMode = this.playlistMode.includes("loop");

      if (this.playlistMode.includes("shuffle")) {
        let shuffleIndex = this.playlistShuffle.indexOf(this.nowPlaying);
        shuffleIndex = shuffleIndex + 1;
        if (isLoopMode && shuffleIndex == this.playlist.length)
          shuffleIndex = 0; // if loop mode
        this.nowPlaying = this.playlistShuffle[shuffleIndex];
      } else {
        this.nowPlaying = this.nowPlaying + 1;
        if (isLoopMode && this.nowPlaying > this.playlist.length - 1)
          this.nowPlaying = 0; // if loop mode
      }
      this.$emit("play", this.playlist[this.nowPlaying]);

      if (this.isPlaylistVisible) this.$root.$emit("scrollToNowPlaying");
    },
    startSeeking(time) {
      this.seeking = true;
      this.seekTime = time;
    },
    seek(time) {
      this.seeking = false;
      this.jumpTo(time);
    },
    jumpTo(time) {
      this.$store.dispatch("playerJumpTo", { time });
    },
    jumpToSeconds(time) {
      this.jumpTo(this.player.currentTime + time);
    },
    jumpToPrevMarker() {
      let markers = _.orderBy(this.markers, "time", ["desc"]);
      let currentTime = this.player.currentTime - 5;
      for (let marker of markers) {
        if (marker.time < currentTime) {
          this.jumpTo(marker.time);
          break;
        }
      }
    },
    jumpToNextMarker() {
      let markers = this.markers;
      let currentTime = this.player.currentTime;
      for (let marker of markers) {
        if (marker.time > currentTime) {
          this.jumpTo(marker.time);
          break;
        }
      }
    },
    toggleMute() {
      this.player.muted = !this.player.muted;
      this.muted = !this.muted;
    },
    handleMouseSeek(e) {
      let btnCode = e.button;
      switch (btnCode) {
        // case 0: // clearInterval(this.currentTimeTracker); break
        // case 1: // clearInterval(this.currentTimeTracker); break
        // case 2: // clearInterval(this.currentTimeTracker); break
        case 3:
          this.jumpToPrevMarker();
          break;
        case 4:
          this.jumpToNextMarker();
          break;
      }
    },
    toggleMarkers() {
      this.isMarkersVisible = !this.isMarkersVisible;
    },
    togglePlaylist() {
      this.isPlaylistVisible = !this.isPlaylistVisible;
      if (!this.isPlaylistVisible) return;
      this.$root.$emit("scrollToNowPlaying");
    },
    async setAsThumb() {
      let video = this.playlist[this.nowPlaying];
      let imgPath = "/userfiles/media/thumbs/" + video.id + ".jpg";
      let time = new Date(this.player.currentTime * 1000)
        .toISOString()
        .substr(11, 8);
      await Vue.prototype
        .$createThumb(time, video.path, imgPath, 320, true)
        .then(() => {
          this.$root.$emit("updateVideoThumb", video.id);
        })
        .catch((e) => console.log(e));
    },
  },
  watch: {},
};
</script>


<style lang="scss">
</style>