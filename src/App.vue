<template>
  <v-app>
    <v-app-bar app dense clipped-left extension-height="28">
      <v-toolbar-title>Vuedia</v-toolbar-title>
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
      <v-btn color="success" @click="getDb">Get videos</v-btn>
      <v-btn color="success" @click="createVideo">Create video</v-btn>

      <v-card v-for="v,i in videos" :key="i">
        {{v.path}}
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  components: {
  },
  mounted() {
    this.$nextTick(() => {
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
          this.videos = response.data
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
    }
  }
}
</script>