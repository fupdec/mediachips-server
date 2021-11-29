<template>
<vuescroll>
  <div>Media total: {{totalMedia}}</div>
  <div class="d-flex justify-space-between align-center pa-2">
    <div class="d-flex">
      <v-text-field v-model="queryString" @keyup.enter="getMedia" label="Search in path" outlined dense hide-details/>
      <v-btn @click="getMedia" height="40" color="primary"> 
        <v-icon>mdi-magnify</v-icon></v-btn>
    </div>
  </div>

  <v-pagination v-model="page" @input="getMedia" :length="totalPages" total-visible="5"/>

  <Loading v-show="isQueryRun"/>

  <v-container fluid class="card-grid wide-image videos-selection">
    <VideoCard v-for="i in media" :key="i.id" :video="i" @openPlayer="openPlayer($event)"/>
  </v-container>

  <v-pagination v-model="page" @input="getMedia" :length="totalPages" total-visible="5"/>

  <v-dialog v-if="dialogPlayer" v-model="dialogPlayer">
    <video :src="src" autoplay controls />
  </v-dialog>
</vuescroll>
</template>


<script>
import axios from 'axios'
import vuescroll from 'vuescroll'

export default {
  name: 'Media',
  components: {
    vuescroll,
    VideoCard: () => import('@/components/media/video/VideoCard.vue'),
    Loading: () => import('@/components/elements/Loading.vue'),
  },
  mounted () {
    this.$nextTick(() => {
      this.getMedia()
    })
  },
  data: ()=>({
    apiUrl: 'http://192.168.1.120.:5555',
    media: [],
    totalMedia: 0,
    totalPages: 0,
    page: 1,
    isQueryRun: false,
    queryString: '',
    dialogPlayer: false,
    src: '',
  }),
  computed: {
  },
  methods: {
    getMedia() {
      this.isQueryRun = true
      let url = `/api/media?type=1&page=${this.page-1}&size=20&query=${this.queryString}`
      axios.get(this.apiUrl + url)
        .then(response => {
          this.isQueryRun = false
          this.media = response.data.items
          this.totalMedia = response.data.totalItems
          this.totalPages = response.data.totalPages
        })
        .catch(e => {
          this.isQueryRun = false
          console.log(e)
        })
    },
    createVideo() {
      axios.post(this.apiUrl + '/api/db')
        .then(response => {
          console.log('Create video')
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    },
    openPlayer(e) { 
      this.dialogPlayer = true
      this.src = this.apiUrl+'/api/video/'+e 
    },
  },
  watch: {
  }
}
</script>