<template>
<vuescroll>
  <div>Items total: {{totalItems}}</div>
  <div class="d-flex justify-space-between align-center pa-2">
    <div class="d-flex">
      <v-text-field v-model="queryString" @keyup.enter="getItems" label="Search in path" outlined dense hide-details/>
      <v-btn @click="getItems" height="40" color="primary"> 
        <v-icon>mdi-magnify</v-icon></v-btn>
    </div>
  </div>

  <v-pagination v-model="page" @input="getItems" :length="totalPages" total-visible="5"/>

  <Loading v-show="isQueryRun"/>

  <v-container fluid class="card-grid card-size-1">
    <ItemCard v-for="i in items" :key="i.id" :item="i" :meta="meta"/>
  </v-container>

  <v-pagination v-model="page" @input="getItems" :length="totalPages" total-visible="5"/>
</vuescroll>
</template>


<script>
import axios from 'axios'
import vuescroll from 'vuescroll'

export default {
  name: 'Meta',
  components: {
    vuescroll,
    ItemCard: () => import('@/components/meta/ItemCard.vue'),
    Loading: () => import('@/components/elements/Loading.vue'),
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getMeta()
      this.getItems()
    })
  },
  data: ()=>({
    apiUrl: 'http://192.168.1.120.:5555',
    meta: null,
    items: [],
    totalItems: 0,
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
    async getMeta() {
      await axios.get(this.apiUrl + '/api/meta')
        .then(res => { this.meta = res.data.find(i=>i.id==this.$route.query.metaId) })
        .catch(e => { console.log(e) })
    },
    getItems() {
      this.isQueryRun = true
      let url = `/api/items?metaId=${this.$route.query.metaId}&page=${this.page-1}&size=20&query=${this.queryString}`
      axios.get(this.apiUrl + url)
        .then(res => {
          this.isQueryRun = false
          this.items = res.data.items
          this.totalItems = res.data.totalItems
          this.totalPages = res.data.totalPages
        })
        .catch(e => {
          this.isQueryRun = false
          console.log(e)
        })
    },
  },
  watch: {
  }
}
</script>