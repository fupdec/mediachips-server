<template>
  <v-dialog :value="isPlayerActive" @input="closePlayer" eager>
    <div
      ref="player"
      class="player"
      :class="{ fullscreen }"
      id="player"
      @mousedown="stopSmoothScroll($event)"
      @mousemove="moveOverPlayer"
    >
      <div class="player-wrapper">
        <div
          class="video-wrapper"
          @click="paused ? play() : pause()"
          @dblclick="toggleFullscreen"
          @click.middle="toggleFullscreen"
          @mousedown="clickOnVideo($event)"
          @wheel="changeVolume"
          @keydown="handleKey"
          tabindex="-1"
        >
          <video ref="videoPlayer" autoplay />
          <div v-if="playbackError && reg" class="video-error">
            <v-icon size="60" color="red">mdi-alert</v-icon>
            <div>{{ getFileNameFromPath(playlist[nowPlaying].path) }}</div>
            <div class="mb-4">Video format not supported.</div>
            <v-btn @click="playVideoInSystemPlayer" color="primary" small>
              <v-icon left>mdi-television-play</v-icon>
              <span>Play in the system player</span>
            </v-btn>
          </div>
          <div v-if="!reg && nowPlaying > 4" class="reg-block">
            <div class="mb-2">Application not registered</div>
            <div class="caption">
              In the unregistered version, you can only play the first 5 videos
              of the playlist.
            </div>
          </div>
          <div v-if="playbackError" class="video-error">
            <v-icon size="60" color="red">mdi-alert</v-icon>
            <div>{{ getFileNameFromPath(playlist[nowPlaying].path) }}</div>
            <div class="mb-4">The video file is missing.</div>
          </div>
          <div v-show="statusText" class="status-text">
            <v-icon dark left>mdi-{{ statusIcon }}</v-icon>
            {{ statusText }}
          </div>
        </div>
        <Controls
          ref="controls"
          v-show="isControlsVisible"
          @toggleFullscreen="toggleFullscreen"
          @togglePictureInPicture="togglePictureInPicture"
          @play="playVideoObject($event)"
        />
      </div>
      <Playlist @play="playVideoObject($event)" />
      <Markers />
    </div>
  </v-dialog>
</template>


<script>
const path = require("path");

import _ from "lodash";
import Vue from "vue";
import axios from "axios";
import vuescroll from "vuescroll";
import Controls from "./player/Controls.vue";
import Playlist from "./player/Playlist.vue";
import Markers from "./player/Markers.vue";

