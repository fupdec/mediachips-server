<template>
  <v-app>
    <v-app-bar app dense clipped-left extension-height="28">
      <v-toolbar-title>mediaChips</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer app permanent mini-variant expand-on-hover clipped>
      <v-list nav dense>
        <v-list-item link to="/" color="secondary" draggable="false"> 
          <v-list-item-icon>
            <v-icon>mdi-home-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/videos" color="secondary" draggable="false"> 
          <v-list-item-icon>
            <v-icon>mdi-video-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Videos</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main app>
      <!-- <router-view :key="$route.fullPath" /> -->
      <v-btn color="success" class="ma-2" @click="getDb">Get videos</v-btn>
      <!-- <v-btn color="success" class="ma-2" @click="createVideo">Create video</v-btn> -->

      <hr>

      <v-btn color="success" class="ma-2" @click="importData">Import database</v-btn>

      <Loading v-show="isQueryRun"/>

      <v-container fluid class="card-grid">
        <VideoCard v-for="v in videos" :key="v.id" :video="v"/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import Videos from 'C:/Users/vit/AppData/Roaming/mediaChips/userfiles/databases/dbv.json'
import Playlists from 'C:/Users/vit/AppData/Roaming/mediaChips/userfiles/databases/dbpl.json'
import Markers from 'C:/Users/vit/AppData/Roaming/mediaChips/userfiles/databases/dbm.json'
import Meta from 'C:/Users/vit/AppData/Roaming/mediaChips/userfiles/databases/meta.json'
import Settings from 'C:/Users/vit/AppData/Roaming/mediaChips/userfiles/dbs.json'
import VideoCard from '@/components/media/video/VideoCard.vue'
import Loading from './components/elements/Loading.vue'

export default {
  name: 'App',
  components: { 
    VideoCard,
    Loading,
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(Videos)
    })
  },
  data: () => ({
    apiUrl: 'http://localhost:5555',
    videos: [],
    isQueryRun: false,
  }),
  computed: {},
  methods: {
    getDb() {
      this.isQueryRun = true
      axios.get(this.apiUrl + '/api/db')
        .then(response => {
          this.isQueryRun = false
          console.log(response.data)
          this.videos = response.data.slice(0,100)
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
    importData() {
      this.isQueryRun = true
      let obj = { meta: [], items: [], videos: [],  videoMetadata: [], playlists: [], markers: [], onlyMeta: [], metaInItems: [], settings: Settings }
      obj.videos = Videos.videos.map(i=>({
        oldId: i.id,
        path: i.path,
        filesize: i.size,
        rating: i.rating || 0,
        favorite: i.favorite || false,
        bookmark: i.bookmark || null,
        views: i.views || 0,
        typeId: 1,
        createdAt: (new Date(i.date).toISOString()).replace('T',' ').replace('Z',' +00:00'),
        updatedAt: (new Date(i.edit).toISOString()).replace('T',' ').replace('Z',' +00:00'),
      }))
      obj.videoMetadata = Videos.videos.map((i,x)=>({
        // oldId: i.id, // its needed for parsing
        mediaId: x+1,
        duration: i.duration,
        width: +i.resolution.match(/\d*/)[0] || 0,
        height: +i.resolution.match(/\x(.*)/)[1] || 0,
      }))
      obj.playlists = Playlists.playlists.map(i=>({
        oldId: i.id,
        name: i.name,
        favorite: i.favorite || false,
        videos: i.videos || [],
        createdAt: (new Date(i.date).toISOString()).replace('T',' ').replace('Z',' +00:00'),
        updatedAt: (new Date(i.edit).toISOString()).replace('T',' ').replace('Z',' +00:00'),
      }))
      obj.markers = Markers.markers.map(i=>({
        time: i.time,
        videoId: i.videoId,
        text: ['favorite','bookmark'].includes(i.type.toLowerCase())?i.name:null,
        type: ['favorite','bookmark'].includes(i.type.toLowerCase())?i.type.toLowerCase():'meta',
        oldItemId: ['favorite','bookmark'].includes(i.type.toLowerCase())?null:i.name,
      }))
      // get meta
      for (let m of Meta.meta) {
        if (m.type === 'specific') continue
        if (m.type === 'simple') {
          let sm = {
            oldId: m.id,
            dataType: m.dataType,
            name: m.settings.name,
            nameSingular: m.settings.name,
            icon: m.settings.icon || 'shape',
            hint: m.settings.hint || '',
            createdAt: (new Date(m.date).toISOString()).replace('T',' ').replace('Z',' +00:00'),
            updatedAt: (new Date(m.edit).toISOString()).replace('T',' ').replace('Z',' +00:00'),
          }
          obj.meta.push(sm)
          if (m.dataType === 'array') {
            let items = m.settings.items.map(i=>({
              oldId: i.id,
              name: i.name,
            }))
            obj.items.push({[m.id]: items})
          }
        } else if (m.type === 'complex') {
          let cm = {
            oldId: m.id,
            dataType: 'array',
            name: m.settings.name,
            nameSingular: m.settings.nameSingular,
            icon: m.settings.icon || 'shape',
            hint: m.settings.hint || '',
            createdAt: (new Date(m.date).toISOString()).replace('T',' ').replace('Z',' +00:00'),
            updatedAt: (new Date(m.edit).toISOString()).replace('T',' ').replace('Z',' +00:00'),
          }
          obj.meta.push(cm)
          let cards = Meta.cards.filter(card=>card.metaId==m.id).map(i=>({
            oldId: i.id,
            name: i.meta.name,
            synonyms: i.meta.synonyms ? i.meta.synonyms.join() : null,
            rating: i.meta.rating || 0,
            favorite: i.meta.favorite || false,
            bookmark: i.meta.bookmark || null,
            country: i.meta.country ? i.meta.country.join() : null,
            color: i.color || null,
            views: i.views || 0,
            createdAt: (new Date(i.date).toISOString()).replace('T',' ').replace('Z',' +00:00'),
            updatedAt: (new Date(i.edit).toISOString()).replace('T',' ').replace('Z',' +00:00'),
          }))
          obj.items.push({[m.id]: cards})
          const metaKeys = ['name','synonyms','favorite','rating','bookmark','country','color']
          Meta.cards.filter(card=>card.metaId==m.id).slice(0,10).map(i=> {
            let metas = Object.fromEntries(Object.entries(i.meta).filter(([key]) => !metaKeys.includes(key)))
            obj.metaInItems.push({[i.id]: metas})
          })
        }
      }
      // get videos meta values and meta items 
      const videoKeys = ['path','duration','size','rating','favorite','date','resolution','edit','views','viewed','bookmark']
      obj.onlyMeta = Videos.videos.slice(0,100).map(i=>
        Object.fromEntries(Object.entries(i).filter(([key]) => !videoKeys.includes(key)))
      )
      console.log(Settings)
      axios.post(this.apiUrl + '/api/import', obj).then(()=> { this.isQueryRun = false })
    },
  }
}
</script>


<style lang="scss">
.card-grid {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
</style>