<template>
  <div
    @mouseenter="p.mouseOverControls = true"
    @mouseleave="p.mouseOverControls = false"
    class="controls"
  >
    <v-card-actions class="timeline px-4 py-0">
      <v-slider
        :value="p.seeking ? p.seekTime : p.currentTime"
        @start="startSeeking($event)"
        @end="seek($event)"
        @mousedown="handleMouseSeek($event)"
        track-color="#ffffff60"
        color="white"
        step="0.1"
        min="0"
        :max="p.duration"
        hide-details
      />

      <Mark
        v-for="(mark, i) in p.marks"
        :key="i"
        :mark="mark"
        :position="`left: ${(mark.time / p.duration) * 100}%;`"
      />
    </v-card-actions>

    <v-card-actions class="buttons pa-4 pt-0">
      <v-btn
        @click="p.paused ? play() : pause()"
        :title="p.paused ? 'Play' : 'Pause'"
        class="ml-1"
        icon
        dark
      >
        <v-icon v-if="p.paused" large>mdi-play</v-icon>
        <v-icon v-else large>mdi-pause</v-icon>
      </v-btn>

      <!-- NAVIGATION -->
      <v-chip outlined dark class="px-0 mx-2">
        <v-btn
          @click="prev"
          :disabled="isPrevDisabled"
          title="Previous Video"
          icon
          dark
        >
          <v-icon>mdi-skip-previous</v-icon>
        </v-btn>

        <v-btn @click="stop" title="Stop Playing" icon dark>
          <v-icon>mdi-stop</v-icon>
        </v-btn>

        <v-btn
          @click="next"
          :disabled="isNextDisabled"
          title="Next Video"
          icon
          dark
        >
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>
      </v-chip>

      <!-- SCREEN -->
      <v-chip outlined dark class="px-0">
        <v-btn
          @click="toggleFullscreen"
          :title="p.fullscreen ? 'Exit Fullscreen' : 'Fullscreen'"
          icon
          dark
        >
          <v-icon v-if="p.fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>

        <v-btn
          @click="togglePictureInPicture"
          class="toggle-picture-in-picture"
          title="Picture-in-Picture Mode"
          icon
          dark
        >
          <v-icon size="20">mdi-picture-in-picture-bottom-right</v-icon>
        </v-btn>
      </v-chip>

      <!-- FAST SEEK -->
      <v-chip outlined dark class="seek-buttons px-0 mx-2">
        <v-btn @click="jumpToSeconds(-5)" title="- 5 seconds" icon dark>
          <v-icon size="20">mdi-chevron-triple-left</v-icon>
        </v-btn>

        <v-btn @click="jumpToSeconds(-2)" title="- 2 seconds" icon dark>
          <v-icon size="20">mdi-chevron-double-left</v-icon>
        </v-btn>

        <v-btn @click="jumpToSeconds(2)" title="+ 2 seconds" icon dark>
          <v-icon size="20">mdi-chevron-double-right</v-icon>
        </v-btn>

        <v-btn @click="jumpToSeconds(5)" title="+ 5 seconds" icon dark>
          <v-icon size="20">mdi-chevron-triple-right</v-icon>
        </v-btn>
      </v-chip>

      <!-- MARKS  -->
      <v-chip outlined dark class="mark-buttons px-0">
        <v-btn
          @click="p.marksVisible = !p.marksVisible"
          title="Marks List"
          icon
          dark
        >
          <v-icon>mdi-map-marker</v-icon>
        </v-btn>

        <v-menu offset-y nudge-top="40" nudge-right="400" attach=".controls">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" title="Add Mark" icon dark>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>

          <!-- <div class="remove-active">
                  <v-btn @click="addMark('favorite')" title="Favorite">
                    <v-icon size="20">mdi-heart</v-icon> 
                  </v-btn>
                  <v-btn @click="openDialogMarkBookmark" title="Bookmark">
                    <v-icon size="20">mdi-bookmark</v-icon> 
                  </v-btn>
                  <v-btn v-for="m in metaMarks" :key="m.id" :value="m.id" @click="openDialogMarkMeta(m.id)" :title="m.settings.name">
                    <v-icon size="20">mdi-{{m.settings.icon}}</v-icon>
                  </v-btn>
                </div> -->
        </v-menu>

        <v-btn
          @click="jumpToPrevMark"
          class="mark-prev"
          title="Previous Mark"
          icon
          dark
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <v-btn
          @click="jumpToNextMark"
          class="mark-next"
          title="Next Mark"
          icon
          dark
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-chip>

      <!-- PLAYLIST -->
      <v-chip outlined dark class="px-0 mx-2">
        <v-btn @click="togglePlaylist" title="Playlist" icon dark>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>
      </v-chip>

      <v-chip outlined dark class="px-0">
        <v-btn @click="setAsThumb" title="Set Frame as Thumb" icon dark>
          <v-icon>mdi-image-outline</v-icon>
        </v-btn>
      </v-chip>

      <v-spacer></v-spacer>

      <v-chip outlined dark class="volume px-0 mx-2">
        <v-btn @click="p.muted = !p.muted" title="Mute" icon dark>
          <v-icon>{{ volumeIcon }}</v-icon>
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

      <v-chip
        @click="p.timeRemain = !p.timeRemain"
        class="body-1 mr-2"
        title="Switch between elapsed and remaining time"
        outlined
        dark
      >
        <div v-if="!p.timeRemain">{{ msToTime(p.currentTime) }}</div>
        <div v-else>- {{ msToTime(p.duration - p.currentTime) }}</div>
        <span class="mx-1">/</span>
        <div>{{ msToTime(p.duration) }}</div>
      </v-chip>
    </v-card-actions>
  </div>
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
  computed: {
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
    volumeIcon() {
      if (this.p.muted) return "mdi-volume-mute";
      if (this.p.volume > 0.7) return "mdi-volume-high";
      if (this.p.volume > 0.3) return "mdi-volume-medium";
      return "mdi-volume-low";
    },
  },
  methods: {
    msToTime(time) {
      return Vue.prototype.$getReadableDuration(time);
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
    jumpTo(time) {
      this.$store.dispatch("playerJumpTo", { time });
    },
    jumpToSeconds(time) {
      this.jumpTo(this.p.currentTime + time);
    },
    jumpToPrevMark() {
      let marks = _.orderBy(this.p.marks, "time", ["desc"]);
      let currentTime = this.p.currentTime - 5;
      for (let mark of marks) {
        if (mark.time < currentTime) {
          this.jumpTo(mark.time);
          break;
        }
      }
    },
    jumpToNextMark() {
      let marks = this.p.marks;
      let currentTime = this.p.currentTime;
      for (let mark of marks) {
        if (mark.time > currentTime) {
          this.jumpTo(mark.time);
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
          this.jumpToPrevMark();
          break;
        case 4:
          this.jumpToNextMark();
          break;
      }
    },
    togglePlaylist() {
      this.p.playlistVisible = !this.p.playlistVisible;
      if (!this.p.playlistVisible) return;
      this.$root.$emit("scrollToNowPlaying");
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