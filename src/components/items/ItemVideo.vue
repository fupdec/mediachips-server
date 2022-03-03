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

        <v-btn
          @click="openPlayer"
          :color="isFileExists ? 'white' : 'error'"
          class="btn-play"
          icon
          fab
        >
          <v-icon x-large>mdi-play</v-icon>
        </v-btn>

        <v-rating
          :value="video.rating"
          @input="setVal($event, 'rating')"
          color="yellow darken-2"
          background-color="#eee"
          class="rating"
          empty-icon="mdi-star-outline"
          half-icon="mdi-star-half-full"
          dense
          half-increments
          hover
          clearable
        />

        <v-checkbox
          v-model="video.favorite"
          @change="setVal($event, 'favorite')"
          :false-value="0"
          :true-value="1"
          off-icon="mdi-heart-outline"
          on-icon="mdi-heart"
          color="pink"
          class="ma-0 pa-0 fav-btn"
          hide-details
        />

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
          :class="[
            { 'no-file': frameLost && !isFileExists },
            { 'no-frame': frameLost },
          ]"
          class="timeline"
        >
          <div
            v-show="frameLost"
            class="text-gen"
            v-html="'Creation of frames in progress...'"
          />
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
          :item="video"
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
        <v-sheet class="video-card-title">
          <v-icon v-if="!isFileExists" color="error">mdi-file-alert</v-icon>
          {{ fileName }}
        </v-sheet>
        <div v-if="framesLost && isFileExists" class="message">
          <v-sheet v-html="'Creation of frames in progress...'" />
        </div>
        <div
          v-if="!reg && x > 9"
          class="reg-block"
          v-html="'App not registered'"
        />

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
          :item="video"
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

export default {
  name: "ItemVideo",
  props: {
    video: Object,
    reg: Boolean,
    x: Number,
  },
  components: { NestedItems },
  mixins: [ComputedForItem],
  async beforeMount() {
    await this.getMetadata();
    await this.getMeta();
    await this.getValues();
    await this.getImg();
    if (this.page.view == "2") await this.initFrames();
    await this.checkFileExists();
  },
  mounted() {
    this.$root.$on("updateVideoThumb", (id) => {
      if (this.video.id === id) this.getImg();
    });
    this.$root.$on("updateVideoFrames", (id) => {
      if (this.video.id === id) this.initFrames();
    });
  },
  beforeDestroy() {
    this.$root.$off("updateVideoThumb");
    this.$root.$off("updateVideoFrames");
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
    isFileExists: true,
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
    frameLost() {
      if (this.frame) return this.frame.includes("ghost.png");
      else return true;
    },
    framesLost() {
      if (this.frames[0]) return this.frames[0] == this.thumb;
      else return true;
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
      if (!this.isFileExists) {
        this.$store.state.dialogError = true;
        let text = `File not found on path: \n"${this.video.path}"`;
        this.$store.state.dialogErrorText = text;
        return;
      }
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
      this.frames = [];
      for (let i = 0; i < this.timelines.length; i++) {
        const progress = this.timelines[i];
        const imgPath = this.getFrameImgUrl(progress);
        let img = await Vue.prototype.$getLocalImage(imgPath);
        if (i == 0 && img.includes("ghost.png")) {
          this.frames = [];
          for (let j of this.timelines) this.frames.push(this.thumb);
          break;
        } else this.frames.push(img);
      }
    },
    getDur(secs) {
      return Vue.prototype.$getReadableDuration(secs);
    },
    async checkFileExists() {
      let res = await Vue.prototype.$checkFileExists(this.video.path);
      this.isFileExists = res.status == 201;
    },
    async setVal(val, key) {
      await axios({
        method: "put",
        url: this.apiUrl + "/api/media/" + this.video.id,
        data: {
          [key]: val,
        },
      });
      this.$root.$emit("getItemsFromDb", []);
    },
  },
  watch: {
    "page.view"(view) {
      if (view == "2") this.initFrames();
    },
  },
};
</script>