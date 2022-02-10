<template>
  <v-dialog :value="p.active" @input="closePlayer" eager>
    <div
      ref="player"
      class="player"
      :class="{ fullscreen: p.fullscreen }"
      id="player"
      @mousedown="stopSmoothScroll($event)"
      @mousemove="moveOverPlayer"
    >
      <div class="player-wrapper">
        <div
          class="video-wrapper"
          @click="togglePause"
          @dblclick="toggleFullscreen"
          @click.middle="toggleFullscreen"
          @mousedown="clickOnVideo($event)"
          @wheel="changeVolume"
          @keydown="handleKey"
          tabindex="-1"
        >
          <video ref="videoPlayer" autoplay />

          <div v-if="p.playbackError && reg" class="video-error">
            <v-icon size="60" color="red">mdi-alert</v-icon>
            <div>{{ getFileNameFromPath(p.playlist[p.nowPlaying].path) }}</div>
            <div class="mb-4">Video format not supported.</div>
            <v-btn @click="playVideoInSystemPlayer" color="primary" small>
              <v-icon left>mdi-television-play</v-icon>
              <span>Play in the system player</span>
            </v-btn>
          </div>

          <div v-if="!reg && p.nowPlaying > 9" class="reg-block">
            <div class="mb-2">Application not registered</div>
            <div class="caption">
              In the unregistered version, you can only play the first 5 videos
              of the playlist.
            </div>
          </div>

          <div v-if="p.playbackError" class="video-error">
            <v-icon size="60" color="red">mdi-alert</v-icon>
            <div>{{ getFileNameFromPath(p.playlist[p.nowPlaying].path) }}</div>
            <div class="mb-4">The video file is missing.</div>
          </div>

          <v-chip
            v-show="p.statusText"
            class="status-text ma-2"
            color="#00000066"
            dark
          >
            <v-icon dark left>mdi-{{ p.statusIcon }}</v-icon>
            {{ p.statusText }}
          </v-chip>
        </div>

        <Controls
          ref="controls"
          v-show="isControlsVisible"
          @toggleFullscreen="toggleFullscreen"
          @togglePictureInPicture="togglePictureInPicture"
          @play="playVideoObject($event)"
          @showControls="showControls"
        />
      </div>
      <Playlist @play="playVideoObject($event)" />
      <Marks />
    </div>
  </v-dialog>
</template>


<script>
import _ from "lodash";
import Vue from "vue";
import axios from "axios";
import vuescroll from "vuescroll";
import Controls from "./player/Controls.vue";
import Playlist from "./player/Playlist.vue";
import Marks from "./player/Marks.vue";
import Keys from "@/mixins/Keys";
const path = require("path");

