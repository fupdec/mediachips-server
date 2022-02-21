<template>
  <div>
    <v-dialog v-if="dialog" :value="dialog" @input="close" scrollable>
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <div class="headline mx-4">{{ item.name }}</div>
          <div
            class="
              d-flex
              flex-sm-row flex-column-reverse
              justify-end
              ma-sm-4 ma-2
            "
          >
            <v-btn @click="close" outlined>
              <v-icon left>mdi-close</v-icon> Close
            </v-btn>
          </div>
        </div>

        <v-divider></v-divider>

        <v-card-text class="d-flex pa-2 pa-sm-4">
          <v-carousel ref="images">
            <v-carousel-item
              v-for="(i, x) in images"
              :key="x"
              @wheel="scrollImage"
            >
              <v-hover v-slot="{ hover }">
                <v-img
                  @click="edit(i)"
                  width="300"
                  contain
                  :src="i.src"
                  :aspect-ratio="i.ar"
                >
                  <span>{{ i.type }}</span>
                  <v-fade-transition>
                    <v-overlay v-if="hover" absolute>
                      <v-icon size="80">mdi-image-edit-outline</v-icon>
                    </v-overlay>
                  </v-fade-transition>
                </v-img>
              </v-hover>
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
      </v-card>
    </v-dialog>

    <DialogEditImage
      v-if="dialogEditImage"
      @edited="getImages"
      @close="dialogEditImage = false"
      :dialog="dialogEditImage"
      :image="selectedImage"
      :options="cropperOps"
      :imagePath="imgPath"
    />
  </div>
</template>


<script>
import Vue from "vue";
const path = require("path");

export default {
  name: "DialogItemAbout",
  props: {
    dialog: Boolean,
    item: Object,
    meta: Object,
  },
  components: {
    DialogEditImage: () => import("@/components/dialogs/DialogEditImage.vue"),
  },
  mounted() {
    this.$nextTick(() => {
      this.getImages();
    });
  },
  data: () => ({
    images: [],
    dialogEditImage: false,
    selectedImage: null,
    imgPath: "",
    cropperOps: {
      aspectRatio: 1,
    },
    debounce: 0,
  }),
  computed: {},
  methods: {
    async getImages() {
      this.images = [];
      const imageTypes = [
        "main",
        "alt",
        "custom1",
        "custom2",
        // "avatar",
        // "header",
      ];
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
        let ar = this.meta.metaSetting.imageAspectRatio;
        let width = 300;
        // if (i == "avatar") {
        //   ar = 1;
        //   width = 164;
        // }
        // if (i == "header") {
        //   ar = 1;
        //   width = 800;
        // }
        this.images.push({
          type: i,
          path: imgPath,
          src: src,
          ar: ar,
          width: width,
        });
      }
    },
    scrollImage(e) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        if (e.deltaY < 0) this.$refs.images.next();
        else this.$refs.images.prev();
      }, 100);
    },
    edit(i) {
      this.dialogEditImage = true;
      this.selectedImage = i.src;
      this.imgPath = i.path;
      this.cropperOps.aspectRatio = i.ar;
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>