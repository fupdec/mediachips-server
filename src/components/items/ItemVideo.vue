<template>
  <v-lazy>
    <v-card
      v-if="page.view == '1'"
      :disabled="!reg && x > 9"
      @mousedown="stopSmoothScroll($event)"
      :class="{ favorite: video.favorite }"
      class="video-card meta-card"
      outlined
      hover
    >
      <v-responsive
        @mouseover.capture="playPreview()"
        @mouseleave="stopPlayingPreview()"
        :aspect-ratio="16 / 9"
        class="video-preview-container"
      >
        <div v-if="!reg && x > 9" class="reg-block">
          <div>App not registered</div>
        </div>

        <v-img :src="thumb" :aspect-ratio="16 / 9" />

        <v-btn @click="openPlayer" color="white" class="btn-play" icon outlined>
          <v-icon>mdi-play</v-icon>
        </v-btn>

        <v-rating
          :value="video.rating"
          @input="changeRating($event, video.id)"
          class="rating rating-wrapper"
          color="yellow darken-2"
          background-color="grey darken-1"
          empty-icon="mdi-star-outline"
          half-icon="mdi-star-half-full"
          dense
          half-increments
          hover
          clearable
        />

        <v-btn class="fav-btn" color="pink" absolute icon>
          <v-icon v-if="video.favorite" color="pink"> mdi-heart </v-icon>
          <v-icon v-else color="grey"> mdi-heart-outline </v-icon>
        </v-btn>

        <div class="duration" v-html="duration" />

        <div label outlined class="resolution">
          <div class="text text-no-wrap" :class="quality.toLowerCase()">
            {{ quality }}
          </div>
          <div class="value">
            <span>{{ height }}</span>
          </div>
        </div>

        <!-- <video @click="mountSrc" ref="video" controls /> -->

        <div
          v-if="isHovered && sets.videoPreviewHover == 'timeline'"
          class="timeline"
        >
          <img :src="frame" />
          <div class="sections">
            <div
              v-for="(i, x) in timelines"
              :key="x"
              @mouseover="getFrameImg(timelines[x])"
              class="section"
            />
          </div>
        </div>
      </v-responsive>

      <div class="description">
        <div class="video-card-title" :title="fileName" v-html="fileName" />

        <NestedItems
          :items="items"
          :values="values"
          :metadata="nestedMetadata"
          type="video"
        />
      </div>

      <v-icon
        v-if="video.bookmark"
        class="bookmark"
        color="red"
        :title="video.bookmark"
        v-html="'mdi-bookmark'"
      />

      <v-overlay
        :value="page.isSelect"
        @click.stop="toggleSelect"
        :color="isSelected ? 'primary' : '#7777'"
        absolute
      >
        <v-icon v-if="isSelected" size="50">
          mdi-checkbox-marked-outline
        </v-icon>
      </v-overlay>
    </v-card>

    <v-card
      v-else-if="page.view == '2'"
      :disabled="!reg && x > 9"
      @mousedown="stopSmoothScroll($event)"
      v-ripple="{ class: 'accent--text' }"
      :class="{ favorite: video.favorite }"
      outlined
      hover
      class="video-card meta-card"
    >
      <div
        @click="openPlayer"
        @mousemove.capture="scrollStory($event)"
        @mouseleave="stopScrollStory"
        ref="story"
        class="story"
      >
        <v-sheet class="video-card-title" v-html="fileName" />
        <div v-if="!reg && x > 9" class="reg-block">App not registered</div>

        <div label outlined class="resolution">
          <div
            class="text text-no-wrap"
            :class="quality.toLowerCase()"
            v-html="quality"
          />
          <div class="value" v-html="height" />
        </div>
        <div class="wrapper" ref="storyWrapper" :class="{ hovered: isHovered }">
          <div v-for="(i, x) in timelines" :key="x" class="frame">
            <img :src="frames[x]" />
            <div
              class="duration"
              v-html="getDur((i / 100) * metadata.duration)"
            />
          </div>
        </div>
      </div>

      <div class="description">
        <NestedItems
          :items="items"
          :values="values"
          :metadata="nestedMetadata"
          type="video"
        />
      </div>

      <v-icon
        v-if="video.bookmark"
        class="bookmark"
        color="red"
        :title="video.bookmark"
        v-html="'mdi-bookmark'"
      />

      <v-overlay
        :value="page.isSelect"
        @click.stop="toggleSelect"
        :color="isSelected ? 'primary' : '#7777'"
        absolute
      >
        <v-icon v-if="isSelected" size="50">
          mdi-checkbox-marked-outline
        </v-icon>
      </v-overlay>
    </v-card>
  </v-lazy>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import ComputedForItem from "@/mixins/ComputedForItem";
