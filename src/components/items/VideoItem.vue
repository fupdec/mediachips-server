<template>
  <v-lazy>
    <v-card
      @click="openPlayer"
      v-ripple="{ class: 'accent--text' }"
      :class="{ favorite: isFavorite }"
      outlined
      hover
      class="video-card meta-card"
    >
      <v-responsive>
        <v-img :src="thumb" :aspect-ratio="16 / 9" />
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

        <v-btn
          @click="isFavorite = !isFavorite"
          icon
          absolute
          :color="isFavorite === false ? 'white' : 'pink'"
          class="fav-btn"
        >
          <v-icon :color="isFavorite === false ? 'grey' : 'pink'"
            >mdi-heart-outline</v-icon
          >
        </v-btn>

        <div class="duration">{{ duration }}</div>

        <div label outlined class="resolution">
          <div class="text text-no-wrap" :class="quality.toLowerCase()">
            {{ quality }}
          </div>
          <div class="value">
            <span>{{ height }}</span>
          </div>
        </div>

        <!-- <video @click="mountSrc" ref="video" controls /> -->
      </v-responsive>
      <!-- <div>VideoID: {{video.id}}</div> -->
      <div class="video-card-title" :title="fileName" v-html="fileName" />

      <!-- Video meta -->
      <v-chip label class="props px-2 py-1 mt-0 mx-1">
        <div label outlined class="prop" :title="video.path">
          <v-icon>mdi-folder-outline</v-icon>
          <span class="value">Path</span>
        </div>
        <div label outlined class="prop">
          <v-icon>mdi-file-video</v-icon>
          {{ fileExtension }}
        </div>
        <div label outlined class="prop">
          <v-icon>mdi-monitor-screenshot</v-icon>
          {{ video.VideoMetadata.width + "x" + video.VideoMetadata.height }}
        </div>
        <div label outlined class="prop">
          <v-icon>mdi-harddisk</v-icon>
          {{ filesize }}
        </div>
      </v-chip>

      <v-chip
        v-for="i in meta"
        :key="i.itemId"
        :color="i['Item.color']"
        :text-color="getTextColor(i['Item.color'])"
      >
        {{ i["Item.name"] }}
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
            <span v-if="getMeta(m.id).dataType=='array'">{{getArrayValuesForCard(m.id, 'video')}}</span>
            <span v-else-if="getMeta(m.id).dataType=='rating'">      
              <v-rating :value="video[m.id]" @input="changeMetaRating($event, m.id)" :length="getMeta(m.id).settings.ratingMax" hover 
                :full-icon="`mdi-${getMeta(m.id).settings.ratingIcon}`" :empty-icon="`mdi-${getMeta(m.id).settings.ratingIconEmpty||getMeta(m.id).settings.ratingIcon}`" 
                :color="getMeta(m.id).settings.ratingColor" background-color="grey" class="meta-rating" clearable
                :half-increments="getMeta(m.id).settings.ratingHalf" :half-icon="`mdi-${getMeta(m.id).settings.ratingIconHalf||getMeta(m.id).settings.ratingIcon}`"/>
            </span>
            <span v-else-if="getMeta(m.id).dataType=='boolean'">{{video[m.id]?'Yes':'No'}}</span>
            <span v-else>{{video[m.id]}}</span>
          </div>
        </div>
      </div> -->

      <v-icon
        v-if="video.bookmark"
        class="bookmark"
        color="red"
        :title="video.bookmark"
        >mdi-bookmark</v-icon
      >
    </v-card>
  </v-lazy>
</template>

<script>
import Vue from "vue";
import axios from "axios";

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
  name: "VideoItem",
  props: {
    video: Object,
    media: Array,
  },
  // mixins: [ShowImageFunction, Functions, LabelFunctions, MetaGetters],
  mounted() {
    this.$nextTick(() => {
      this.getMeta();
      this.getImg();
    });
    this.$root.$on("updateVideoThumb", (id) => {
      if (this.video.id === id) this.getImg();
    });
  },
  destroyed() {},
  data: () => ({
    meta: [],
    thumb: null,
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    quality() {
      return Vue.prototype.$getReadableVideoQuality(
        this.video.VideoMetadata.width,
        this.video.VideoMetadata.height
      );
    },
    height() {
      return Vue.prototype.$getReadableVideoHeight(
        this.video.VideoMetadata.width,
        this.video.VideoMetadata.height
      );
    },
    filesize() {
      return Vue.prototype.$getReadableFileSize(this.video.filesize);
    },
    duration() {
      return Vue.prototype.$getReadableDuration(
        this.video.VideoMetadata.duration
      );
    },
    fileName() {
      return Vue.prototype.$getFileNameFromPath(this.video.path);
    },
    fileExtension() {
      return Vue.prototype.$getFileExtensionFromPath(this.video.path);
    },
    isFavorite() {
      return this.video.favorite;
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
        this.video.oldId + ".jpg"
      );
      this.thumb = await Vue.prototype.$getLocalImage(imgPath);
    },
    // mountSrc() {
    //   this.$refs.video.src = this.video.path
    // },
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
    openPlayer() {
      this.$store.state.Player.active = true;
      this.$root.$emit("playVideo", this.video, this.media);
    },
    getTextColor(color) {
      if (!color) return ''
      let value = Vue.prototype.$checkColorForDarkText(color);
      if (value) return 'white'
      else return 'black'
    },
  },
  watch: {},
};
</script>