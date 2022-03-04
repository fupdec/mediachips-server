<template>
  <div>
    <v-dialog
      v-if="dialog"
      :value="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      scrollable
      width="800"
    >
      <v-card>
        <DialogHeader
          @close="close"
          header="Editing image"
          :buttons="buttons"
          closable
        />

        <v-card-text class="d-flex flex-column pa-4">
          <file-pond
            @addfile="handleFile"
            @error="handleFileError($event)"
            :allow-multiple="false"
            :files="uploadedImage"
            accepted-file-types="image/*"
            label-idle="Drop image here or click for upload"
            ref="pond"
          />

          <div class="cropper-block">
            <Cropper
              @change="updateSize($event)"
              :src="src"
              :stencil-props="options"
              :auto-zoom="true"
              ref="cropper"
              class="cropper"
            />
            <div v-if="width && height" class="cropper-size">
              <v-icon v-if="width < 500" color="error" class="mr-1" small>
                mdi-alert
              </v-icon>
              <v-icon v-else color="success" class="mr-1" small>
                mdi-check
              </v-icon>
              {{ width }} x {{ height }}
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <DialogDeleteConfirm
      v-if="dialogImageDeleting"
      @close="dialogImageDeleting = false"
      @delete="deleteImage"
      :dialog="dialogImageDeleting"
      :text="textDialogDelete"
    />
  </div>
</template>


<script>
import Vue from "vue";
import DialogHeader from "@/components/elements/DialogHeader.vue";

import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
const FilePond = vueFilePond(
  FilePondPluginFileEncode,
  FilePondPluginFileValidateType
);

export default {
  name: "DialogImageEditing",
  props: {
    dialog: Boolean,
    image: String,
    options: Object,
    imagePath: String,
  },
  components: {
    Cropper,
    FilePond,
    DialogHeader,
    DialogDeleteConfirm: () =>
      import("@/components/dialogs/DialogDeleteConfirm.vue"),
  },
  mounted() {
    this.$nextTick(() => {
      this.src = this.image;
      this.initButtons();
    });
  },
  data: () => ({
    dialogImageDeleting: false,
    // cropper
    src: null,
    width: null,
    height: null,
    // filepond
    uploadedImageError: null,
    uploadedImage: null,
    buttons: [],
  }),
  computed: {
    textDialogDelete() {
      return "The image will be removed.\r Are you sure?";
    },
  },
  methods: {
    initButtons() {
      this.buttons.push({
        icon: "delete",
        text: "Delete",
        color: "error",
        outlined: false,
        function: () => {
          this.dialogImageDeleting = true;
        },
      });
      this.buttons.push({
        icon: "content-save",
        text: "Save",
        color: "success",
        outlined: false,
        function: () => {
          this.crop();
        },
      });
    },
    // filepond
    handleFileError(error) {
      this.uploadedImageError = error;
    },
    handleFile() {
      if (this.uploadedImageError !== null) {
        this.uploadedImageError = null;
        return;
      }
      this.src = this.$refs.pond.getFiles()[0].getFileEncodeDataURL();
    },
    async deleteImage() {
      this.src = "";
      this.dialogImageDeleting = false;
      await Vue.prototype.$deleteLocalImage(this.imagePath);
      this.close();
      this.$emit("edited");
    },
    async crop() {
      let { canvas } = this.$refs.cropper.getResult();
      let imgBuffer = canvas.toDataURL();
      imgBuffer = imgBuffer.replace(/^data:image\/\w+;base64,/, "");
      await Vue.prototype.$createImage(imgBuffer, this.imagePath);
      this.close();
      this.$emit("edited");
    },
    updateSize({ coordinates }) {
      this.width = Math.round(coordinates.width);
      this.height = Math.round(coordinates.height);
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>