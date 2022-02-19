<template>
  <div>
    <div class="item-header pa-3 pa-sm-6" :style="gradient">
      <div class="main-img">
        <v-hover>
          <template v-slot:default="{ hover }">
            <v-card elevation="5">
              <v-img
                v-if="images.main"
                :src="images.main"
                :aspect-ratio="meta.metaSetting.imageAspectRatio"
                position="top"
              />

              <v-fade-transition>
                <v-overlay v-if="hover" absolute>
                  <v-btn
                    @click="dialogEditImage = true"
                    large
                    rounded
                    color="primary"
                  >
                    <v-icon left>mdi-pencil</v-icon>
                    <span>Edit image</span>
                  </v-btn>
                </v-overlay>
              </v-fade-transition>
            </v-card>
          </template>
        </v-hover>
      </div>

      <div class="description">
        <div class="meta-name">
          <v-icon left>mdi-{{ meta.icon }}</v-icon>
          <div class="text">{{ meta.name }}</div>
        </div>

        <div class="item-name">{{ item.name }}</div>

        <div class="d-flex my-2">
          <v-rating
            v-if="meta.metaSetting.rating"
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

          <div v-if="meta.metaSetting.favorite">
            <v-icon v-if="item.favorite" right color="pink">mdi-heart</v-icon>
            <v-icon v-else right>mdi-heart-outline</v-icon>
          </div>
        </div>

        <v-chip-group column>
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
    <DialogEditImage
      v-if="dialogEditImage"
      @edited="getImages"
      @close="dialogEditImage = false"
      :dialog="dialogEditImage"
      :image="images.main"
      :options="cropperOps"
      :output="outputImgPath"
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
    DialogEditImage: () => import("@/components/dialogs/DialogEditImage.vue"),
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
    dialogEditImage: false,
    outputImgPath: "",
    cropperOps: {
      aspectRatio: 1,
    },
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
      let back = "background-image: ";
      if (this.images.header && !this.images.header.includes("ghost")) {
        if (this.$vuetify.theme.dark)
          back += `linear-gradient(0deg, #121212, transparent, transparent)`;
        else back += `linear-gradient(0deg, #fff, transparent, transparent)`;
        back += `, url(${this.images.header})`;
      } else {
        let color = this.item.color || "#777";
        back += `linear-gradient(180deg, ${color}, transparent)`;
      }
      return back;
    },
  },
  methods: {
    async init() {
      await this.getMeta();
      await this.getItem();
      await this.getImages();
      await this.getItems();
      await this.getValues();
      this.cropperOps.aspectRatio = this.meta.metaSetting.imageAspectRatio;
      let imgPath = path.join(
        __dirname,
        "/userfiles/media/meta/",
        this.metaId + "/" + this.itemId + "_main.jpg"
      );
      this.outputImgPath = imgPath;
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