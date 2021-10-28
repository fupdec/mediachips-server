<template>
  <div id="app">
    <h1>Первое приложение!</h1>
    <button @click="initDb">init db</button>
    <p>
      <!-- используем компонент router-link для навигации -->
      <!-- входной параметр `to` определяет URL для перехода -->
      <!-- `<router-link>` по умолчанию отображается тегом `<a>` -->
      <router-link to="/foo">Перейти к Foo</router-link>
      <router-link to="/bar">Перейти к Bar</router-link>
    </p>
    <!-- отображаем тут компонент, для которого совпадает маршрут -->
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
    api: 'http://localhost:5555',
    db: null,
  }),
  computed: {},
  methods: {
    initDb() {
      axios.get(this.api + '/api/db')
        .then(response => {
          console.log('Hit me')
          this.db = response.data
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
