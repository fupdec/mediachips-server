<template>
  <v-app id="app">
    <v-navigation-drawer v-model="drawer" app/>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"><v-icon>mdi-menu</v-icon></v-app-bar-nav-icon>
      <v-toolbar-title>mediaChips</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-btn color="success" @click="getDb">Get videos</v-btn>
      <v-btn color="success" @click="createVideo">Create video</v-btn>

      <v-card v-for="v,i in videos" :key="i">
        {{v.path}}
      </v-card>

      <!-- <p>
        <router-link to="/foo">Перейти к Foo</router-link>
        <router-link to="/bar">Перейти к Bar</router-link>
      </p>
      <router-view></router-view> -->
      
      <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
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
    drawer: false,
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
