<template>
  <v-lazy>
    <v-card :class="{favorite: isFavorite}" outlined hover class="meta-card">
      <v-responsive>
        <v-img :src="imgMain" :aspect-ratio="meta.MetaSetting.imageAspectRatio" position="top"/>
        <v-rating  
          :value="item.rating" 
          class="rating rating-wrapper"
          color="yellow darken-2" background-color="grey darken-1"
          empty-icon="mdi-star-outline" half-icon="mdi-star-half-full"
          dense half-increments hover clearable />
        
        <v-btn 
          @click="isFavorite = !isFavorite" icon absolute 
          :color="isFavorite===false ? 'white' : 'pink'" class="fav-btn"
        > <v-icon :color="isFavorite===false?'grey':'pink'">mdi-heart-outline</v-icon>
        </v-btn>
      </v-responsive>
      <!-- <div>ItemID: {{item.id}}</div> -->
      <div class="pl-1"> {{item.name}}
        <v-chip outlined>
          <v-icon class="mr-1">mdi-video-outline</v-icon> {{numberOfMedia}}
        </v-chip>
        <v-chip outlined>
          <v-icon class="mr-1">mdi-eye-outline</v-icon> {{item.views}}
        </v-chip>
      </div>  
      <v-icon v-if="item.bookmark" class="bookmark" color="red" :title="item.bookmark">mdi-bookmark</v-icon>
    </v-card>
  </v-lazy>
</template>

<script>
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
      this.getImg()
      this.countMediaInItem()
    })
  },
  data: () => ({
    numberOfMedia: 0,
    imgMain: null,
  }),
  computed: {
    apiUrl() { return this.$store.state.localhost },
    isFavorite() { return this.item.favorite },
  },
  methods: {
    getImg() { 
      let url = `/api/get-file`
      let imgPath = path.join(__dirname, '/userfiles/media/meta/', this.meta.oldId, this.item.oldId + '_main.jpg') 
      axios({
        method: 'post',
        url: this.apiUrl + url,
        responseType: 'blob',
        data: {
          url: imgPath,
        }
      })
        .then(res => {
          this.imgMain = URL.createObjectURL(res.data)
        })
        .catch(e => {
          console.log(e)
        })
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