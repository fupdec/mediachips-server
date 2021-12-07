<template>
  <div>
    <v-container class="text-center">
      <v-alert type="info" outlined>
        Welcome to mediaChips. Please choose archive with backup of version 0.11.1
      </v-alert>
      <v-btn color="success">import db</v-btn>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  components: {},
  methods: {
    importData() {
      let obj = { meta: [], metaSettings: [], items: [], videos: [],  videoMetadata: [], playlists: [], markers: [], onlyMeta: [], metaInItems: [], settings: Settings }
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
            obj.metaSettings.push({
              "oldId": m.id,
              "hidden": true,
              "parser": false,
              "imageAspectRatio": 1,
              "imageTypes": "main",
              "chipLabel": false,
              "chipOutlined": false,
              "color": false,
              "favorite": true,
              "rating": false,
              "synonyms": false,
              "bookmark": false,
              "country": false,
              "career": false,
              "scraper": false,
              "nested": false,
              "markers": false,
            })
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
          let metaSettings = m.settings
          delete metaSettings.metaInCard
          metaSettings.oldId = m.id
          let imageTypes = metaSettings.imageTypes ? metaSettings.imageTypes.join() : "main"
          metaSettings.imageTypes = imageTypes
          obj.metaSettings.push(metaSettings)
          let cards = Meta.cards.filter(card=>card.metaId==m.id).map(i=>({
            oldId: i.id,
            name: i.meta.name,
            synonyms: i.meta.synonyms ? i.meta.synonyms.join() : null,
            rating: i.meta.rating || 0,
            favorite: i.meta.favorite || false,
            bookmark: i.meta.bookmark || null,
            country: i.meta.country ? i.meta.country.join() : null,
            color: i.meta.color || null,
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
      axios.post(this.$store.state.localhost + '/api/import', obj)
    },
  },
}
</script>