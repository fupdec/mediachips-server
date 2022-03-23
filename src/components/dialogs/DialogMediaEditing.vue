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
          :header="`Editing: ${fileName}`"
          :buttons="buttons"
          closable
        />

        <v-card-text
          :class="[{ 'item-about': mediaType.type == 'video' }]"
          class="pa-2 pa-sm-4"
        >
          <v-hover v-if="mediaType.type == 'video'" v-slot="{ hover }">
            <v-img @click="dialogImageEditing = true" :src="img">
              <v-fade-transition>
                <v-overlay v-if="hover" absolute>
                  <v-icon size="80">mdi-image-edit-outline</v-icon>
                </v-overlay>
              </v-fade-transition>
            </v-img>
          </v-hover>

          <MediaEditing @close="close" ref="editing" :media="media" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <DialogImageEditing
      v-if="dialogImageEditing"
      @edited="getImage"
      @close="dialogImageEditing = false"
      :dialog="dialogImageEditing"
      :image="img"
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
  name: "DialogMediaEditing",
  props: {
    dialog: Boolean,
    media: Object,
    mediaType: Object,
  },
  components: {
    DialogHeader,
    DialogImageEditing: () =>
      import("@/components/dialogs/DialogImageEditing.vue"),
    MediaEditing: () => import("@/components/items/MediaEditing.vue"),
  },
  mounted() {
    this.initButtons();
    this.getImage();
  },
  data: () => ({
    img: null,
    imgPath: null,
    buttons: [],
    dialogImageEditing: false,
    cropperOps: {
      aspectRatio: 16 / 9,
    },
  }),
  computed: {
    fileName() {
      return Vue.prototype.$getFileNameFromPath(this.media.path);
    },
  },
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
    async getImage() {
      this.imgPath = path.join(
        this.$store.state.mediaPath,
        "thumbs",
        `${this.media.id}.jpg`
      );
      this.img = await Vue.prototype.$getLocalImage(this.imgPath);
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