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

        <v-checkbox
          v-if="meta.metaSetting.favorite"
          v-model="item.favorite"
          @click.stop=""
          @change="setVal($event, 'favorite')"
          :false-value="0"
          :true-value="1"
          off-icon="mdi-heart-outline"
          on-icon="mdi-heart"
          color="pink"
          class="ma-0 pa-0 fav-btn"
          hide-details
          dark
        />

        <v-rating
          v-if="meta.metaSetting.rating"
          :value="item.rating"
          @input="setVal($event, 'rating')"
          color="yellow darken-2"
          background-color="#eee"
          class="rating"
          empty-icon="mdi-star-outline"
          half-icon="mdi-star-half-full"
          half-increments
          clearable
          dense
          hover
        />

        <v-icon
          v-if="meta.metaSetting.bookmark && item.bookmark"
          class="bookmark"
          color="red"
          :title="item.bookmark"
          v-html="'mdi-bookmark'"
        />

        <v-btn
          @click.stop="dialogAbout = true"
          color="primary"
          class="btn-edit"
          small
          fab
        >
          <v-icon>mdi-square-edit-outline</v-icon>
        </v-btn>
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

        <NestedItems :item="item" :items="items" :values="values" type="meta" />
      </div>

      <v-overlay
        :value="page.isSelect"
        @click.stop="toggleSelect"
        :color="isSelected ? 'primary' : '#7777'"
        z-index="1"
        absolute
      >
        <v-icon v-if="isSelected" size="50">
          mdi-checkbox-marked-outline
        </v-icon>
      </v-overlay>

      <DialogItemAbout
        v-if="dialogAbout"
        @close="dialogAbout = false"
        :dialog="dialogAbout"
        :item="item"
        :meta="meta"
      />
    </v-card>

    <v-chip
      v-else-if="page.view == '2'"
      @mousedown="stopSmoothScroll($event)"
      class="meta-chip"
      :color="item.color || '#777777'"
      :label="meta.metaSetting.chipLabel"
      :outlined="meta.metaSetting.chipOutlined"
      @mouseover.stop="hoverImage($event, item.metaId, item.id)"
      @mouseleave.stop="hideHoverImage"
    >
      <v-avatar>
        <v-img :src="images.main" position="top" />
      </v-avatar>
      <div class="ml-2">{{ item.name }}</div>

      <v-overlay
        :value="page.isSelect"
        @click.stop="toggleSelect"
        :color="isSelected ? 'primary' : '#7777'"
        z-index="1"
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

const path = require("path");

export default {
  name: "ItemMeta",
  props: {
    item: Object,
    meta: Object,
    upd: Array,
  },
  components: {
    NestedItems: () => import("@/components/items/NestedItems.vue"),
    DialogItemAbout: () => import("@/components/dialogs/DialogItemAbout.vue"),
  },
  mixins: [ComputedForItem],
  mounted() {
    this.getImages();
    this.getItems();
    this.getValues();
  },
  data: () => ({
    images: {
      main: null,
      alt: null,
      custom1: null,
      custom2: null,
    },
    items: [],
    values: [],
    dialogAbout: false,
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
      let url =
        "/item?metaId=" +
        this.meta.id +
        "&itemId=" +
        this.item.id +
        "&typeId=1";
      this.$router.push(url);
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
    async setVal(val, key) {
      await axios({
        method: "put",
        url: this.apiUrl + "/api/item/" + this.item.id,
        data: {
          [key]: val,
        },
      });
      this.$root.$emit("getItemsFromDb", []);
    },
  },
  watch: {
    upd(arr) {
      if (arr.includes(this.item.id)) {
        this.getItems();
        this.getValues();
      }
    },
  },
};
</script>