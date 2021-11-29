<template>
  <v-lazy>
    <v-card :class="{favorite: isFavorite}" outlined hover class="meta-card">
      <v-responsive>
        <v-img :src="getImg" :aspect-ratio="meta.MetaSetting.imageAspectRatio" position="top"/>
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
      <div class="caption" v-html="item.name"/>
      
      <v-icon v-if="item.bookmark" class="bookmark" color="red" :title="item.bookmark">mdi-bookmark</v-icon>
    </v-card>
  </v-lazy>
</template>

<script>

export default {
  name: 'ItemCard',
  props: {
    item: Object,
    meta: Object,
  },
  mounted() {
    this.$nextTick(() => {
    })
  },
  destroyed() {
  },
  data: () => ({
  }),
  computed: {
    isFavorite() { return this.item.favorite },
    getImg() { return '/images/meta/' + this.meta.oldId + '/' + this.item.oldId + '_main.jpg' },
  },
  methods: {
    // TODO create function for count number of media with this item
  },
  watch: {
  }
}
</script>