export default {
  name: "Player",
  components: {
    vuescroll,
    Controls,
    Playlist,
    Marks,
  },
  mixins: [Keys],
  mounted() {
    this.p.player = this.$refs.videoPlayer;
    this.initPlayer();
    document.addEventListener("mousemove", this.controlsMove, false);
    document.addEventListener("mouseup", this.controlsUp, false);
    this.$root.$on("playVideo", (video, videos) => {
      this.p.playlist = videos.map((i) => ({
        ...i,
        ...{ thumb: path.join(__dirname, "/images/ghost.png") },
      }));
      this.loadSrc(video);
    });
  },
  data: () => ({
    timeoutControls: -1,
    isControlsVisible: true,
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
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
    closePlayer() {
      this.p.player.pause();
      this.p.player.src = null;
      this.p.currentTime = 0;
      this.p.active = false;
      this.p.paused = false;
    },
    initPlayer() {
      this.p.player.addEventListener("loadedmetadata", () => {
        this.p.duration = this.p.player.duration;
      });
      this.p.player.addEventListener("ended", () => {
        if (this.p.playlistMode.includes("autoplay"))
          this.$refs.controls.next();
      });
      this.p.player.addEventListener("error", () => {
        this.p.playbackError = true;
      });
    },
    loadSrc(video) {
      this.p.player.src = this.apiUrl + "/api/video/" + video.id;
      this.getMarks(video);
      this.$store.commit("trackCurrentTime");
      let fileName = this.getFileNameFromPath(video.path);
      this.p.nowPlaying = _.findIndex(this.p.playlist, (i) => i.id == video.id);
      this.$store.dispatch("changePlayerStatusText", {
        text: `${this.p.nowPlaying + 1}. ${fileName}`,
        icon: "playlist-play",
      });
      this.p.playbackError = false;
      if (!this.reg && this.p.nowPlaying > 9) this.p.player.src = "";
    },
    getFileNameFromPath(filePath) {
      return Vue.prototype.$getFileNameFromPath(filePath);
    },
    async getMarks(video) {
      await axios
        .get(this.apiUrl + "/api/Mark/video/" + video.id)
        .then((res) => {
          this.p.marks = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
      // creating mark thumb
      for (let mark of this.p.marks) {
        let time = new Date(1000 * mark.time).toISOString().substr(11, 8);
        let imgPath = "/userfiles/media/marks/" + mark.id + ".jpg";
        await Vue.prototype
          .$createThumb(time, video.path, imgPath, 180)
          .then(() => {
            this.$root.$emit("updateMarkImage", mark.id);
          })
          .catch((e) => console.log(e));
      }
    },
    toggleFullscreen() {
      this.showControls();
      if (this.p.fullscreen) document.exitFullscreen();
      else document.getElementById("player").requestFullscreen();
      this.p.fullscreen = !this.p.fullscreen;
    },
    async togglePictureInPicture() {
      this.showControls();
      if (this.p.player !== document.pictureInPictureElement) {
        await this.p.player.requestPictureInPicture();
      } else await document.exitPictureInPicture();
    },
    playVideoInSystemPlayer() {
      // TODO remake this
      shell.openPath(this.p.playlist[this.p.nowPlaying].path);
    },
    // ***************************************************************
    // *************************** CONTROLS **************************
    // ***************************************************************
    stopSmoothScroll(event) {
      if (event.button != 1) return;
      event.preventDefault();
      event.stopPropagation();
    },
    changeVolume(e) {
      let volume = (this.p.player.volume - e.deltaY / 1000 / 2).toFixed(2);
      if (volume < 0) volume = 0;
      if (volume > 1) volume = 1;
      this.p.player.volume = volume;
      this.p.volume = volume;
      this.$store.dispatch("changePlayerStatusText", {
        text: (volume * 100).toFixed() + " %",
        icon: "volume-high",
      });
    },
    handleKey(e) {
      switch (true) {
        case e.key === " ":
          this.togglePause();
          break;
        case e.key === "ArrowRight":
          this.$store.dispatch("playerJumpTo", {
            time: this.p.player.currentTime + 10,
          });
          break;
        case e.key === "ArrowLeft":
          this.$store.dispatch("playerJumpTo", {
            time: this.p.player.currentTime - 10,
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
          this.$refs.controls.toggleMarks();
          break;
        case e.key === ",":
          this.$refs.controls.jumpToPrevMark();
          break;
        case e.key === ".":
          this.$refs.controls.jumpToNextMark();
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
          this.addMark("favorite"); // TODO make it
          break;
        case e.key === "2":
          this.openDialogMarkBookmark(); // TODO make it
          break;
        case e.key === "Escape":
          this.p.fullscreen ? this.toggleFullscreen() : "";
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
    playVideoObject(video) {
      this.loadSrc(video);
    },
    togglePause() {
      this.$refs.controls.togglePause();
    },
    moveOverPlayer(e) {
      if (!e.movementX > 0 || !e.movementY > 0) return;
      this.showControls();
      if (!this.p.fullscreen || this.p.mouseOverControls) return;
      if (this.p.paused) return;
      this.timeoutControls = setTimeout(() => {
        this.isControlsVisible = false;
      }, 1000);
    },
    showControls() {
      this.isControlsVisible = true;
      clearTimeout(this.timeoutControls);
    },
  },
  watch: {
    "p.volume"(newValue, oldValue) {
      if (newValue !== oldValue) this.p.player.volume = newValue;
    },
  },
};
</script>