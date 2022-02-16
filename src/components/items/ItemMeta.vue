<template>
  <v-lazy>
    <v-card
      v-if="page.view == '1'"
      :class="{ favorite: item.favorite }"
      class="meta-card"
      outlined
      hover
    >
      <div @click="openItemPage" class="img-container">
        <v-icon
          v-if="meta.metaSetting.color"
          class="meta-color"
          :color="item.color"
          v-html="'mdi-circle'"
        />
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
          class="fav-btn"
          color="pink"
          absolute
          icon
        >
          <v-icon v-if="item.favorite" color="pink"> mdi-heart </v-icon>
          <v-icon v-else color="grey"> mdi-heart-outline </v-icon>
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
          v-html="'mdi-bookmark'"
        />
      </div>

      <v-icon
        v-if="item.bookmark"
        class="bookmark"
        color="red"
        :title="item.bookmark"
        v-html="'mdi-bookmark'"
      />

      <div class="description">
        <div class="px-1 name" v-html="item.name" />
        <div
          v-if="meta.metaSetting.synonyms && item.synonyms"
          class="px-1 synonyms text--secondary"
          v-html="item.synonyms"
        />

        <v-chip label outlined title="Number of videos">
          <v-icon class="mr-1">mdi-video-outline</v-icon> {{ numberOfMedia }}
        </v-chip>
        <v-chip label outlined title="Number of views">
          <v-icon class="mr-1">mdi-eye-outline</v-icon> {{ item.views }}
        </v-chip>

        <NestedItems :items="items" :values="values" />
      </div>

      <v-overlay
        :value="page.isSelect"
        @click.stop="toggleSelect"
        :color="isSelected ? 'primary' : '#7777'"
        absolute
      >
        <v-icon v-if="isSelected" size="50">
          mdi-checkbox-marked-outline
        </v-icon>
      </v-overlay>
    </v-card>

    <v-chip
      v-else-if="page.view == '2'"
      @mousedown="stopSmoothScroll($event)"
      class="meta-chip"
      :color="item.color || '#777777'"
      :label="meta.metaSetting.chipLabel"
      :outlined="meta.metaSetting.chipOutlined"
      @mouseover.stop="hoverImage($event, item.metaId, item.id)"
      @mouseleave.stop="$store.state.hover.show = false"
    >
      <v-avatar>
        <v-img :src="images.main" position="top" />
      </v-avatar>
      <div class="ml-2">{{ item.name }}</div>

      <v-overlay
        :value="page.isSelect"
        @click.stop="toggleSelect"
        :color="isSelected ? 'primary' : '#7777'"
        absolute
      >
        <v-icon v-if="isSelected"> mdi-checkbox-marked-outline </v-icon>
      </v-overlay>
    </v-chip>
  </v-lazy>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import ComputedForItem from "@/mixins/ComputedForItem";
import NestedItems from "./NestedItems.vue";

const path = require("path");

export default {
  name: "ItemMeta",
  props: {
    item: Object,
    meta: Object,
  },
  components: { NestedItems },
  mixins: [ComputedForItem],
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
    page() {
      return this.$store.state.Page;
    },
  },
  methods: {
    openItemPage() {
      this.$router.push(`/item/?metaId=${this.meta.id}&itemId=${this.item.id}`);
    },
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
  },
  watch: {},
};
</script>