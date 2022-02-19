<template>
  <div>
    <v-dialog v-if="dialog" :value="dialog" persistent scrollable width="800">
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <div class="headline mx-4">Editing image</div>
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
            <v-spacer class="ma-sm-2 ma-1"></v-spacer>
            <v-btn @click="crop" color="success" depressed>
              <v-icon left>mdi-crop</v-icon> Save
            </v-btn>
          </div>
        </div>

        <v-divider></v-divider>

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

          <Cropper
            :src="src"
            :stencil-props="options"
            ref="cropper"
            class="cropper"
            :min-height="20"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
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
  name: "DialogEditImage",
  props: {
    dialog: Boolean,
    image: String,
    options: Object,
  },
  components: { Cropper, FilePond },
  mounted() {
    this.$nextTick(() => {
      this.src = this.image;
    });
  },
  data: () => ({
    // cropper
    src: null,
    // filepond
    uploadedImageError: null,
    uploadedImage: null,
  }),
  computed: {},
  methods: {
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
    crop() {},
    close() {
      this.$emit("close");
    },
  },
};
</script>