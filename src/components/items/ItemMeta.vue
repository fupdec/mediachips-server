<template>
  <v-lazy>
    <v-card :class="{ favorite: item.favorite }" outlined hover class="meta-card">
      <div class="img-container">
        <v-icon
          v-if="meta.metaSetting.color"
          class="meta-color"
          :color="item.color"
          >mdi-circle</v-icon
        >
        <!-- <div v-if="meta.metaSetting.country" class="country"> <div v-for="c in item.country.split(',')" :key="c" class="flag-icon"> {{c}} </div> </div> -->
        <v-img
          :src="images.main"
          :aspect-ratio="meta.metaSetting.imageAspectRatio"
          :class="{ show: !images.alt }"
          position="top"
          class="main-img"
        />
        <v-img
          v-if="images.alt"
          :src="images.alt"
          :aspect-ratio="meta.metaSetting.imageAspectRatio"
          position="top"
          class="secondary-img"
        />
        <div v-if="images.custom1" class="custom1-img-button">1</div>
        <v-img :src="images.custom1" class="custom1-img" />
        <div v-if="images.custom2" class="custom2-img-button">2</div>
        <v-img :src="images.custom2" class="custom2-img" />
        <v-btn
          v-if="meta.metaSetting.favorite"
          icon
          absolute
          :color="item.favorite ? 'pink' : 'white'"
          class="fav-btn"
        >
          <v-icon :color="item.favorite ? 'pink' : 'grey'"
            >mdi-heart-outline</v-icon
          >
        </v-btn>
        <div v-if="meta.metaSetting.rating" class="rating-wrapper">
          <v-rating
            :value="item.rating"
            dense
            half-increments
            hover
            clearable
            color="yellow darken-2"
            background-color="grey"
            empty-icon="mdi-star-outline"
            half-icon="mdi-star-half-full"
          />
        </div>
        <v-icon
          v-if="meta.metaSetting.bookmark && item.bookmark"
          class="bookmark"
          color="red"
          :title="item.bookmark"
          >mdi-bookmark</v-icon
        >
      </div>
      <v-icon
        v-if="item.bookmark"
        class="bookmark"
        color="red"
        :title="item.bookmark"
        >mdi-bookmark</v-icon
      >

      <div class="px-1 name">{{ item.name }}</div>
      <div
        v-if="meta.metaSetting.synonyms && item.synonyms"
        class="px-1 synonyms"
      >
        <span class="pl-2" /> {{ item.synonyms }}
      </div>

      <v-chip title="Number of videos">
        <v-icon class="mr-1">mdi-video-outline</v-icon> {{ numberOfMedia }}
      </v-chip>
      <v-chip title="Number of views">
        <v-icon class="mr-1">mdi-eye-outline</v-icon> {{ item.views }}
      </v-chip>

      <v-chip
        v-for="i in items"
        :key="i.itemId + i.childItemId"
        :color="i['item.color']"
        :text-color="getTextColor(i['item.color'])"
        :title="i.meta.name"
      >
        <v-icon class="mr-1">mdi-{{ i.meta.icon }}</v-icon>
        {{ i["item.name"] }}
      </v-chip>

      <v-chip v-for="(v, i) in values" :key="i" :title="v.meta.name">
        <v-icon class="mr-1">mdi-{{ v.meta.icon }}</v-icon>
        {{ v.value }}
      </v-chip>
    </v-card>
  </v-lazy>
</template>

<script>
import Vue from "vue";
import axios from "axios";

const path = require("path");

export default {
  name: "ItemMeta",
  props: {
    item: Object,
    meta: Object,
  },
  mounted() {
    this.$nextTick(() => {
      this.getImages();
      this.countMediaInItem();
      this.getItems();
      this.getValues();
    });
  },
  data: () => ({
    numberOfMedia: 0,
    images: {
      main: null,
      alt: null,
      custom1: null,
      custom2: null,
    },
    items: [],
    values: [],
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
  },
  methods: {
    async getImages() {
      const imageTypes = ["main", "alt", "custom1", "custom2"];
      const settings = this.meta.metaSetting.imageTypes;
      for (let i of imageTypes) {
        if (!settings.includes(i)) continue;
        let imgPath = path.join(
          __dirname,
          "/userfiles/media/meta/",
          `${this.meta.id}`,
          `${this.item.id}_${i}.jpg`
        );
        let src = await Vue.prototype.$getLocalImage(imgPath);
        if (i !== "main" && src.includes("ghost.png")) this.images[i] = null;
        else this.images[i] = src;
      }
    },
    countMediaInItem() {
      let url = `/api/media/countInItem?typeId=1&itemId=${this.item.id}`;
      axios
        .get(this.apiUrl + url)
        .then((res) => {
          this.numberOfMedia = res.data.count;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getItems() {
      let url = `/api/ItemsInItem?itemId=${this.item.id}`;
      axios
        .get(this.apiUrl + url)
        .then((res) => {
          this.items = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getValues() {
      let url = `/api/ValuesInItem?itemId=${this.item.id}`;
      axios
        .get(this.apiUrl + url)
        .then((res) => {
          this.values = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getTextColor(color) {
      if (!color) return "";
      let value = Vue.prototype.$checkColorForDarkText(color);
      if (value) return "white";
      else return "black";
    },
  },
  watch: {},
};
</script>