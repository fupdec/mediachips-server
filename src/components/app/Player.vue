<template>
  <v-dialog :value="isPlayerActive" @input="closePlayer" eager>
    <div ref="player" class="player" :class="{fullscreen}" id="player"
      @mousedown="stopSmoothScroll($event)" @mousemove="moveOverPlayer">
      <div class="player-wrapper">
        <div class="canvas-wrapper"
          @click="paused ? play() : pause()" 
          @dblclick="toggleFullscreen" @click.middle="toggleFullscreen" 
          @mousedown="handleMouseCanvas($event)" @contextmenu="showContextMenu($event)"
          @wheel="changeVolume" @keydown="handleKey" tabindex="-1">
          <video ref="videoPlayer" autoplay/>
          <div class="status-text">{{statusText}}</div>
        </div>
        <v-card class="controls" tile 
          @mouseenter="mouseOverControls = true" 
          @mouseleave="mouseOverControls = false"
          :style="{opacity:fullscreen&&hideControls&&!mouseOverControls&&!paused?0:fullscreen?0.7:1}">
          <v-card-actions class="timeline py-1 px-0 mx-3">
            <v-slider :value="seeking?seekTime:currentTime" 
              hide-details min="0" step="0.1" :max="duration" 
              @start="startSeeking($event)" @end="seek($event)" @mousedown="handleMouseSeek($event)"/>
            <Mark v-for="(mark,i) in markers" :key="i" :mark="mark" 
              :position="`left: ${mark.time/duration*100}%;`"
              @jumpTo="jumpTo($event)"/>
          </v-card-actions>
          <v-card-actions class="buttons pa-1">
            <v-btn-toggle class="remove-active compact">
              <v-btn @click="paused?play():pause()" small class="ml-1" :title="paused?'Play':'Pause'">
                <v-icon v-if="paused">mdi-play</v-icon>
                <v-icon v-else>mdi-pause</v-icon>
              </v-btn>
            </v-btn-toggle>
            <v-btn-toggle class="mx-2 remove-active compact">
              <v-btn @click="prev" small :disabled="isPrevDisabled" title="Previous Video">
                <v-icon>mdi-skip-previous</v-icon>
              </v-btn>
              <v-btn @click="stop" small title="Stop Playing">
                <v-icon>mdi-stop</v-icon>
              </v-btn>
              <v-btn @click="next" small :disabled="isNextDisabled" title="Next Video">
                <v-icon>mdi-skip-next</v-icon>
              </v-btn>
            </v-btn-toggle>
            <v-btn-toggle class="remove-active compact">
              <v-btn @click="toggleFullscreen" small :title="fullscreen?'Exit Fullscreen':'Fullscreen'">
                <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
                <v-icon v-else>mdi-fullscreen</v-icon>
              </v-btn>
              <v-btn @click="togglePictureInPicture" small title="Picture-in-Picture Mode">
                <v-icon size="20">mdi-picture-in-picture-bottom-right</v-icon>
              </v-btn>
            </v-btn-toggle>
            <v-btn-toggle class="ml-4 remove-active compact">
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
            <v-btn-toggle class="mx-4 remove-active marker-buttons compact">
              <v-btn @click="toggleMarkers" :color="isMarkersVisible? 'primary':''" small title="Markers List">
                <v-icon>mdi-map-marker</v-icon>
              </v-btn>
              <v-btn @click="jumpToPrevMarker" small class="marker-prev" title="Previous Marker">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn @click="jumpToNextMarker" small class="marker-next" title="Next Marker">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
              <v-menu offset-y nudge-top="40" nudge-right="400" attach=".controls">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" small title="Add Marker">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                
                <!-- <v-btn-toggle class="remove-active">
                  <v-btn @click="addMarker('favorite')" title="Favorite">
                    <v-icon size="20">mdi-heart</v-icon> 
                  </v-btn>
                  <v-btn @click="openDialogMarkerBookmark" title="Bookmark">
                    <v-icon size="20">mdi-bookmark</v-icon> 
                  </v-btn>
                  <v-btn v-for="m in metaMarkers" :key="m.id" :value="m.id" @click="openDialogMarkerMeta(m.id)" :title="m.settings.name">
                    <v-icon size="20">mdi-{{m.settings.icon}}</v-icon>
                  </v-btn>
                </v-btn-toggle> -->
              </v-menu>
            </v-btn-toggle>
            <v-btn-toggle class="remove-active compact">
              <v-btn @click="togglePlaylist" :color="isPlaylistVisible?'primary':''" small title="Playlist">
                <v-icon>mdi-format-list-bulleted</v-icon>
              </v-btn>
            </v-btn-toggle>
            <v-spacer></v-spacer>
            <div class="duration mx-2">
              <div class="time-start">{{ msToTime(currentTime * 1000) }}</div>
              <span class="mx-1">/</span>
              <div class="time-end">{{ msToTime(duration * 1000) }}</div>
            </div>
            <v-slider v-model="volume" value="1" min="0" step="0.05" max="1" hide-details 
              :prepend-icon="volumeIcon" @click:prepend="toggleMute" class="volume"/>
          </v-card-actions>
        </v-card>
      </div>
      <Playlist :videos="videos" @play="playFromPlaylist($event)"/>
      <Markers @jumpTo="jumpTo($event)"/>
    </div>
  </v-dialog>