import NestedItems from "./NestedItems.vue";

const path = require("path");
// const { dialog } = require('electron').remote
// const { clipboard } = require('electron')
// const shell = require('electron').shell
// const fs = require('fs')
// const path = require('path')
// const ffmpeg = require('fluent-ffmpeg')
// const pathToFfprobe = require('ffprobe-static').path.replace('app.asar', 'app.asar.unpacked')
// ffmpeg.setFfprobePath(pathToFfprobe)

// import Functions from '@/mixins/Functions'
// import ShowImageFunction from '@/mixins/ShowImageFunction'
// import LabelFunctions from '@/mixins/LabelFunctions'
// import { ipcRenderer } from 'electron'
// import MetaGetters from '@/mixins/MetaGetters'
// const express = require("express")
// const app = express()
export default {
  name: "ItemVideo",
  props: {
    video: Object,
    reg: Boolean,
    x: Number,
  },
  components: { NestedItems },
  mixins: [ComputedForItem],
  beforeMount() {
    this.getMetadata();
    this.getMeta();
    this.getValues();
    this.getImg();
  },
  mounted() {
    this.$root.$on("updateVideoThumb", (id) => {
      if (this.video.id === id) this.getImg();
    });
    if (this.page.view == "2") this.initFrames();
  },
  beforeDestroy() {
    this.$root.$off("updateVideoThumb");
  },
  data: () => ({
    metadata: {},
    items: [],
    values: [],
    thumb: null,
    frame: null,
    frames: [],
    isHovered: false,
    section: 0,
    timelines: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95],
    timeouts: {},
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    quality() {
      return Vue.prototype.$getReadableVideoQuality(
        this.metadata.width,
        this.metadata.height
      );
    },
    height() {
      return Vue.prototype.$getReadableVideoHeight(
        this.metadata.width,
        this.metadata.height
      );
    },
    nestedMetadata() {
      return {
        filesize: Vue.prototype.$getReadableFileSize(this.video.filesize),
        fileExtension: Vue.prototype.$getFileExtensionFromPath(this.video.path),
        resolution: this.metadata.width + "x" + this.metadata.height,
      };
    },
    duration() {
      return Vue.prototype.$getReadableDuration(this.metadata.duration);
    },
    fileName() {
      return Vue.prototype.$getFileNameFromPath(this.video.path);
    },
    page() {
      return this.$store.state.Page;
    },
    sets() {
      return this.$store.state.settings;
    },
    // metaAssignedToVideos() { return this.$store.state.Settings.metaAssignedToVideos },
    // view() { return this.$store.state.Settings.videoView || 0 },
    // visibility() { return this.$store.state.Settings.videoVisibility },
    // isSelectedSingleVideo() { return this.$store.getters.getSelectedVideos.length == 1 },
    // complexMetaAssignedToVideo() { return this.$store.getters.settings.get('metaAssignedToVideos').filter({type:'complex'}).value() },
    // metaForParsing() {
    //   let ids = this.$store.getters.settings.get('metaAssignedToVideos').filter({type:'complex'}).map('id').value()
    //   return this.$store.getters.meta.filter(i=>ids.includes(i.id)&&i.settings.parser).value()
    // },
    // showEmptyMetaValueInCard() { return this.$store.state.Settings.showEmptyMetaValueInCard },
    // playlists() { return this.$store.getters.playlists.value() },
  },
  methods: {
    async getImg() {
      let imgPath = path.join(
        __dirname,
        "/userfiles/media/thumbs/",
        this.video.id + ".jpg"
      );
      this.thumb = await Vue.prototype.$getLocalImage(imgPath);
    },
    // mountSrc() {
    //   this.$refs.video.src = this.video.path
    // },
    getMetadata() {
      let url = `/api/VideoMetadata/${this.video.id}`;
      axios
        .get(this.apiUrl + url)
        .then((res) => {
          this.metadata = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getMeta() {
      let url = `/api/ItemsInMedia?mediaId=${this.video.id}`;
      axios
        .get(this.apiUrl + url)
        .then((res) => {
          this.items = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getValues() {
      let url = `/api/ValuesInMedia?mediaId=${this.video.id}`;
      axios
        .get(this.apiUrl + url)
        .then((res) => {
          this.values = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    openPlayer() {
      this.$store.state.Player.active = true;
      let items = _.cloneDeep(this.$store.state.Page.items);
      if (items.length > this.x + 50) {
        let start = 0;
        if (this.x > 10) start = this.x - 10;
        items = items.slice(start, this.x + 50);
      }
      this.$root.$emit("playVideo", this.video, items);
    },
    playPreview() {
      if (this.isHovered) return;
      this.isHovered = true;
      if (this.sets.videoPreviewHover !== "video") return;
      // this.timeouts.z = setTimeout(() => {
      //   // play original video
      //   if (!this.isVideoExist) return;
      //   this.$refs.video.src = this.video.path;
      //   this.setVideoProgress(0.2);
      //   this.timeouts.a = setTimeout(this.setVideoProgress, 3000, 0.4);
      //   this.timeouts.b = setTimeout(this.setVideoProgress, 6000, 0.6);
      //   this.timeouts.c = setTimeout(this.setVideoProgress, 9000, 0.8);
      //   this.timeouts.d = setTimeout(this.setVideoProgress, 12000, 0.2);
      // }, this.sets.delayVideoPreview * 1000 + 500);
    },
    stopPlayingPreview() {
      if (this.sets.videoPreviewHover != "none") this.isHovered = false;
      if (this.sets.videoPreviewHover != "video") return;
      for (const timeout in this.timeouts) clearTimeout(this.timeouts[timeout]);
      // this.$refs.video.src = "";
    },
    async getFrameImg(progress) {
      const imgPath = this.getFrameImgUrl(progress);
      this.frame = await Vue.prototype.$getLocalImage(imgPath);
    },
    getFrameImgUrl(progress) {
      return path.join(
        __dirname,
        "/userfiles/media/timelines/",
        `${this.video.id}_${progress}.jpg`
      );
    },
    scrollStory(e) {
      let storyWidth = this.$refs.story.clientWidth;
      let wrapperWidth = this.$refs.storyWrapper.clientWidth;
      if (wrapperWidth <= storyWidth) return;
      let x = e.layerX;
      let ratio = storyWidth / (wrapperWidth - storyWidth);
      let offset = Math.ceil(x / ratio);
      this.$refs.storyWrapper.style.left = "-" + offset + "px";
    },
    stopScrollStory() {
      this.$refs.storyWrapper.style.left = 0;
    },
    async initFrames() {
      for (let i = 0; i < this.timelines.length; i++) {
        const progress = this.timelines[i];
        const imgPath = this.getFrameImgUrl(progress);
        this.frames.push(await Vue.prototype.$getLocalImage(imgPath));
      }
    },
    getDur(secs) {
      return Vue.prototype.$getReadableDuration(secs);
    },
  },
  watch: {
    "page.view"(view) {
      if (view == "2") this.initFrames();
    },
  },
};
</script>