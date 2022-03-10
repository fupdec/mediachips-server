<template>
  <div>
    <v-dialog
      v-if="dialog"
      :value="dialog"
      @input="close"
      :fullscreen="$vuetify.breakpoint.mobile"
      width="1200"
      scrollable
    >
      <v-card>
        <DialogHeader
          @close="close"
          :header="`Editing: ${item.name}`"
          :buttons="buttons"
          closable
        />

        <v-card-text class="item-about pa-2 pa-sm-4">
          <v-carousel
            ref="images"
            :hide-delimiters="images.length == 0"
            :show-arrows="images.length > 1"
            show-arrows-on-hover
          >
            <v-carousel-item
              v-for="(i, x) in images"
              :key="x"
              @wheel="scrollImage"
            >
              <v-hover v-slot="{ hover }">
                <v-img @click="edit(i)" :src="i.src" :aspect-ratio="i.ar">
                  <v-chip small label class="pa-2 ma-2">{{ i.type }}</v-chip>
                  <v-fade-transition>
                    <v-overlay v-if="hover" absolute>
                      <v-icon size="80">mdi-image-edit-outline</v-icon>
                    </v-overlay>
                  </v-fade-transition>
                </v-img>
              </v-hover>
            </v-carousel-item>
          </v-carousel>

          <ItemEditing @close="close" ref="editing" :item="item" :meta="meta" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <DialogImageEditing
      v-if="dialogImageEditing"
      @edited="getImages"
      @close="dialogImageEditing = false"
      :dialog="dialogImageEditing"
      :image="selectedImage"
      :options="cropperOps"
      :imagePath="imgPath"
    />
  </div>
</template>


<script>
import Vue from "vue";
import DialogHeader from "@/components/elements/DialogHeader.vue";
const path = require("path");

export default {
  name: "DialogItemEditing",
  props: {
    dialog: Boolean,
    item: Object,
    meta: Object,
  },
  components: {
    DialogHeader,
    DialogImageEditing: () => import("@/components/dialogs/DialogImageEditing.vue"),
    ItemEditing: () => import("@/components/items/ItemEditing.vue"),
  },
  mounted() {
    this.initButtons();
    this.getImages();
  },
  data: () => ({
    images: [],
    dialogImageEditing: false,
    selectedImage: null,
    imgPath: "",
    cropperOps: {
      aspectRatio: 1,
    },
    debounce: 0,
    buttons: [],
  }),
  methods: {
    initButtons() {
      this.buttons.push({
        icon: "content-save",
        text: "Save",
        color: "success",
        outlined: false,
        function: () => {
          this.save();
        },
      });
    },
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
      for (let i of imageTypes) {
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
      e.preventDefault();
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        if (e.deltaY < 0) this.$refs.images.next();
        else this.$refs.images.prev();
      }, 100);
    },
    edit(i) {
      this.dialogImageEditing = true;
      this.selectedImage = i.src;
      this.imgPath = i.path;
      this.cropperOps.aspectRatio = i.ar;
    },
    save() {
      this.$refs.editing.save();
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>