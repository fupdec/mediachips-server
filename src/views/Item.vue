<template>
  <div>
    <v-sheet
      color="transparent"
      class="item-header pa-3 pa-sm-6"
      :style="gradient"
      :dark="isTextDark"
      :light="!isTextDark"
    >
      <div class="main-img">
        <v-hover v-slot="{ hover }">
          <v-img
            @click="dialogImageEditing = true"
            :src="images.main"
            :aspect-ratio="meta.metaSetting.imageAspectRatio"
            style="cursor: pointer"
          >
            <v-fade-transition>
              <v-overlay v-if="hover" absolute>
                <v-icon size="80">mdi-image-edit-outline</v-icon>
              </v-overlay>
            </v-fade-transition>
          </v-img>
        </v-hover>
      </div>

      <div class="description">
        <div class="meta-name">
          <v-icon left>mdi-{{ meta.icon }}</v-icon>
          <div class="text">{{ meta.name }}</div>
        </div>

        <div class="item-name">{{ item.name }}</div>

        <div class="d-flex align-center my-2">
          <v-rating
            v-if="meta.metaSetting.rating"
            :value="item.rating"
            @input="setVal($event, 'rating')"
            background-color="inherit"
            color="inherit"
            class="mr-4"
            half-increments
            clearable
            dense
            hover
          />
          <v-checkbox
            v-if="meta.metaSetting.favorite"
            :value="item.favorite"
            @change="setVal($event, 'favorite')"
            :false-value="0"
            :true-value="1"
            off-icon="mdi-heart-outline"
            on-icon="mdi-heart"
            color="inherit"
            hide-details
            class="ma-0 pa-0"
          />
        </div>

        <v-chip-group column>
          <v-chip
            v-for="(i, x) in items"
            :key="i.item.name + x"
            :color="i.item.color"
            class="ma-2 px-2"
          >
            <v-icon class="mr-1">mdi-{{ i.item.meta.icon }}</v-icon>
            {{ i.item.name }}
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
    </v-sheet>

    <!-- <v-tabs
      v-model="tab"
      background-color="transparent"
      slider-size="5"
      icons-and-text
      grow
      show-arrows
      class="fullwidth-tabs transparent-tabs"
    >
      <v-tab href="#videos">
        Videos
        <v-icon>mdi-video</v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" class="fullwidth-tabs transparent-tabs">
      <v-tab-item value="videos">
        <Items />
      </v-tab-item>
    </v-tabs-items> -->
    <Items />
    <DialogImageEditing
      v-if="dialogImageEditing"
      @edited="getImages"
      @close="dialogImageEditing = false"
      :dialog="dialogImageEditing"
      :image="images.main"
      :options="cropperOps"
      :imagePath="imgPath"
    />
  </div>
</template>


<script>
import Vue from "vue";
import axios from "axios";
const path = require("path");

export default {
  name: "Item",
  components: {
    Items: () => import("@/views/Items.vue"),
    DialogImageEditing: () =>
      import("@/components/dialogs/DialogImageEditing.vue"),
  },
  async beforeMount() {
    const filter = await Vue.prototype.$createDbEntry(
      {
        name: null,
        itemId: this.itemId,
        typeId: 1,
      },
      "SavedFilter"
    );
    await Vue.prototype.$createDbEntry(
      {
        filterId: filter.data[0].id,
        itemId: this.itemId,
        typeId: 1,
      },
      "PageSetting"
    );
  },
  async mounted() {
    await this.init();
  },
  data: () => ({
    tab: null,
    meta: {
      metaSetting: {},
    },
    item: {},
    images: {
      main: null,
      header: null,
    },
    items: [],
    values: [],
    // editing image
    dialogImageEditing: false,
    imgPath: "",
    cropperOps: {
      aspectRatio: 1,
    },
    bgc: "#777",
    gradient: "linear-gradient(180deg, #777, transparent)",
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
    isTextDark() {
      return Vue.prototype.$checkColorForDarkText(this.bgc);
    },
  },
  methods: {
    async init() {
      await this.getMeta();
      await this.getItem();
      await this.getImages();
      await this.getGradient();
      await this.getItems();
      await this.getValues();
      this.cropperOps.aspectRatio = this.meta.metaSetting.imageAspectRatio;
      this.imgPath = path.join(
        __dirname,
        "/userfiles/media/meta/",
        this.metaId + "/" + this.itemId + "_main.jpg"
      );
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
      for (let i of imageTypes) {
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
    async getGradient() {
      let bg = "background-image: ";
      if (this.images.header && !this.images.header.includes("unavailable")) {
        bg += `linear-gradient(0deg,`;
        if (this.$vuetify.theme.dark) this.bgc = "#121212";
        else this.bgc = "#fff";
        bg += `${this.bgc}, transparent, transparent), url(${this.images.header})`;
      } else {
        if (this.item.color) this.bgc = this.item.color;
        else if (this.images.main && !this.images.main.includes("unavailable"))
          this.bgc = await Vue.prototype.$getAverageColor(this.images.main);
        bg += `linear-gradient(180deg, ${this.bgc}, transparent)`;
      }
      this.gradient = bg;
    },
    async setVal(val, key) {
      await axios({
        method: "put",
        url: this.apiUrl + "/api/item/" + this.item.id,
        data: {
          [key]: val,
        },
      });
    },
  },
};
</script>