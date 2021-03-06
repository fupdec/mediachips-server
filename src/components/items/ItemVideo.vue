<template>
  <v-lazy>
    <v-card
      v-if="Items.view == '1'"
      :disabled="!reg && x > 9"
      @contextmenu.stop="showMenu"
      @mousedown="stopSmoothScroll($event)"
      v-ripple="{ class: 'primary--text' }"
      :class="{ favorite: media.favorite }"
      class="media-card meta-card"
      outlined
      hover
    >
      <v-responsive
        @mouseover.capture="playPreview()"
        @mouseleave="stopPlayingPreview()"
        :aspect-ratio="16 / 9"
        :class="[{ 'no-file': !isFileExists }]"
        class="video-preview-container"
      >
        <div v-if="!reg && x > 9" class="reg-block">
          <div>App not registered</div>
        </div>

        <v-img
          @click="play"
          :src="thumb"
          :aspect-ratio="16 / 9"
          class="thumb"
        />

        <v-rating
          :value="media.rating"
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
          v-model="media.favorite"
          @change="setVal($event, 'favorite')"
          :false-value="0"
          :true-value="1"
          off-icon="mdi-heart-outline"
          on-icon="mdi-heart"
          color="pink"
          class="ma-0 pa-0 fav-btn"
          hide-details
          dark
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
          @click="play"
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

        <v-btn @click.stop="edit" color="primary" class="btn-edit" small fab>
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-responsive>

      <v-progress-linear :value="progress" />

      <div class="description">
        <div class="media-card-title">
          <v-icon
            v-if="!isFileExists"
            title="File not found"
            color="error"
            left
          >
            mdi-file-alert
          </v-icon>
          <span v-text="fileName" :title="fileName" />
        </div>

        <NestedItems
          :item="media"
          :items="items"
          :values="values"
          :metadata="nestedMetadata"
          type="video"
        />
      </div>

      <v-icon
        v-if="media.bookmark"
        class="bookmark"
        color="red"
        :title="media.bookmark"
        v-html="'mdi-bookmark'"
      />

      <v-overlay
        :value="Items.isSelect"
        @click.stop="toggleSelect"
        :color="isSelected ? 'primary' : '#7777'"
        z-index="1"
        absolute
      >
        <v-icon v-if="isSelected" size="50">
          mdi-checkbox-marked-outline
        </v-icon>
      </v-overlay>
    </v-card>

    <v-card
      v-else-if="Items.view == '2'"
      @contextmenu.stop="showMenu"
      @mousedown="stopSmoothScroll($event)"
      v-ripple="{ class: 'accent--text' }"
      :class="[{ 'no-file': !isFileExists }, { favorite: media.favorite }]"
      class="media-card meta-card"
      :disabled="!reg && x > 9"
      outlined
      hover
    >
      <div
        @click="play"
        @mousemove.capture="scrollStory($event)"
        @mouseleave="stopScrollStory"
        ref="story"
        class="story"
      >
        <v-sheet class="media-card-title">
          <v-icon v-if="!isFileExists" color="error">mdi-file-alert</v-icon>
          <span v-text="fileName" />
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
          :item="media"
          :items="items"
          :values="values"
          :metadata="nestedMetadata"
          type="video"
        />
      </div>

      <v-icon
        v-if="media.bookmark"
        class="bookmark"
        color="red"
        :title="media.bookmark"
        v-html="'mdi-bookmark'"
      />

      <v-overlay
        :value="Items.isSelect"
        @click.stop="toggleSelect"
        :color="isSelected ? 'primary' : '#7777'"
        z-index="1"
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
import NestedItems from "@/components/items/NestedItems.vue";
const path = require("path");

