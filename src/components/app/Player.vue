<template>
  <v-dialog :value="p.active" @input="closePlayer" eager width="2000">
    <div
      @mousedown="stopSmoothScroll($event)"
      @mousemove="moveOverPlayer"
      :class="{ fullscreen: p.fullscreen }"
      class="player"
      ref="player"
      id="player"
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
            <div>Video format not supported or file is missing</div>
            <v-btn @click.stop="openPath" class="mt-4" color="primary" small>
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
          @changeVolume="changeVolume($event)"
          @showControls="showControls"
          @addMark="openAddingMark($event)"
        />
      </div>
      <Playlist @play="playVideoObject($event)" />
      <Marks />
      <DialogMarkAdding
        v-if="$store.state.Dialogs.markAdding.show"
        @togglePause="togglePause"
        @addMark="addMark($event)"
      />
      <DialogDeleteConfirm
        v-if="p.markDel.show"
        @close="p.markDel.show = false"
        @delete="deleteMark"
        :dialog="p.markDel.show"
        :text="p.markDel.text"
      />
    </div>
  </v-dialog>
</template>


<script>
import Vue from "vue";
import axios from "axios";
import Controls from "@/components/app/player/Controls.vue";
import Playlist from "@/components/app/player/Playlist.vue";
import Marks from "@/components/app/player/Marks.vue";
const path = require("path");

