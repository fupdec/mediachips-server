<template>
  <div
    @mouseenter="p.mouseOverControls = true"
    @mouseleave="p.mouseOverControls = false"
    class="controls px-6"
  >
    <v-card-actions @wheel="wheelSeek" class="timeline pa-0">
      <v-slider
        :value="p.seeking ? p.seekTime : p.currentTime"
        @start="startSeeking($event)"
        @end="seek($event)"
        @mousedown="handleMouseSeek($event)"
        track-color="#ffffff60"
        class="pt-4"
        color="white"
        step="0.1"
        min="0"
        :max="p.duration"
        hide-details
      />

      <Mark
        v-for="(i, x) in p.marks"
        :key="x"
        :mark="i"
        :position="`left: calc(${(i.time / p.duration) * 100}%);`"
      />
    </v-card-actions>

    <v-card-actions class="buttons pb-4 px-0 pt-0">
      <v-btn @click="p.paused ? play() : pause()" icon dark>
        <v-icon v-if="p.paused" large>mdi-play</v-icon>
        <v-icon v-else large>mdi-pause</v-icon>
        <div class="tip" style="left: 0">
          <span class="mr-2" v-html="p.paused ? 'Play' : 'Pause'" />
          <b class="kbd" v-html="'Space'" />
        </div>
      </v-btn>

      <!-- NAVIGATION -->
      <v-chip outlined dark class="px-0 ml-3">
        <v-btn @click="prev" :disabled="isPrevDisabled" icon dark>
          <v-icon>mdi-skip-previous</v-icon>
          <div v-if="!isPrevDisabled && prevVideo" class="tip" style="left: 0">
            <div class="video-thumb">
              <div>
                <span class="overline mr-2">Previous Video:</span>
                <b class="kbd" v-html="'z'" />
              </div>
              <v-img
                :src="prevVideo.thumb"
                :aspect-ratio="16 / 9"
                width="300px"
                class="mt-1 mb-2"
              />
              <div class="name">{{ getFileNameFromPath(prevVideo.path) }}</div>
            </div>
          </div>
        </v-btn>

        <v-btn @click="stop" icon dark>
          <v-icon>mdi-stop</v-icon>
          <div class="tip">
            <span class="mr-2" v-html="'Stop Playing'" />
            <b class="kbd" v-html="'x'" />
          </div>
        </v-btn>

        <v-btn @click="next" :disabled="isNextDisabled" icon dark>
          <v-icon>mdi-skip-next</v-icon>
          <div v-if="!isNextDisabled && nextVideo" class="tip" style="left: 0">
            <div class="video-thumb">
              <div>
                <span class="overline mr-2">Next Video:</span>
                <b class="kbd" v-html="'c'" />
              </div>
              <v-img
                :src="nextVideo.thumb"
                :aspect-ratio="16 / 9"
                width="300px"
                class="mt-1 mb-2"
              />
              <div class="name">{{ getFileNameFromPath(nextVideo.path) }}</div>
            </div>
          </div>
        </v-btn>
      </v-chip>

      <!-- TIME -->
      <v-btn
        @click="p.timeRemain = !p.timeRemain"
        class="time px-2 mx-2 body-2"
        text
        rounded
        small
        dark
      >
        <div v-if="!p.timeRemain">{{ msToTime(p.currentTime) }}</div>
        <div v-else>- {{ msToTime(p.duration - p.currentTime) }}</div>
        <span class="mx-1">/</span>
        <div>{{ msToTime(p.duration) }}</div>
        <div
          v-html="'Switch between elapsed and remaining time'"
          class="tip body-2"
          style="left: 0"
        />
      </v-btn>

      <v-spacer></v-spacer>

      <!-- MARKS  -->
      <v-chip outlined dark class="mark-buttons px-0">
        <v-btn @click="toggleMarks" icon dark>
          <v-icon size="20">mdi-tooltip</v-icon>
          <div class="tip">
            <span class="mr-2">Marks List</span>
            <b class="kbd" v-html="'m'" />
          </div>
        </v-btn>

        <v-menu
          attach=".mark-buttons"
          nudge-top="45"
          nudge-left="10"
          min-width="150"
          top
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon dark>
              <v-icon>mdi-plus</v-icon>
              <div class="tip" v-html="'Add Mark'" />
            </v-btn>
          </template>

          <v-list dense class="py-1">
            <v-list-item @click="addMark('favorite')">
              <v-list-item-title>
                <v-icon class="mr-4" v-text="`mdi-heart`" />
                <span v-text="`Favorite`" />
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="addMark('bookmark')">
              <v-list-item-title>
                <v-icon class="mr-4" v-text="`mdi-bookmark`" />
                <span v-text="`Bookmark`" />
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              v-for="i in assigned"
              :key="i.meta.id"
              @click="addMark(i.meta)"
            >
              <v-list-item-title>
                <v-icon class="mr-4" v-text="`mdi-${i.meta.icon}`" />
                <span v-text="i.meta.name" />
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          @click="jumpToMark('prev')"
          :disabled="p.marks.length == 0"
          class="mark-prev"
          icon
          dark
        >
          <v-icon>mdi-chevron-left</v-icon>
          <div class="tip">
            <span class="mr-2">Previous Mark</span>
            <b class="kbd" v-html="'<'" />
          </div>
        </v-btn>

        <v-btn
          @click="jumpToMark('next')"
          :disabled="p.marks.length == 0"
          class="mark-next"
          icon
          dark
        >
          <v-icon>mdi-chevron-right</v-icon>
          <div class="tip">
            <span class="mr-2">Next Mark</span>
            <b class="kbd" v-html="'>'" />
          </div>
        </v-btn>
      </v-chip>

      <!-- PLAYLIST -->
      <v-chip outlined dark class="playlist-buttons px-0 mx-2">
        <v-btn @click="togglePlaylist" icon dark>
          <v-icon>mdi-playlist-play</v-icon>
          <div class="tip">
            <span class="mr-2">Playlist</span>
            <b class="kbd" v-html="'p'" />
          </div>
        </v-btn>
      </v-chip>

      <v-chip outlined dark class="action-buttons px-0">
        <v-btn @click="setAsThumb" icon dark>
          <v-icon>mdi-image-outline</v-icon>
          <div class="tip" v-html="'Set Frame as Thumb'" />
        </v-btn>
      </v-chip>

      <v-spacer></v-spacer>

      <!-- SCREEN -->
      <v-chip outlined dark class="px-0 mx-2">
        <v-btn @click="toggleFullscreen" icon dark>
          <v-icon v-if="p.fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
          <div class="tip">
            <span
              class="mr-2"
              v-html="p.fullscreen ? 'Exit Fullscreen' : 'Fullscreen'"
            />
            <b class="kbd" v-html="'f'" />
          </div>
        </v-btn>

        <v-btn
          @click="togglePictureInPicture"
          class="toggle-picture-in-picture"
          icon
          dark
        >
          <v-icon size="20">mdi-picture-in-picture-bottom-right</v-icon>
          <div class="tip" v-html="'Picture-in-Picture Mode'" />
        </v-btn>
      </v-chip>

      <!-- VOLUME -->
      <v-chip @wheel="changeVolume" outlined dark class="volume px-0">
        <v-btn @click="toggleMute" icon dark>
          <v-icon>mdi-{{ volumeIcon }}</v-icon>
          <div class="tip">
            <span class="mr-2" v-html="'Mute'" />
            <b class="kbd" v-html="'m'" />
          </div>
        </v-btn>
        <v-slider
          v-model="p.volume"
          class="volume-slider pr-2"
          color="white"
          value="1"
          min="0"
          step="0.05"
          max="1"
          hide-details
        />
      </v-chip>
    </v-card-actions>
  </div>
