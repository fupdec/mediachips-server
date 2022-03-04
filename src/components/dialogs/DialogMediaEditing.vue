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
          :header="`Editing: ${media.path}`"
          :buttons="buttons"
          closable
        />

        <v-card-text class="pa-2 pa-sm-4"> </v-card-text>
      </v-card>
    </v-dialog>
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
  },
  components: {
    DialogHeader,
  },
  mounted() {
    this.initButtons();
  },
  data: () => ({
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
    save() {},
    close() {
      this.$emit("close");
    },
  },
};
</script>