</template>


<script>
const fs = require("fs")
const path = require('path')

import axios from 'axios'
import vuescroll from 'vuescroll'

export default {
  name: "Player",
  components: {
    Playlist: () => import('@/components/app/player/Playlist.vue'),
    Markers: () => import('@/components/app/player/Markers.vue'),
    Mark: () => import('@/components/app/player/Mark.vue'),
    vuescroll,
  },
  mounted() {
    this.player = this.$refs.videoPlayer
    this.initPlayer()
    document.addEventListener("mousemove", this.controlsMove, false)
    document.addEventListener("mouseup", this.controlsUp, false)
    window.addEventListener('resize', this.getCanvasSizes)
    this.$root.$on('playVideo', (video, videos) => {
      this.videos = videos.map(i=>({...i,...{thumb:path.join(__dirname, '/images/ghost.png')}}))
      this.loadSrc(video)
    })
  },
  data: () => ({
    canvasSizes: '',
    menu: false,
    player: null,
    fullscreen: false,
    moveTimeout: -1,
    hideControls: false,
    mouseOverControls: false,
    statusText: '',
    statusTextTimeout: null,
    videos: [],
    // video properties 
    duration: 1,
    volume: 1,
    muted: false,
    paused: false,
    seeking: false,
    seekTime: 0,
    currentTime: 0,
    currentTimeTracker: null,
    isVideoFormatNotSupported: null,
    isVideoNotExist: null,
    seekTime: 0,
  }),
  computed: {
    apiUrl() { return this.$store.state.localhost },
    isPrevDisabled() { return true },
    isNextDisabled() { return true },
    volumeIcon() {
      if (this.muted) return 'mdi-volume-mute'
      if (this.volume > 0.7) return 'mdi-volume-high'
      if (this.volume > 0.3) return 'mdi-volume-medium'
      return 'mdi-volume-low'
    },
    isPlayerActive: {
      get() { return this.$store.state.player.active },
      set(value) { this.$store.state.player.active = value },
    },
    isPlaylistVisible: {
      get() { return this.$store.state.player.playlistVisible },
      set(value) { this.$store.state.player.playlistVisible = value },
    },
    isMarkersVisible: {
      get() { return this.$store.state.player.markersVisible },
      set(value) { this.$store.state.player.markersVisible = value },
    },
    markers: {
      get() { return this.$store.state.player.markers },
      set(value) { this.$store.state.player.markers = value },
    },
    nowPlaying: {
      get() { return this.$store.state.player.nowPlaying },
      set(value) { this.$store.state.player.nowPlaying = value },
    },
  },
  methods: {
    closePlayer() {
      this.player.src = null
      this.currentTime = 0
      this.isPlayerActive = false
    },
    playFromPlaylist(video) { 
      this.loadSrc(video)
    },
    initPlayer() {
      this.player.addEventListener('loadedmetadata', () => { 
        this.duration = this.player.duration
      })
      // this.player.addEventListener('ended', (event) => {
      //   if (this.playlistMode.includes('autoplay')) this.next()
      // })
      // this.player.addEventListener('error', (event) => {
      //   this.$emit("nowPlaying", _.cloneDeep(this.videos[this.nowPlaying]))
      //   if (fs.existsSync(this.videos[this.nowPlaying].path)) {
      //     this.isVideoFormatNotSupported = true
      //     this.isVideoNotExist = false
      //   } else {
      //     this.isVideoFormatNotSupported = false
      //     this.isVideoNotExist = true
      //   }
      // })
    },
    loadSrc(video) {
      this.player.src = this.apiUrl+'/api/video/'+ video.id
      this.getMarkers(video)
      this.trackCurrentTime()
      clearTimeout(this.statusTextTimeout)
      let fileName = video.path.replace(/^.*[\\\/]/, '')
      this.statusText = `${this.nowPlaying+1}. ${fileName}`
      this.statusTextTimeout = setTimeout(() => {this.statusText = ''}, 3000)
      // this.isVideoFormatNotSupported = false
      // this.isVideoNotExist = false
      // if (!this.reg && this.nowPlaying>4) this.player.src = ''
    },
    async getMarkers(video) {
      await axios.get(this.apiUrl + '/api/markers/' + video.id)
        .then(res => {
          this.markers = res.data
        })
        .catch(e => {
          console.log(e)
        })
      // create marker thumb
      // for (let i=0; i<markers.length; i++) {
      //   let imgPath = path.join(this.pathToUserData, `/media/markers/${markers[i].id}.jpg`)
      //   if (fs.existsSync(imgPath)) continue
      //   let specificTime = new Date(1000*markers[i].time).toISOString().substr(11, 8)
      //   this.createMarkerThumb(specificTime, video.path, imgPath, 180)
      //     .then(result => { /*console.log('thumb created')*/ })
      //     .catch(error => { /*console.log(error)*/ })
      // }
    },
    getCanvasSizes() {
      let windowWidth = document.documentElement.clientWidth
      let windowHeight = document.documentElement.clientHeight
      if (this.$refs.canvas) {
        let canvasRatio = this.$refs.canvas.width / this.$refs.canvas.height
        let heightOffset = this.fullscreen ? 0 : 114
        let widthOffset = (this.isMarkersVisible ? (windowWidth/100*18) : 0) + (this.isPlaylistVisible ? (windowWidth/100*18) : 0)
        let windowRatio = (windowWidth - widthOffset) / (windowHeight - heightOffset)
        this.canvasSizes = canvasRatio > windowRatio ? '':'width:auto;height:100%;'
      } else this.canvasSizes = ''
    },
    updateVideoPlayer(data) {
      this.videos = data.videos
      this.nowPlaying = _.findIndex(data.videos, {id: data.id})
      this.player.src = path.join('file://', this.videos[this.nowPlaying].path)
      this.player.play()
    }, 
    moveOverPlayer(e) {
      if (!e.movementX > 0 || !e.movementY > 0) return
      this.hideControls = false
      clearTimeout(this.moveTimeout)
      this.moveTimeout = setTimeout(() => { this.hideControls = true }, 1000);
    },
    msToTime(ms, keepMs = false) {
      if (isNaN(ms)) return `00:00` + keepMs ? ".00" : ""
      let hms = new Date(ms).toISOString().substr(11, keepMs ? 11 : 8).replace(/^0+/, "")
      hms = hms.startsWith(":") ? hms.substr(1) : hms;
      return hms.startsWith("00") ? hms.substr(1) : hms;
    },
    toggleFullscreen() {
      if (this.fullscreen) document.exitFullscreen()
      else document.getElementById('player').requestFullscreen()
      this.fullscreen = !this.fullscreen
      setTimeout(() => { this.getCanvasSizes() }, 100)
      setTimeout(() => { this.getCanvasSizes() }, 500)
      setTimeout(() => { this.getCanvasSizes() }, 1000)
    },
    async togglePictureInPicture() {
      if (this.player !== document.pictureInPictureElement) {
        await this.player.requestPictureInPicture()
      } else await document.exitPictureInPicture()
    },
    setAsThumb() {
      let video = this.videos[this.nowPlaying]
      let imgPath = path.join(this.pathToUserData, `/media/thumbs/${video.id}.jpg`)
      let specificTime = new Date(this.currentTime*1000).toISOString().substr(11, 8)
      this.createMarkerThumb(specificTime, video.path, imgPath, 320)
        .then(result => { console.log('thumb created') })
        .catch(error => { console.log(error) })
    },
    trackCurrentTime() {
      let timeout = 100
      if (this.duration > 200) timeout = 1000
      this.currentTimeTracker = setInterval(() => {this.currentTime = this.player.currentTime}, timeout)
    },
    playVideoInSystemPlayer() { shell.openPath(this.videos[this.nowPlaying].path) },
    playVideo(video) {
      this.player.src = video.path
      this.player.play()
      ipcRenderer.send('videoWatched', video.id)
    },
    getFileNameFromPath(videoPath) { return path.parse(videoPath).name },
    getFileFromPath(videoPath) { return path.basename(videoPath) },
    // CONTROLS
    play() {
      this.player.play()
      this.paused = false
      this.trackCurrentTime()
    },
    pause() {
      this.player.pause()
      this.paused = true
      clearInterval(this.currentTimeTracker)
    },
    stop() {
      this.player.pause()
      this.player.currentTime = 0
      this.currentTime = 0
      this.paused = true
      clearInterval(this.currentTimeTracker)
    },
    prev() {
      if (this.isPrevDisabled) return
      let isLoopMode = this.playlistMode.includes('loop')

      if (this.playlistMode.includes('shuffle')) {
        let shuffleIndex = this.playlistShuffle.indexOf(this.nowPlaying)
        shuffleIndex = shuffleIndex - 1
        if (isLoopMode && shuffleIndex < 0) shuffleIndex = this.videos.length-1 // if loop mode
        this.nowPlaying = this.playlistShuffle[shuffleIndex]
      } else {
        this.nowPlaying = this.nowPlaying - 1
        if (isLoopMode && this.nowPlaying < 0) this.nowPlaying = this.videos.length-1 // if loop
      }
      this.playVideo(this.videos[this.nowPlaying])
      if (!this.isPlaylistVisible) return // scroll to now playing in playlist
      const height = `${this.nowPlaying * document.documentElement.clientWidth / 10}`
      this.$refs.playlist.scrollTo({ y: height }, 50)
    },
    next() {
      if (this.isNextDisabled) return
      let isLoopMode = this.playlistMode.includes('loop')

      if (this.playlistMode.includes('shuffle')) {
        let shuffleIndex = this.playlistShuffle.indexOf(this.nowPlaying)
        shuffleIndex = shuffleIndex + 1
        if (isLoopMode && shuffleIndex == this.videos.length) shuffleIndex = 0 // if loop mode
        this.nowPlaying = this.playlistShuffle[shuffleIndex]
      } else {
        this.nowPlaying = this.nowPlaying + 1
        if (isLoopMode && this.nowPlaying > this.videos.length-1) this.nowPlaying = 0 // if loop mode
      }
      this.playVideo(this.videos[this.nowPlaying])

      if (!this.isPlaylistVisible) return  // scroll to now playing in playlist
      const height = `${this.nowPlaying * document.documentElement.clientWidth / 10}`
      this.$refs.playlist.scrollTo({ y: height }, 50)
    },
    startSeeking(e) {
      this.seeking = true
      this.seekTime = e
    },
    seek(e) {
      this.seeking = false
      this.player.currentTime = e
      this.currentTime = e
    },
    jumpTo(e) {
      this.player.currentTime = e
      this.currentTime = e
    },
    jumpToPrevMarker() {
      let markers = _.orderBy(this.markers, 'time', ['desc'])
      let currentTime = this.player.currentTime - 5
      for (let i=0; i<markers.length; i++) {
        let markerTime = markers[i].time
        if (markerTime < currentTime) { this.player.currentTime = markerTime; break }
      }
    },
    jumpToNextMarker() {
      let markers = this.markers
      let currentTime = this.player.currentTime
      for (let i=0; i<markers.length; i++) {
        let markerTime = markers[i].time
        if (markerTime > currentTime) { this.player.currentTime = markerTime; break }
      }
    },
    showContextMenu(e) {
      e.preventDefault()
      this.menu = true
      this.$store.state.x = e.clientX
      this.$store.state.y = e.clientY
    },
    stopSmoothScroll(event) {
      if (event.button != 1) return
      event.preventDefault()
      event.stopPropagation()
    },
    toggleMute() {
      this.player.muted = !this.player.muted
      this.muted = this.player.muted
    },
    increaseVolume() {
      if (this.player.volume >= 1) return
      this.player.volume += 0.1
      this.volume = this.player.volume
    },
    decreaseVolume() {
      if (this.player.volume == 0) return
      this.player.volume -= 0.1
      this.volume = this.player.volume
    },
    changeVolume(e) {
      if (e.deltaY>0) { if (this.player.volume == 0) return }
      else if (this.player.volume >= 1) return
      this.player.volume = (this.player.volume - e.deltaY / 1000 / 2).toFixed(2)
      this.volume = this.player.volume
    },
    jumpToSeconds(e) {
      this.player.currentTime = this.player.currentTime + e
    },
    handleKey(e) {
      switch (true) {
        case e.key === ' ': this.player.togglePause(); break
        case e.key === 'ArrowRight': this.player.currentTime += 10; break
        case e.key === 'ArrowLeft': this.player.currentTime -= 10; break
        case e.key === 'ArrowUp': this.changeVolume({deltaY:-100}); break
        case e.key === 'ArrowDown': this.changeVolume({deltaY:+100}); break
        case e.key === 'f': this.toggleFullscreen(); break
        case e.key === 'p': this.togglePlaylist(); break
        case e.key === 'm': this.toggleMarkers(); break
        case e.key === ',': this.jumpToPrevMarker(); break
        case e.key === '.': this.jumpToNextMarker(); break
        case e.key === 'z': this.prev(); break
        case e.key === 'c': this.next(); break
        case e.key === 'x': this.stop(); break
        case e.key === '1': this.addMarker('favorite'); break
        case e.key === '2': this.openDialogMarkerBookmark(); break
        case e.key === 'Escape': this.fullscreen ? this.toggleFullscreen() : ''; break
      }
    },
    handleMouseCanvas(e) {
      let btnCode = e.button
      switch (btnCode) {
        case 3: this.prev(); break
        case 4: this.next(); break
      }
    },
    handleMouseSeek(e) {
      let btnCode = e.button
      switch (btnCode) {
        // case 0: // clearInterval(this.currentTimeTracker); break
        // case 1: // clearInterval(this.currentTimeTracker); break
        // case 2: // clearInterval(this.currentTimeTracker); break
        case 3: this.jumpToPrevMarker(); break
        case 4: this.jumpToNextMarker(); break
      }
    },
    toggleMarkers() {
      this.isMarkersVisible=!this.isMarkersVisible
    },
    togglePlaylist() {
      this.isPlaylistVisible=!this.isPlaylistVisible
      setTimeout(() => { this.getCanvasSizes() }, 100)
      if (!this.isPlaylistVisible) return
      // const height = `${this.nowPlaying * document.documentElement.clientWidth / 10}`
      // this.$refs.playlist.scrollTo({ y: height }, 50)
    },
  },
  watch: {
    volume(newValue, oldValue) { if (newValue !== oldValue) this.player.volume = newValue },
  },
};
</script>