export default {
  name: "ItemVideo",
  props: {
    media: Object,
    reg: Boolean,
    upd: Array,
    x: Number,
  },
  components: {
    NestedItems,
  },
  mixins: [ComputedForItem],
  async beforeMount() {
    await this.getMetadata();
    await this.getItems();
    await this.getValues();
    await this.checkFileExists();
    await this.getImg();
    if (this.Items.view == "2") await this.initFrames();
  },
  mounted() {
    this.$root.$on("updateVideoThumb", (id) => {
      if (this.media.id === id) this.getImg();
    });
    this.$root.$on("updateVideoFrames", (id) => {
      if (this.media.id === id) this.initFrames();
    });
    this.$root.$on("updateVideoMetadata", (id) => {
      if (this.media.id === id) this.getMetadata();
    });
  },
  beforeDestroy() {
    this.$root.$off("updateVideoThumb");
    this.$root.$off("updateVideoFrames");
    this.$root.$off("updateVideoMetadata");
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
        filesize: Vue.prototype.$getReadableFileSize(this.media.filesize),
        fileExtension: Vue.prototype.$getFileExtensionFromPath(this.media.path),
        resolution: this.metadata.width + "x" + this.metadata.height,
      };
    },
    duration() {
      return Vue.prototype.$getReadableDuration(this.metadata.duration);
    },
    progress() {
      if (!this.metadata.time) return 0;
      return (Number(this.metadata.time || 0) / this.metadata.duration) * 100;
    },
    fileName() {
      return Vue.prototype.$getFileNameFromPath(this.media.path);
    },
    Items() {
      return this.$store.state.Items;
    },
    sets() {
      return this.$store.state.settings;
    },
    frameLost() {
      if (this.frame) return this.frame.includes("unavailable.png");
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
        this.$store.state.mediaPath,
        "videos/thumbs",
        this.media.id + ".jpg"
      );
      this.thumb = await Vue.prototype.$getLocalImage(imgPath);
      if (this.isFileExists && this.thumb.includes("unavailable.png"))
        this.createThumb(imgPath);
    },
    // mountSrc() {
    //   this.$refs.video.src = this.media.path
    // },
    createThumb(imgPath) {
      axios({
        method: "post",
        url: this.apiUrl + "/api/task/createThumbForVideo",
        data: {
          path: this.media.path,
          id: this.media.id,
        },
      })
        .then(async (res) => {
          this.thumb = await Vue.prototype.$getLocalImage(imgPath);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getMetadata() {
      let url = `/api/VideoMetadata/${this.media.id}`;
      axios
        .get(this.apiUrl + url)
        .then((res) => {
          this.metadata = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getItems() {
      let url = `/api/ItemsInMedia?mediaId=${this.media.id}`;
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
      let url = `/api/ValuesInMedia?mediaId=${this.media.id}`;
      axios
        .get(this.apiUrl + url)
        .then((res) => {
          this.values = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    edit() {
      this.$store.state.Dialogs.mediaEditing.show = true;
      this.$store.state.Dialogs.mediaEditing.media = this.media;
    },
    play(inApp) {
      if (!this.isFileExists) {
        this.$store.state.Dialogs.error.show = true;
        let text = `File not found on path: \n"${this.media.path}"`;
        this.$store.state.Dialogs.error.text = text;
        return;
      }
      if (this.sets.isPlayVideoInSystemPlayer == "1" && !inApp) {
        this.openPath(this.media.path, false);
        return;
      }
      this.$store.state.Player.active = true;
      let items = _.cloneDeep(this.$store.state.Items.itemsOnPage);
      // if (items.length > this.x + 50) {
      //   let start = 0;
      //   if (this.x > 10) start = this.x - 10;
      //   items = items.slice(start, this.x + 50);
      // }
      this.$root.$emit("playVideo", this.media, items);
    },
    playPreview() {
      if (this.isHovered) return;
      this.isHovered = true;
      if (this.sets.videoPreviewHover !== "video") return;
      // this.timeouts.z = setTimeout(() => {
      //   // play original video
      //   if (!this.isVideoExist) return;
      //   this.$refs.video.src = this.media.path;
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
        this.$store.state.mediaPath,
        "videos/timelines",
        `${this.media.id}_${progress}.jpg`
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
        if (i == 0 && img.includes("unavailable.png")) {
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
      let res = await Vue.prototype.$checkFileExists(this.media.path);
      this.isFileExists = res.status == 201;
    },
    async setVal(val, key) {
      await axios({
        method: "put",
        url: this.apiUrl + "/api/media/" + this.media.id,
        data: {
          [key]: val,
        },
      });
      this.$root.$emit("getItemsFromDb", []);
    },
    showMenu(e) {
      e.preventDefault();
      let contextMenu = [];
      contextMenu.push({
        name: `Edit`,
        type: "item",
        icon: "pencil",
        action: () => {
          this.edit();
        },
      });
      contextMenu.push({
        name: `Parse Metadata`,
        type: "item",
        icon: "text-box-search",
        action: () => {
          this.parseMetadata();
        },
      });
      contextMenu.push({ type: "divider" });
      if (!this.Items.isSelect)
        contextMenu.push({
          name: `Open video in`,
          type: "menu",
          icon: "play-circle",
          disabled: !this.isFileExists,
          menu: [
            {
              name: `Application`,
              type: "item",
              icon: "movie-open-play",
              disabled: !this.isFileExists,
              action: () => {
                this.play(true);
              },
            },
            {
              name: `External Player`,
              type: "item",
              icon: "cog-play",
              disabled: !this.isFileExists,
              action: () => {
                this.openPath(this.media.path);
              },
            },
          ],
        });
      if (!this.Items.isSelect)
        contextMenu.push({
          name: `Open file folder`,
          type: "item",
          icon: "folder-open",
          disabled: !this.isFileExists,
          action: () => {
            this.openPath(this.media.path, true);
          },
        });
      contextMenu.push({ type: "divider" });
      contextMenu.push({
        name: `Delete`,
        type: "item",
        icon: "delete",
        color: "red",
        action: () => {
          this.dialogDeleting = true;
        },
      });
      this.$store.dispatch("showContextMenu", {
        x: e.clientX,
        y: e.clientY,
        content: contextMenu,
      });
    },
    async parseMetadata() {
      let videos = [];
      if (this.Items.isSelect) {
        let ids = this.Items.selection;
        let items = this.$store.state.Items.items;
        for (let id of ids) {
          const x = items.findIndex((i) => i.id === id);
          if (x > -1) videos.push(items[x]);
        }
      } else videos.push(this.media);

      let vals = [];
      let updated = [];
      for (let i of videos) {
        const v = Vue.prototype.$parseFilePath(i.path, i.id);
        if (v.length > 0) updated.push(i.id);
        vals = [...vals, ...v];
      }

      let added = [];
      for (let i of vals) {
        await axios({
          method: "post",
          url: this.apiUrl + "/api/ItemsInMedia/createOne",
          data: i,
        })
          .then((res) => {
            if (res.data[1]) added.push(1);
          })
          .catch((e) => {
            console.log(e);
          });
      }
      this.$store.commit("setNotification", {
        type: added.length > 0 ? "success" : "info",
        text: `Parsing completed. Items added: ${added.length}`,
      });
      if (added.length > 0) this.$root.$emit("getItemsFromDb", updated);
    },
    openPath(entryPath, isDir) {
      if (!this.isFileExists) return;
      Vue.prototype.$openPath(entryPath, isDir);
    },
  },
  watch: {
    "Items.view"(view) {
      if (view == "2") this.initFrames();
    },
    upd(arr) {
      if (arr.includes(this.media.id)) {
        this.getItems();
        this.getValues();
      }
    },
  },
};
</script>