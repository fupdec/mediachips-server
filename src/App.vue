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


      <v-card v-for="v,i in videos" :key="i">
        {{v.path}}
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import Videos from './../dbv.json'
import Meta from './../meta.json'

export default {
  name: 'App',
  components: {
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(Videos)
    })
  },
  data: () => ({
    apiUrl: 'http://localhost:5555',
    videos: [],
  }),
  computed: {},
  methods: {
    getDb() {
      axios.get(this.apiUrl + '/api/db')
        .then(response => {
          console.log(response.data)
          this.videos = response.data.slice(0,100)
        })
        .catch(e => {
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
      let obj = { meta: [], items: [], videos: [],  videoMetadata: [], onlyMeta: [] }
      obj.videos = Videos.videos.map(i=>({
        oldId: i.id,
        path: i.path,
        filesize: i.size,
        // duration: i.duration,
        // width: +i.resolution.match(/\d*/)[0],
        // height: +i.resolution.match(/\x(.*)/)[1],
        rating: i.rating || 0,
        favorite: i.favorite === true ? 1 : 0,
        bookmark: i.bookmark || null,
        views: i.views || 0,
        typeId: 1
      }))
      obj.videoMetadata = Videos.videos.map((i,x)=>({
        // oldId: i.id,
        mediaId: x+1,
        duration: i.duration,
        width: +i.resolution.match(/\d*/)[0] || 0,
        height: +i.resolution.match(/\x(.*)/)[1] || 0,
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
          }
          obj.meta.push(cm)
          let cards = Meta.cards.filter(card=>card.metaId==m.id).map(i=>({
            oldId: i.id,
            name: i.meta.name,
            synonyms: i.meta.synonyms ? i.meta.synonyms.join() : null,
            rating: i.meta.rating || 0,
            favorite: i.meta.favorite === true ? 1 : 0,
            bookmark: i.meta.bookmark || null,
            country: i.meta.country ? i.meta.country.join() : null,
            views: i.views || 0,
          }))
          obj.items.push({[m.id]: cards})
        }
      }
      // get videos meta values and meta items 
      const videoFields = ['path','duration','size','rating','favorite','date','resolution','edit','views','viewed','bookmark']
      obj.onlyMeta = Videos.videos.slice(0,50).map(i=>
        Object.fromEntries(Object.entries(i).filter(([key]) => !videoFields.includes(key)))
      )
      // console.log(Videos.videos)
      axios.post(this.apiUrl + '/api/import', obj)
        .then(res => { console.log(res.data) })
        .catch(e => { console.log(e) })
    },
  }
}
</script>