<style lang="scss">
.player {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  &.fullscreen {
    .controls {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 80%;
      min-width: 800px;
      border-radius: 5px 5px 0 0 !important;
      margin: auto;
    }
    .canvas-wrapper {
      max-height: 100%;
    }
    .markers-wrapper,
    .playlist-wrapper {
      .items {
        height: calc(100vh - 80px) !important;
      }
    }
  }
  .player-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    &.markers {
      width: calc(100% - 18vw);
    }
    &.playlist {
      width: calc(100% - 18vw);
    }
    &.markers.playlist {
      width: calc(100% - 36vw);
    }
  }
  .remove-active {
    .v-btn {
      opacity: 0.8 !important;
    }
    .v-btn--active:before {
      opacity: 0 !important;
    }
    &.compact {
      .v-btn {
        padding: 0;
        min-width: 28px;
      }
    }
  }
  .canvas-wrapper {
    width: 100%;
    height: 100%;
    max-height: 80vh;
    // max-height: calc(100vh - 34px - 80px);
    display: flex;
    // align-items: center;
    justify-content: center;
    background-color: #000;
    &.system-title-bar {
      max-height: 100%;
    }
  }
  .canvas {
    background: #fff;
    width: 100%;
    height: auto;
  }
  .reg-block {
    position: absolute;
    top: 40%;
    right: 20%;
    left: 20%;
    z-index: 3;
    background-color: hsla(0, 0%, 30%, 0.7);
    color: #fff;
    text-transform: uppercase;
    text-align: center;
    padding: 10px;
  }
  .reg-playlist {
    background-color: #414141;
    color: #fff;
    padding: 4px;
    position: absolute;
    left: 5%;
    right: 5%;
    text-align: center;
    font-size: 1vw;
    line-height: 1;
    text-transform: uppercase;
  }
  video {
    min-width: 100%;
    min-height: 100%;
    object-fit: contain;
  }
}
.video-error {
  position: absolute;
  color: rgb(255, 50, 50);
  margin: auto;
  left: calc(50% - 150px);
  top: 30%;
  width: 300px;
  text-align: center;
}
.controls {
  position: relative;
  padding-top: 0;
  .timeline {
    position: relative;
    &:hover {
      .marker {
        width: 2vw;
        height: 10px;
        transform: translateX(-1vw) translateY(-15px);
        border-radius: 0 0 2px 2px;
      }
    }
    .v-slider {
      margin: 0;
    }
  }
  .duration {
    display: flex;
  }
  .volume {
    min-width: 60px;
    max-width: 100px;
    .v-input__prepend-outer {
      margin-right: 0;
    }
  }
  // .hoverable {
  //   &:hover {
  //     .hidden {
  //       width: 50px !important;
  //       border-width: 1px !important;
  //       .v-btn__content {
  //         display: flex;
  //       }
  //     }
  //   }
  // }
  // .hidden {
  //   min-width: 0 !important;
  //   width: 0 !important;
  //   padding: 0 !important;
  //   transition: .3s;
  //   border-width: 0 !important;
  //   .v-btn__content {
  //     display: none;
  //   }
  // }
  .v-slider__thumb:before,
  .v-slider__thumb:after {
    display: none;
  }
}
.theme--light {
  .controls {
    .timeline {
      .tooltip {
        background-color: rgba(255, 255, 255, 0.75);
      }
    }
  }
  .markers-wrapper {
    .marker {
      .time {
        background-color: rgba(236, 236, 236, 0.6);
      }
    }
  }
}
.status-text {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 5px;
  font-size: 1.5vw;
  color: white;
  background-color: rgba(0, 0, 0, 0.363);
}
@media (max-width: 920px) {
  .player-wrapper {
    &.markers {
      .marker-buttons {
        .marker-prev,
        .marker-next {
          display: none;
        }
      }
    }
  }
}
</style>