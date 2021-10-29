<template>
  <div id="app">
    <h1>Первое приложение!</h1>
    <button @click="getDb">Get contacts</button>
    <button @click="createContact">Create contact</button>

    <p>
      <router-link to="/foo">Перейти к Foo</router-link>
      <router-link to="/bar">Перейти к Bar</router-link>
    </p>
    <router-view></router-view>
    
    <img alt="Vue logo" src="./assets/logo.png">
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  components: {
  },
  mounted() {
    this.$nextTick(function () {
    })
  },
  data: () => ({
    apiUrl: 'http://localhost:5555',
    db: null,
  }),
  computed: {},
  methods: {
    getDb() {
      axios.get(this.apiUrl + '/api/db')
        .then(response => {
          console.log('Get all contacts')
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    },
    createContact() {
      axios.post(this.apiUrl + '/api/db')
        .then(response => {
          console.log('Create contact')
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
