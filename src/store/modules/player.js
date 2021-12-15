import Vue from "vue";

const Player = {
  state: () => ({
    player: null,
    active: false,
    fullscreen: false,
    statusText: "",
    statusIcon: "",
    statusTimeout: -1,
    playlistVisible: false,
    markersVisible: false,
    hideControls: false,
    mouseOverControls: false,
    // Video 
    duration: 1,
    volume: 1,
    muted: false,
    paused: false,
    currentTime: 0,
    currentTimeTimeout: -1,
    seekTime: 0,
    seeking: false,
    playbackError: null,
    // Playlist
    isPlaylistVisible: false,
    nowPlaying: 0,
    playlist: [],
    playlistShuffle: [],
    playlistMode: ['autoplay'],
    // Markers
    isMarkersVisible: false,
    markers: [],
    markerBookmarkText: '',
    metaForMarker: '',
    markerMetaId: null,
    nameForNewMetaCard: '',
    dialogMarkerMeta: false,
    dialogAddNewMetaCard: false,
    dialogListView: false,
    dialogMarkerBookmark: false,
    dialogRemoveMarker: false,
    markerForRemove: {},
    markersType: ['favorite', 'bookmark'],
  }),
  mutations: {
    trackCurrentTime(state) {
      let timeout = 100;
      if (state.duration > 200) timeout = 1000;
      state.currentTimeTimeout = setInterval(() => {
        state.currentTime = state.player.currentTime;
      }, timeout);
    },
  },
  actions: {
    playerPlay({
      state,
      dispatch,
      commit
    }) {
      state.player.play()
      state.paused = false
      dispatch('changePlayerStatusText', {
        text: "Play",
        icon: "play",
      })
      commit('trackCurrentTime')
    },
    playerPause({
      state,
      dispatch
    }) {
      state.player.pause();
      state.paused = true;
      dispatch('changePlayerStatusText', {
        text: "Paused",
        icon: "pause",
      })
      clearInterval(state.currentTimeTimeout);
    },
    playerStop({
      state
    }) {
      state.player.pause();
      state.paused = true;
      state.player.currentTime = 0;
      state.currentTime = 0;
      clearInterval(state.currentTimeTimeout);
    },
    playerJumpTo({
      state,
      dispatch
    }, {
      time
    }) {
      state.player.currentTime = time;
      state.currentTime = time;
      dispatch("changePlayerStatusText", {
        text: Vue.prototype.$getReadableDuration(time),
        icon: "arrow-u-down-right",
      });
    },
    changePlayerStatusText({
      state
    }, {
      text,
      icon
    }) {
      clearInterval(state.statusTimeout);
      state.statusText = text;
      state.statusIcon = icon;
      state.statusTimeout = setTimeout(() => {
        state.statusText = ''
        state.statusIcon = ''
      }, 3000)
    },
  },
  getters: {}
}

export default Player