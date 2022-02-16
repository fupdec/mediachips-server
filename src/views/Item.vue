<template>
  <div class="item-header" :style="gradient">
    <v-img
      v-if="images.main"
      :src="images.main"
      :aspect-ratio="meta.metaSetting.imageAspectRatio"
      position="top"
      class="main-img"
      max-width="300"
      width="300"
    >
    </v-img>

    <div class="description">
      <div class="meta-name">
        <v-icon left>mdi-{{ meta.icon }}</v-icon>
        <div class="text-h5">{{ meta.name }}</div>
        <v-icon v-if="item.favorite" right color="pink">mdi-heart</v-icon>
      </div>

      <div class="text-h1">{{ item.name }}</div>

      <v-chip-group
        column
        class="mt-2"
      >
        <v-chip
          v-for="(i, x) in items"
          :key="i['item.name'] + x"
          :color="i['item.color']"
          class="ma-2 px-2"
        >
          <v-icon class="mr-1">mdi-{{ i.meta.icon }}</v-icon>
          {{ i["item.name"] }}
        </v-chip>

        <v-chip
          v-for="(i, x) in values"
          :key="i.metaId + x"
          :title="i.meta.name"
          class="ma-2 px-2"
        >
          <v-icon class="mr-1">mdi-{{ i.meta.icon }}</v-icon>
          {{ i.value }}
        </v-chip>
      </v-chip-group>
    </div>
  </div>
</template>


<script>
import Vue from "vue";
import axios from "axios";
import NestedItems from "@/components/items/NestedItems.vue";
const path = require("path");

export default {
  name: "Item",
  components: {
    NestedItems,
  },
  async mounted() {
    await this.init();
  },
  data: () => ({
    meta: {},
    item: {},
    images: {
      main: null,
      header: null,
    },
    items: [],
    values: [],
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    reg() {
      return this.$store.getters.reg;
    },
    metaId() {
      return +this.$route.query.metaId;
    },
    itemId() {
      return +this.$route.query.itemId;
    },
    gradient() {
      let color = this.item.color || "#777";
      return `background-image: linear-gradient(180deg, ${color}, transparent);`;
    },
    isColorDark() {
      return Vue.prototype.$getLocalImage(this.item.color);
    },
  },
  methods: {
    async init() {
      await this.getMeta();
      await this.getItem();
      await this.getImages();
      await this.getItems();
      await this.getValues();
    },
    async getMeta() {
      await axios
        .get(this.apiUrl + "/api/meta/" + this.metaId)
        .then((res) => {
          this.meta = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getItem() {
      await axios
        .get(this.apiUrl + "/api/item/" + this.itemId)
        .then((res) => {
          this.item = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getImages() {
      const imageTypes = ["main", "header"];
      const settings = this.meta.metaSetting.imageTypes;
      for (let i of imageTypes) {
        if (!settings.includes(i)) continue;
        let imgPath = path.join(
          __dirname,
          "/userfiles/media/meta/",
          `${this.meta.id}`,
          `${this.item.id}_${i}.jpg`
        );
        this.images[i] = await Vue.prototype.$getLocalImage(imgPath);
      }
    },
    async getItems() {
      let url = `/api/ItemsInItem?itemId=${this.item.id}`;
      await axios
        .get(this.apiUrl + url)
        .then((res) => {
          this.items = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getValues() {
      let url = `/api/ValuesInItem?itemId=${this.item.id}`;
      await axios
        .get(this.apiUrl + url)
        .then((res) => {
          this.values = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>