<template>
  <v-app>
    <AppBar />

    <SideBar />
    <Player v-show="isPlayerActive" />

    <v-main app>
      <router-view :key="$route.fullPath" />
    </v-main>
  </v-app>
</template>


<script>
const config = require('../config.json')

export default {
  name: 'App',
  components: { 
    AppBar: () => import('@/components/app/AppBar.vue'),
    SideBar: () => import('@/components/app/SideBar.vue'),
    Player: () => import('@/components/app/Player.vue'),
  },
  beforeMount() {
    this.$store.state.localhost = `http://${config.ip}:${config.port}`
  },
  mounted() {
    this.$nextTick(() => {
      this.applyTheme()
    })
  },
  data: () => ({
  }),
  computed: {
    isPlayerActive() { return this.$store.state.player.active },
  },
  methods: {
    applyTheme() {
      // this.$vuetify.theme.dark = true
      this.$vuetify.theme.themes.light.primary = '#7059b7'
      this.$vuetify.theme.themes.light.secondary = '#e98700'
      this.$vuetify.theme.themes.light.accent = '#7059b7'
      this.$vuetify.theme.themes.dark.primary = '#7059b7'
      this.$vuetify.theme.themes.dark.secondary = '#e98700'
      this.$vuetify.theme.themes.dark.accent = '#7059b7'
    },
  }
}
</script>


<style lang="sass">
  @import '@/assets/styles/app.scss'
  // @import '@/styles/variables.scss'
</style>