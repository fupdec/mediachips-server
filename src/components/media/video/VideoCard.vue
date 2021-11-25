<template>
  <v-lazy>
    <v-card @click="openPlayer" v-ripple="{ class: 'accent--text' }" :class="{favorite: isFavorite}" outlined hover
      class="video-card meta-card">
      <v-responsive>
        <v-img :src="getImg" :aspect-ratio="16/9"/>
        <v-rating  
          :value="video.rating" @input="changeRating($event, video.id)"
          class="rating rating-wrapper"
          color="yellow darken-2" background-color="grey darken-1"
          empty-icon="mdi-star-outline" half-icon="mdi-star-half-full"
          dense half-increments hover clearable />
        
        <v-btn 
          @click="isFavorite = !isFavorite" icon absolute 
          :color="isFavorite===false ? 'white' : 'pink'" class="fav-btn"
        > <v-icon :color="isFavorite===false?'grey':'pink'">mdi-heart-outline</v-icon>
        </v-btn>
        
        <div class="duration">{{calcDur(video.VideoMetadata.duration)}}</div>

        <div label outlined class="resolution">
          <div class="text text-no-wrap" :class="video.VideoMetadata.height">
            HD
          </div>
          <div class="value">
            <span>{{video.VideoMetadata.height}}</span>
          </div>
        </div>
        
        <!-- <video @click="mountSrc" ref="video" controls /> -->
      </v-responsive>

      <!-- <div class="video-card-title" :title="fileName" v-html="fileName"/> -->

      <!-- Video meta -->
      <v-chip label class="props px-2 py-1 mt-0 mx-1">
        <div label outlined class="prop" :title="video.path">
          <v-icon>mdi-folder-outline</v-icon>
          <span class="value">Path</span>
        </div>
        <div label outlined class="prop">
          <v-icon>mdi-monitor-screenshot</v-icon>
          {{video.VideoMetadata.width+'x'+video.VideoMetadata.height}}
        </div>
        <div label outlined class="prop">
          <v-icon>mdi-harddisk</v-icon>
          {{calcSize(video.filesize)}}
        </div>
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
      
      <v-icon v-if="video.bookmark" class="bookmark" color="red" :title="video.bookmark">mdi-bookmark</v-icon>
    </v-card>
  </v-lazy>
</template>

<script>
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
  name: 'VideoCard',
  props: {
    video: Object,
  },
  // mixins: [ShowImageFunction, Functions, LabelFunctions, MetaGetters],
  mounted() {
    this.$nextTick(() => {
    })
  },
  destroyed() {
  },
  data: () => ({
  }),
  computed: {
    videoPath() { return this.video.path },
    fileName() { return this.video.path },
    fileExtension() { return this.video.path },
    isFavorite() { return this.video.favorite === 1 ? true : false },
    getImg() { return '/images/media/thumbs/' + this.video.oldId + '.jpg' },
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
    // mountSrc() {
    //   this.$refs.video.src = this.video.path 
    // },
    openPlayer() {
      this.$emit('openPlayer', this.video.path)
    },
    calcSize(size) {
      if (size > 1000000000000) size = (size/1024/1024/1024/1024-0.01).toFixed(2) + ' TB'
      else if (size > 1000000000) size = (size/1024/1024/1024-0.01).toFixed(2) + ' GB'
      else if (size > 1000000) size = (size/1024/1024-0.01).toFixed(0) + ' MB'
      else if (size > 1000) size = (size/1024-0.01).toFixed(0) + ' KB'
      else size += ' B'
      return size
    },
    calcDur(duration) {
      let sec = Math.floor(duration);
      let h = sec / 3600 ^ 0 
      let m = (sec - h * 3600) / 60 ^ 0 
      let s = sec - h * 3600 - m * 60 
      h = h < 10 ? "0" + h + ":" : h
      if (h === "00:") h = ""
      m = m < 10 ? "0" + m : m
      s = s < 10 ? "0" + s : s
      let total = h + m + ":" + s
      return total
    },
  },
  watch: {
  }
}
</script>