export default {
  name: "Player",
  components: {
    Controls,
    Playlist,
    Marks,
    DialogMarkAdding: () => import("@/components/dialogs/DialogMarkAdding.vue"),
    DialogDeleteConfirm: () =>
      import("@/components/dialogs/DialogDeleteConfirm.vue"),
  },
  mounted() {
    this.p.player = this.$refs.videoPlayer;
    this.initPlayer();
    document.addEventListener("mousemove", this.controlsMove, false);
    document.addEventListener("mouseup", this.controlsUp, false);
    this.$root.$on("playVideo", (video, videos) => {
      this.p.playlist = videos.map((i) => ({
        ...i,
        ...{ thumb: path.join(__dirname, "/images/unavailable.png") },
      }));
      this.loadSrc(video);
    });
  },
  beforeDestroy() {
    this.$root.$off("playVideo");
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
    page() {
      return this.$store.state.Page;
    },
    sets() {
      return this.$store.state.settings;
    },
    markAdding: {
      get() {
        return this.$store.state.Dialogs.markAdding;
      },
      set(value) {
        this.$store.state.Dialogs.markAdding = value;
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
    async closePlayer() {
      await this.updatePlaybackTime(this.video);
      this.p.player.pause();
      this.p.player.src = null;
      this.p.currentTime = 0;
      this.p.active = false;
      this.p.paused = false;
      document.title = this.page.name + " - mediaChips";
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
    async loadSrc(video) {
      this.p.player.src = this.apiUrl + "/api/video/" + video.id;
      this.getMarks(video);
      await this.getMetadata(video);
      this.$store.commit("trackCurrentTime");
      let fileName = this.getFileNameFromPath(video.path);
      this.p.nowPlaying = _.findIndex(this.p.playlist, (i) => i.id == video.id);
      this.p.player.playbackRate = this.p.speed;
      if (this.sets.restorePlaybackTime == "1")
        this.p.player.currentTime = this.p.metadata.time || 0;
      this.p.playbackError = false;
      this.markAdding.show = false;
      document.title = `Playing: ${fileName}` + " - mediaChips";
      if (!this.reg && this.p.nowPlaying > 9) this.p.player.src = "";
      this.$store.dispatch("changePlayerStatusText", {
        text: `${this.p.nowPlaying + 1}. ${fileName}`,
        icon: "playlist-play",
      });
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
        let time = new Date(1000 * mark.time).toISOString().substr(11, 12);
        let imgPath = path.join(
          this.$store.state.mediaPath,
          "videos/marks",
          `${mark.id}.jpg`
        );
        let res = await Vue.prototype.$checkFileExists(imgPath, true);
        if (res.status == 201) {
          this.$root.$emit("updateMarkImage", mark.id);
          continue;
        }
        await Vue.prototype
          .$createThumb(time, video.path, imgPath, 180)
          .then(() => {
            this.$root.$emit("updateMarkImage", mark.id);
          })
          .catch((e) => console.log(e));
      }
    },
    openPath() {
      Vue.prototype.$openPath(this.video.path, false);
    },
    stopSmoothScroll(event) {
      if (event.button != 1) return;
      event.preventDefault();
      event.stopPropagation();
    },
    // ***************************************************************
    // *************************** CONTROLS **************************
    // ***************************************************************
    toggleFullscreen() {
      this.showControls();
      if (this.p.fullscreen) {
        screen.orientation.unlock();
        document.exitFullscreen();
      } else {
        document.getElementById("player").requestFullscreen();
        screen.orientation
          .lock("landscape")
          .then(() => {
            // alert("Locked");
          })
          .catch((error) => {
            // alert(error);
          });
      }
      this.p.fullscreen = !this.p.fullscreen;
    },
    async togglePictureInPicture() {
      this.showControls();
      if (this.p.fullscreen) {
        document.exitFullscreen();
        this.p.fullscreen = false;
      }
      if (document.pictureInPictureElement) document.exitPictureInPicture();
      else if (document.pictureInPictureEnabled)
        this.p.player.requestPictureInPicture();
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
        case e.key === "m":
          this.$refs.controls.toggleMute();
          break;
        case e.key === "p":
          this.$refs.controls.togglePlaylist();
          break;
        case e.key === "i":
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
          this.addMark("favorite");
          break;
        case e.key === "2":
          this.openAddingMark("bookmark");
          break;
        case e.key === "Escape":
          if (this.p.fullscreen) this.toggleFullscreen(); // TODO fix it
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
    playVideoObject(videos) {
      const { n, o } = videos;
      this.updatePlaybackTime(o).then(() => {
        this.loadSrc(n);
      });
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
    openAddingMark(type) {
      this.markAdding.time = this.p.currentTime;
      if (type === "favorite") {
        this.markAdding.type = "favorite";
        this.addMark("favorite");
      } else if (type === "bookmark") {
        this.markAdding.type = "bookmark";
        this.markAdding.show = true;
      } else {
        this.markAdding.type = "meta";
        this.markAdding.meta = type;
        this.markAdding.show = true;
      }
    },
    addMark(data) {
      let mark = {
        type: this.markAdding.type,
        time: this.markAdding.time,
        mediaId: this.video.id,
      };
      if (data === "favorite") {
        mark.time = this.p.currentTime;
        mark.type = data;
      } else mark = { ...mark, ...data };
      axios({
        method: "post",
        url: this.apiUrl + "/api/mark",
        data: mark,
      })
        .then((res) => {
          this.$store.dispatch("changePlayerStatusText", {
            text: `Mark added`,
            icon: "tooltip-plus",
          });
          this.getMarks(this.video);
        })
        .catch((e) => {
          // console.log(e);
        });
    },
    async deleteMark() {
      this.p.markDel.show = false;
      let id = this.p.markDel.mark.id;
      let imgPath = path.join(
        this.$store.state.mediaPath,
        "videos/marks",
        `${id}.jpg`
      );
      await axios.delete(this.apiUrl + "/api/mark/" + id);
      await Vue.prototype.$deleteLocalImage(imgPath);
      await this.getMarks(this.video);
    },
    getMetadata(video) {
      return new Promise((resolve, reject) => {
        axios
          .get(this.apiUrl + "/api/videoMetadata/" + video.id)
          .then((res) => {
            this.p.metadata = res.data;
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    updatePlaybackTime(video) {
      return new Promise((resolve, reject) => {
        axios({
          method: "put",
          url: this.apiUrl + "/api/videoMetadata/" + video.id,
          data: {
            time: this.p.currentTime,
          },
        })
          .then(() => {
            this.$root.$emit("updateVideoMetadata", video.id);
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
  },
  watch: {
    "p.volume"(newValue, oldValue) {
      if (newValue !== oldValue) this.p.player.volume = newValue;
    },
  },
};
</script>