export default {
  name: "Player",
  components: {
    vuescroll,
    Controls,
    Playlist,
    Markers,
  },
  mounted() {
    this.player = this.$refs.videoPlayer;
    this.initPlayer();
    document.addEventListener("mousemove", this.controlsMove, false);
    document.addEventListener("mouseup", this.controlsUp, false);
    this.$root.$on("playVideo", (video, videos) => {
      this.playlist = videos.map((i) => ({
        ...i,
        ...{ thumb: path.join(__dirname, "/images/ghost.png") },
      }));
      this.loadSrc(video);
    });
  },
  data: () => ({
    moveTimeout: -1,
    isControlsVisible: true,
    reg: true,
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    player: {
      get() {
        return this.$store.state.Player.player;
      },
      set(value) {
        this.$store.state.Player.player = value;
      },
    },
    statusText() {
      return this.$store.state.Player.statusText;
    },
    statusIcon() {
      return this.$store.state.Player.statusIcon;
    },
    fullscreen: {
      get() {
        return this.$store.state.Player.fullscreen;
      },
      set(value) {
        this.$store.state.Player.fullscreen = value;
      },
    },
    isPlayerActive: {
      get() {
        return this.$store.state.Player.active;
      },
      set(value) {
        this.$store.state.Player.active = value;
      },
    },
    playlist: {
      get() {
        return this.$store.state.Player.playlist;
      },
      set(value) {
        this.$store.state.Player.playlist = value;
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
    volume: {
      get() {
        return this.$store.state.Player.volume;
      },
      set(value) {
        this.$store.state.Player.volume = value;
      },
    },
    duration: {
      get() {
        return this.$store.state.Player.duration;
      },
      set(value) {
        this.$store.state.Player.duration = value;
      },
    },
    paused() {
      return this.$store.state.Player.paused;
    },
    currentTime: {
      get() {
        return this.$store.state.Player.currentTime;
      },
      set(value) {
        this.$store.state.Player.currentTime = value;
      },
    },
    playbackError: {
      get() {
        return this.$store.state.Player.playbackError;
      },
      set(value) {
        this.$store.state.Player.playbackError = value;
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
    mouseOverControls() {
      return this.$store.state.Player.mouseOverControls;
    },
  },
  methods: {
    closePlayer() {
      this.player.pause();
      this.player.src = null;
      this.currentTime = 0;
      this.isPlayerActive = false;
    },
    initPlayer() {
      this.player.addEventListener("loadedmetadata", () => {
        this.duration = this.player.duration;
      });
      this.player.addEventListener("ended", () => {
        if (this.playlistMode.includes("autoplay")) this.$refs.controls.next();
      });
      this.player.addEventListener("error", () => {
        this.playbackError = true;
      });
    },
    loadSrc(video) {
      this.player.src = this.apiUrl + "/api/video/" + video.id;
      this.getMarkers(video);
      this.$store.commit("trackCurrentTime");
      let fileName = this.getFileNameFromPath(video.path);
      this.nowPlaying = _.findIndex(this.playlist, (i) => i.id == video.id);
      this.$store.dispatch("changePlayerStatusText", {
        text: `${this.nowPlaying + 1}. ${fileName}`,
        icon: "playlist-play",
      });
      this.playbackError = false;
      if (!this.reg && this.nowPlaying > 4) this.player.src = "";
    },
    getFileNameFromPath(filePath) {
      return Vue.prototype.$getFileNameFromPath(filePath);
    },
    async getMarkers(video) {
      await axios
        .get(this.apiUrl + "/api/Markers/video/" + video.id)
        .then((res) => {
          this.markers = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
      // creating mark thumb
      for (let mark of this.markers) {
        let time = new Date(1000 * mark.time).toISOString().substr(11, 8);
        let imgPath = "/userfiles/media/markers/" + mark.id + ".jpg";
        await Vue.prototype
          .$createThumb(time, video.path, imgPath, 180)
          .then(() => {
            this.$root.$emit("updateMarkerImage", mark.id);
          })
          .catch((e) => console.log(e));
      }
    },
    moveOverPlayer(e) {
      if (!e.movementX > 0 || !e.movementY > 0) return;
      if (!this.fullscreen || this.mouseOverControls) {
        this.isControlsVisible = true;
        clearTimeout(this.moveTimeout);
        return;
      }
      this.isControlsVisible = true;
      clearTimeout(this.moveTimeout);
      this.moveTimeout = setTimeout(() => {
        this.isControlsVisible = false;
      }, 1000);
    },
    toggleFullscreen() {
      if (this.fullscreen) document.exitFullscreen();
      else document.getElementById("player").requestFullscreen();
      this.fullscreen = !this.fullscreen;
      this.isControlsVisible = true;
    },
    async togglePictureInPicture() {
      if (this.player !== document.pictureInPictureElement) {
        await this.player.requestPictureInPicture();
      } else await document.exitPictureInPicture();
    },
    playVideoInSystemPlayer() {
      // TODO remake this
      shell.openPath(this.playlist[this.nowPlaying].path);
    },
    // ***************************************************************
    // *************************** CONTROLS **************************
    // ***************************************************************
    stopSmoothScroll(event) {
      if (event.button != 1) return;
      event.preventDefault();
      event.stopPropagation();
    },
    play() {
      this.$store.dispatch("playerPlay");
    },
    pause() {
      this.$store.dispatch("playerPause");
    },
    changeVolume(e) {
      let volume = (this.player.volume - e.deltaY / 1000 / 2).toFixed(2);
      if (volume < 0) volume = 0;
      if (volume > 1) volume = 1;
      this.player.volume = volume;
      this.volume = volume;
      this.$store.dispatch("changePlayerStatusText", {
        text: (volume * 100).toFixed() + " %",
        icon: "volume-high",
      });
    },
    handleKey(e) {
      switch (true) {
        case e.key === " ":
          this.$refs.controls.togglePause();
          break;
        case e.key === "ArrowRight":
          this.$store.dispatch("playerJumpTo", {
            time: this.player.currentTime + 10,
          });
          break;
        case e.key === "ArrowLeft":
          this.$store.dispatch("playerJumpTo", {
            time: this.player.currentTime - 10,
          });
          break;
        case e.key === "ArrowUp":
          this.changeVolume({ deltaY: -100 });
          break;
        case e.key === "ArrowDown":
          this.changeVolume({ deltaY: +100 });
          break;
        case e.key === "f":
          this.toggleFullscreen();
          break;
        case e.key === "p":
          this.$refs.controls.togglePlaylist();
          break;
        case e.key === "m":
          this.$refs.controls.toggleMarkers();
          break;
        case e.key === ",":
          this.$refs.controls.jumpToPrevMarker();
          break;
        case e.key === ".":
          this.$refs.controls.jumpToNextMarker();
          break;
        case e.key === "z":
          this.$refs.controls.prev();
          break;
        case e.key === "c":
          this.$refs.controls.next();
          break;
        case e.key === "x":
          this.$refs.controls.stop();
          break;
        case e.key === "1":
          this.addMarker("favorite"); // TODO make it
          break;
        case e.key === "2":
          this.openDialogMarkerBookmark(); // TODO make it
          break;
        case e.key === "Escape":
          this.fullscreen ? this.toggleFullscreen() : "";
          break;
      }
    },
    clickOnVideo(e) {
      let btnCode = e.button;
      switch (btnCode) {
        case 3:
          this.$refs.controls.prev();
          break;
        case 4:
          this.$refs.controls.next();
          break;
      }
    },
    // ***************************************************************
    // *************************** Emitted ***************************
    // ***************************************************************
    playVideoObject(video) {
      this.loadSrc(video);
    },
  },
  watch: {
    volume(newValue, oldValue) {
      if (newValue !== oldValue) this.player.volume = newValue;
    },
  },
};
</script>