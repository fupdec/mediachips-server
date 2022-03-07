<template>
  <v-dialog
    v-if="dialog"
    :value="dialog"
    @input="close"
    :fullscreen="$vuetify.breakpoint.xs"
    scrollable
    width="600"
  >
    <v-card>
      <DialogHeader
        @close="close"
        :header="`Settings`"
        :buttons="buttons"
        closable
      />
      <v-card-text class="text-center pa-2 pa-sm-4">
        <!-- TODO add parsing options for assigned meta and file type -->
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


<script>
import axios from "axios";
import DialogHeader from "@/components/elements/DialogHeader.vue";

export default {
  name: "DialogParsingSettings",
  props: {
    dialog: Boolean,
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
        icon: "check",
        text: "Save",
        color: "success",
        outlined: false,
        function: () => {
          this.save();
        },
      });
    },
    save() {
      this.close();
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>