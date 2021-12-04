<template>
  <v-lazy>
    <v-card :class="{favorite: isFavorite}" outlined hover class="meta-card">
      <div class="img-container">
        <v-icon v-if="meta.MetaSetting.color" class="meta-color" :color="item.color">mdi-circle</v-icon>
        <!-- <div v-if="meta.MetaSetting.country" class="country"> <div v-for="c in item.country.split(',')" :key="c" class="flag-icon"> {{c}} </div> </div> -->
        <v-img :src="images.main" :aspect-ratio="meta.MetaSetting.imageAspectRatio" :class="{show:!images.alt}" position="top" class="main-img"/>
        <v-img v-if="images.alt" :src="images.alt" :aspect-ratio="meta.MetaSetting.imageAspectRatio" position="top" class="secondary-img"/> 
        <div v-if="images.custom1" class="custom1-img-button">1</div> <v-img :src="images.custom1" class="custom1-img"/>
        <div v-if="images.custom2" class="custom2-img-button">2</div> <v-img :src="images.custom2" class="custom2-img"/>
        <v-btn v-if="meta.MetaSetting.favorite" icon absolute :color="item.favorite?'pink':'white'" class="fav-btn"> <v-icon :color="item.favorite?'pink':'grey'">mdi-heart-outline</v-icon> </v-btn>
        <div v-if="meta.MetaSetting.rating" class="rating-wrapper"> <v-rating :value="item.rating" dense half-increments hover clearable color="yellow darken-2" background-color="grey" empty-icon="mdi-star-outline" half-icon="mdi-star-half-full"/> </div>
        <v-icon v-if="meta.MetaSetting.bookmark && item.bookmark" class="bookmark" color="red" :title="item.bookmark">mdi-bookmark</v-icon>
      </div>

      <div class="px-1 name">{{item.name}}</div>
      <div class="px-1">
        <v-chip outlined>
          <v-icon class="mr-1">mdi-video-outline</v-icon> <b>{{numberOfMedia}}</b>
        </v-chip>
        <v-chip outlined>
          <v-icon class="mr-1">mdi-eye-outline</v-icon> <b>{{item.views}}</b>
        </v-chip>
      </div>
      <div v-if="meta.MetaSetting.synonyms && item.synonyms" class="px-1 synonyms"> <span class="pl-2"/> {{item.synonyms}} </div>
      
      <v-icon v-if="item.bookmark" class="bookmark" color="red" :title="item.bookmark">mdi-bookmark</v-icon>
    </v-card>
  </v-lazy>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

const path = require('path')

export default {
  name: 'ItemCard',
  props: {
    item: Object,
    meta: Object,
  },
  mounted() {
    this.$nextTick(() => {
      this.getImages()
      this.countMediaInItem()
    })
  },
  data: () => ({
    numberOfMedia: 0,
    images: {
      main: null,
      alt: null,
      custom1: null,
      custom2: null,
    },
  }),
  computed: {
    apiUrl() { return this.$store.state.localhost },
    isFavorite() { return this.item.favorite },
  },
  methods: {
    async getImages() {
      const imageTypes = ['main','alt','custom1','custom2']
      const settings = this.meta.MetaSetting.imageTypes
      for (let i of imageTypes) {
        if (!settings.includes(i)) continue
        let imgPath = path.join(__dirname, '/userfiles/media/meta/', this.meta.oldId, `${this.item.oldId}_${i}.jpg`)
        let src = await Vue.getLocalImage(imgPath)
        if (i!=='main' && src.includes('ghost.png')) this.images[i] = null
        else this.images[i] = src
      }
    },
    countMediaInItem() {
      let url = `/api/count-media-in-item?typeId=1&itemId=${this.item.id}`
      axios.get(this.apiUrl + url)
        .then(res => {
          this.numberOfMedia = res.data.count
        })
        .catch(e => {
          console.log(e)
        })
    },
  },
  watch: {
  }
}
</script>