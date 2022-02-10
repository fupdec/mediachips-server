<template>
  <div class="controls">
    <v-card-actions class="timeline py-1 px-0 mx-3">
      <v-slider
        :value="p.seeking ? p.seekTime : p.currentTime"
        hide-details
        min="0"
        step="0.1"
        :max="p.duration"
        @start="startSeeking($event)"
        @end="seek($event)"
        @mousedown="handleMouseSeek($event)"
      />
      <Mark
        v-for="(mark, i) in p.marks"
        :key="i"
        :mark="mark"
        :position="`left: ${(mark.time / p.duration) * 100}%;`"
      />
    </v-card-actions>
    <v-card-actions class="buttons pa-1">
      <v-btn-toggle class="remove-active compact">
        <v-btn
          @click="p.paused ? play() : pause()"
          small
          class="ml-1"
          :title="p.paused ? 'Play' : 'Pause'"
        >
          <v-icon v-if="p.paused">mdi-play</v-icon>
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
          :title="p.fullscreen ? 'Exit Fullscreen' : 'Fullscreen'"
        >
          <v-icon v-if="p.fullscreen">mdi-fullscreen-exit</v-icon>
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
      <v-btn-toggle class="mx-4 remove-active mark-buttons compact">
        <v-btn
          @click="p.marksVisible = !p.marksVisible"
          :color="p.marksVisible ? 'primary' : ''"
          small
          title="Marks List"
        >
          <v-icon>mdi-map-marker</v-icon>
        </v-btn>
        <v-btn
          @click="jumpToPrevMark"
          small
          class="mark-prev"
          title="Previous Mark"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn
          @click="jumpToNextMark"
          small
          class="mark-next"
          title="Next Mark"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-menu offset-y nudge-top="40" nudge-right="400" attach=".controls">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" small title="Add Mark">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>

          <!-- <v-btn-toggle class="remove-active">
                  <v-btn @click="addMark('favorite')" title="Favorite">
                    <v-icon size="20">mdi-heart</v-icon> 
                  </v-btn>
                  <v-btn @click="openDialogMarkBookmark" title="Bookmark">
                    <v-icon size="20">mdi-bookmark</v-icon> 
                  </v-btn>
                  <v-btn v-for="m in metaMarks" :key="m.id" :value="m.id" @click="openDialogMarkMeta(m.id)" :title="m.settings.name">
                    <v-icon size="20">mdi-{{m.settings.icon}}</v-icon>
                  </v-btn>
                </v-btn-toggle> -->
        </v-menu>
      </v-btn-toggle>
      <v-btn-toggle class="remove-active compact">
        <v-btn
          @click="togglePlaylist"
          :color="p.playlistVisible ? 'primary' : ''"
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
        <div class="time-start">{{ msToTime(p.currentTime) }}</div>
        <span class="mx-1">/</span>
        <div class="time-end">{{ msToTime(p.duration) }}</div>
      </div>
      <v-slider
        v-model="p.volume"
        value="1"
        min="0"
        step="0.05"
        max="1"
        hide-details
        :prepend-icon="volumeIcon"
        @click:prepend="p.muted = !p.muted"
        class="volume"
      />
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
      this.$store.dispatch("playerPlay");
    },
    pause() {
      this.$store.dispatch("playerPause");
    },
    stop() {
      this.$store.dispatch("playerStop");
    },
    togglePause() {
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