</template>


<script>
import Vue from "vue";
import Mark from "./Mark.vue";

export default {
  name: "Controls",
  props: {},
  components: {
    Mark,
  },
  computed: {
    assigned() {
      let list = this.$store.state.Page.assigned;
      return list.filter((i) => i.meta.metaSetting.marks);
    },
    p: {
      get() {
        return this.$store.state.Player;
      },
      set(value) {
        this.$store.state.Player = value;
      },
    },
    isPrevDisabled() {
      if (this.p.playlistMode.includes("shuffle")) {
        let shuffleIndex = this.p.playlistShuffle.indexOf(this.p.nowPlaying);
        return shuffleIndex == 0 && !this.p.playlistMode.includes("loop");
      } else
        return this.p.nowPlaying == 0 && !this.p.playlistMode.includes("loop");
    },
    isNextDisabled() {
      if (this.p.playlistMode.includes("shuffle")) {
        let shuffleIndex = this.p.playlistShuffle.indexOf(this.p.nowPlaying);
        return (
          shuffleIndex + 1 >= this.p.playlist.length &&
          !this.p.playlistMode.includes("loop")
        );
      } else
        return (
          this.p.nowPlaying + 1 >= this.p.playlist.length &&
          !this.p.playlistMode.includes("loop")
        );
    },
    prevVideo() {
      return this.p.playlist[this.p.nowPlaying - 1];
    },
    nextVideo() {
      return this.p.playlist[this.p.nowPlaying + 1];
    },
    volumeIcon() {
      if (this.p.muted) return "volume-mute";
      if (this.p.volume > 0.7) return "volume-high";
      if (this.p.volume > 0.3) return "volume-medium";
      return "volume-low";
    },
  },
  methods: {
    msToTime(time) {
      return Vue.prototype.$getReadableDuration(time);
    },
    getFileNameFromPath(filePath) {
      return Vue.prototype.$getFileNameFromPath(filePath);
    },
    toggleFullscreen() {
      this.$emit("toggleFullscreen");
    },
    togglePictureInPicture() {
      this.$emit("togglePictureInPicture");
    },
    play() {
      this.$emit("showControls");
      this.$store.dispatch("playerPlay");
    },
    pause() {
      this.$emit("showControls");
      this.$store.dispatch("playerPause");
    },
    stop() {
      this.$emit("showControls");
      this.$store.dispatch("playerStop");
    },
    togglePause() {
      this.$emit("showControls");
      this.p.paused ? this.play() : this.pause();
    },
    prev() {
      if (this.isPrevDisabled) return;
      this.p.paused = false;
      let isLoopMode = this.p.playlistMode.includes("loop");

      if (this.p.playlistMode.includes("shuffle")) {
        let shuffleIndex = this.p.playlistShuffle.indexOf(this.p.nowPlaying);
        shuffleIndex = shuffleIndex - 1;
        if (isLoopMode && shuffleIndex < 0)
          shuffleIndex = this.p.playlist.length - 1; // if loop mode
        this.p.nowPlaying = this.p.playlistShuffle[shuffleIndex];
      } else {
        this.p.nowPlaying = this.p.nowPlaying - 1;
        if (isLoopMode && this.p.nowPlaying < 0)
          this.p.nowPlaying = this.p.playlist.length - 1; // if loop
      }
      this.$emit("play", this.p.playlist[this.p.nowPlaying]);
      if (this.p.playlistVisible) this.$root.$emit("scrollToNowPlaying");
    },
    next() {
      if (this.isNextDisabled) return;
      this.p.paused = false;
      let isLoopMode = this.p.playlistMode.includes("loop");

      if (this.p.playlistMode.includes("shuffle")) {
        let shuffleIndex = this.p.playlistShuffle.indexOf(this.p.nowPlaying);
        shuffleIndex = shuffleIndex + 1;
        if (isLoopMode && shuffleIndex == this.p.playlist.length)
          shuffleIndex = 0; // if loop mode
        this.p.nowPlaying = this.p.playlistShuffle[shuffleIndex];
      } else {
        this.p.nowPlaying = this.p.nowPlaying + 1;
        if (isLoopMode && this.p.nowPlaying > this.p.playlist.length - 1)
          this.p.nowPlaying = 0; // if loop mode
      }
      this.$emit("play", this.p.playlist[this.p.nowPlaying]);

      if (this.p.playlistVisible) this.$root.$emit("scrollToNowPlaying");
    },
    startSeeking(time) {
      this.p.seeking = true;
      this.p.seekTime = time;
    },
    seek(time) {
      this.p.seeking = false;
      this.jumpTo(time);
    },
    wheelSeek(e) {
      if (e.altKey) {
        e.deltaY > 0 ? this.jumpToMark("prev") : this.jumpToMark("next");
        return;
      }
      let s = e.deltaY / -20;
      if (e.shiftKey) s = s * 2;
      else if (e.ctrlKey) s = s / 2;
      this.jumpToSeconds(s);
    },
    jumpTo(time) {
      this.$store.dispatch("playerJumpTo", { time });
    },
    jumpToSeconds(time) {
      this.jumpTo(this.p.currentTime + time);
    },
    jumpToMark(type) {
      let marks = [];
      let currentTime = 0;

      if (type == "prev") {
        marks = _.orderBy(this.p.marks, "time", ["desc"]);
        currentTime = this.p.currentTime - 5;
      } else if (type == "next") {
        marks = this.p.marks;
        currentTime = this.p.currentTime;
      }

      for (let mark of marks) {
        if (
          (type == "prev" && mark.time < currentTime) ||
          (type == "next" && mark.time > currentTime)
        ) {
          this.jumpTo(mark.time);
          let text = "";
          if (mark.type == "meta") text = mark["item.name"];
          else text = mark.name;
          this.$store.dispatch("changePlayerStatusText", {
            text: text,
            icon: "tooltip",
          });
          break;
        }
      }
    },
    handleMouseSeek(e) {
      let btnCode = e.button;
      switch (btnCode) {
        // case 0: // clearInterval(this.currentTimeTracker); break
        // case 1: // clearInterval(this.currentTimeTracker); break
        // case 2: // clearInterval(this.currentTimeTracker); break
        case 3:
          this.jumpToMark("prev");
          break;
        case 4:
          this.jumpToMark("next");
          break;
      }
    },
    togglePlaylist() {
      this.p.playlistVisible = !this.p.playlistVisible;
      if (!this.p.playlistVisible) return;
      this.$root.$emit("scrollToNowPlaying");
    },
    toggleMarks() {
      this.p.marksVisible = !this.p.marksVisible;
    },
    toggleMute() {
      this.p.player.muted = !this.p.player.muted;
      this.p.muted = !this.p.muted;
      let text = (this.p.volume * 100).toFixed() + " %";
      if (this.p.muted) text = "Muted";
      this.$store.dispatch("changePlayerStatusText", {
        text: text,
        icon: this.volumeIcon,
      });
    },
    changeVolume(e) {
      this.$emit("changeVolume", e);
    },
    addMark(type) {
      this.$emit("addMark", type);
    },
    async setAsThumb() {
      let video = this.p.playlist[this.p.nowPlaying];
      let imgPath = "/userfiles/media/thumbs/" + video.id + ".jpg";
      let time = new Date(this.p.currentTime * 1000)
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
};
</script>


<style lang="scss">
</style>