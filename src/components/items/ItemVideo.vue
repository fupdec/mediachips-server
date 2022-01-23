<template>
  <v-lazy>
    <v-card
      v-if="pageSets.view == '1'"
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
          v-if="isHovered && appSets.videoPreviewHover == 'timeline'"
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

        <!-- Video meta -->
        <v-chip label outlined :title="video.path">
          <v-icon left>mdi-folder-outline</v-icon> Path
        </v-chip>
        <v-chip label outlined>
          <v-icon left>mdi-file-video-outline</v-icon>
          {{ fileExtension }}
        </v-chip>
        <v-chip label outlined>
          <v-icon left>mdi-monitor-screenshot</v-icon>
          {{ metadata.width + "x" + metadata.height }}
        </v-chip>
        <v-chip label outlined>
          <v-icon left>mdi-harddisk</v-icon>
          {{ filesize }}
        </v-chip>

        <v-chip
          v-for="i in meta"
          :key="i.itemId"
          @mouseover.stop="hoverImage($event, i['item.metaId'], i['itemId'])"
          @mouseleave.stop="$store.state.hover.show = false"
          :color="i['item.color']"
          :text-color="getTextColor(i['item.color'])"
        >
          <v-icon class="mr-1">mdi-{{ i.meta.icon }}</v-icon>
          {{ i["item.name"] }}
        </v-chip>

        <!-- Parse meta -->
        <!-- <div v-for="(m,i) in metaAssignedToVideos" :key="i">
        <div v-if="visibility[m.id]&&checkShowEmptyValue(m)" class="meta-in-card">
          <v-chip-group v-if="m.type=='complex'" column>
            <v-icon :title="getMeta(m.id).settings.name">mdi-{{getMeta(m.id).settings.icon}}</v-icon>
            <v-chip v-for="mc in video[m.id]" :key="mc" 
              :color="getColor(m.id,mc)" 
              :label="getMeta(m.id).settings.chipLabel"
              :outlined="getMeta(m.id).settings.chipOutlined"
              :title="`Open page with ${getMeta(m.id).settings.nameSingular.toLowerCase()}`"
              @click="openMetaCardPage(m.id,mc)"
              @click.middle="openMetaInNewTab(mc)"
              @mouseover.stop="showImage($event,mc,'meta',m.id)" 
              @mouseleave.stop="$store.state.hoveredImage=false"> 
                {{ getCard(mc).meta.name }} </v-chip>
          </v-chip-group>
          <div v-else-if="m.type=='simple'" class="simple-meta">
            <v-icon :title="getMeta(m.id).settings.name">mdi-{{getMeta(m.id).settings.icon}}</v-icon>
            <span v-if="getMeta(m.id).type=='array'">{{getArrayValuesForCard(m.id, 'video')}}</span>
            <span v-else-if="getMeta(m.id).type=='rating'">      
              <v-rating :value="video[m.id]" @input="changeMetaRating($event, m.id)" :length="getMeta(m.id).settings.ratingMax" hover 
                :full-icon="`mdi-${getMeta(m.id).settings.ratingIcon}`" :empty-icon="`mdi-${getMeta(m.id).settings.ratingIconEmpty||getMeta(m.id).settings.ratingIcon}`" 
                :color="getMeta(m.id).settings.ratingColor" background-color="grey" class="meta-rating" clearable
                :half-increments="getMeta(m.id).settings.ratingHalf" :half-icon="`mdi-${getMeta(m.id).settings.ratingIconHalf||getMeta(m.id).settings.ratingIcon}`"/>
            </span>
            <span v-else-if="getMeta(m.id).type=='boolean'">{{video[m.id]?'Yes':'No'}}</span>
            <span v-else>{{video[m.id]}}</span>
          </div>
        </div>
      </div> -->
      </div>

      <v-icon
        v-if="video.bookmark"
        class="bookmark"
        color="red"
        :title="video.bookmark"
        v-html="'mdi-bookmark'"
      />

      <v-overlay
        :value="isSelect"
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
      v-else-if="pageSets.view == '2'"
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
        <!-- Video meta -->
        <v-chip label outlined :title="video.path">
          <v-icon left>mdi-folder-outline</v-icon> Path
        </v-chip>
        <v-chip label outlined>
          <v-icon left>mdi-file-video-outline</v-icon>
          {{ fileExtension }}
        </v-chip>
        <v-chip label outlined>
          <v-icon left>mdi-monitor-screenshot</v-icon>
          {{ metadata.width + "x" + metadata.height }}
        </v-chip>
        <v-chip label outlined>
          <v-icon left>mdi-harddisk</v-icon>
          {{ filesize }}
        </v-chip>

        <v-chip
          v-for="i in meta"
          :key="i.itemId"
          @mouseover.stop="hoverImage($event, i['item.metaId'], i['itemId'])"
          @mouseleave.stop="$store.state.hover.show = false"
          :color="i['item.color']"
          :text-color="getTextColor(i['item.color'])"
        >
          <v-icon class="mr-1">mdi-{{ i.meta.icon }}</v-icon>
          {{ i["item.name"] }}
        </v-chip>
      </div>

      <v-icon
        v-if="video.bookmark"
        class="bookmark"
        color="red"
        :title="video.bookmark"
        v-html="'mdi-bookmark'"
      />

      <v-overlay
        :value="isSelect"
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
import Item from "@/mixins/Item";

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
    items: Array,
    reg: Boolean,
    x: Number,
  },
  mixins: [Item],
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
    if (this.pageSets.view == "2") this.initFrames();
  },
  beforeDestroy() {
    this.$root.$off("updateVideoThumb");
  },
  data: () => ({
    metadata: {},
    meta: [],
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
    filesize() {
      return Vue.prototype.$getReadableFileSize(this.video.filesize);
    },
    duration() {
      return Vue.prototype.$getReadableDuration(this.metadata.duration);
    },
    fileName() {
      return Vue.prototype.$getFileNameFromPath(this.video.path);
    },
    fileExtension() {
      return Vue.prototype.$getFileExtensionFromPath(this.video.path);
    },
    pageSets: {
      get() {
        return this.$store.state.pageSettings;
      },
      set(value) {
        this.$store.commit("updateState", {
          key: "pageSettings",
          value: _.cloneDeep(value),
        });
      },
    },
    appSets: {
      get() {
        return this.$store.state.settings;
      },
      set(value) {
        this.$store.commit("updateState", {
          key: "settings",
          value: _.cloneDeep(value),
        });
      },
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
          this.meta = res.data;
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
      this.$root.$emit("playVideo", this.video, this.items);
    },
    getTextColor(color) {
      if (!color) return "";
      let value = Vue.prototype.$checkColorForDarkText(color);
      if (value) return "white";
      else return "black";
    },
    playPreview() {
      if (this.isHovered) return;
      this.isHovered = true;
      if (this.appSets.videoPreviewHover !== "video") return;
      // this.timeouts.z = setTimeout(() => {
      //   // play original video
      //   if (!this.isVideoExist) return;
      //   this.$refs.video.src = this.video.path;
      //   this.setVideoProgress(0.2);
      //   this.timeouts.a = setTimeout(this.setVideoProgress, 3000, 0.4);
      //   this.timeouts.b = setTimeout(this.setVideoProgress, 6000, 0.6);
      //   this.timeouts.c = setTimeout(this.setVideoProgress, 9000, 0.8);
      //   this.timeouts.d = setTimeout(this.setVideoProgress, 12000, 0.2);
      // }, this.appSets.delayVideoPreview * 1000 + 500);
    },
    stopPlayingPreview() {
      if (this.appSets.videoPreviewHover != "none") this.isHovered = false;
      if (this.appSets.videoPreviewHover != "video") return;
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
    "pageSets.view"(view) {
      if (view == "2") this.initFrames();
    },
  },
};
</script>