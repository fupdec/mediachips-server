<template>
  <v-dialog
    v-if="dialog"
    :value="dialog"
    @input="close"
    :fullscreen="$vuetify.breakpoint.xs"
    scrollable
    width="800"
  >
    <v-card>
      <DialogHeader
        @close="close"
        :header="`Settings`"
        :buttons="buttons"
        closable
      />
      <v-card-text class="text-center pa-2 pa-sm-4"> </v-card-text>
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
    chooseMultipleDir() {},
    chooseFiles() {},
    async save() {
      await axios({
        method: "post",
        url: this.apiUrl + "/api/Task/addMediaVideo",
        data: {
          path: this.paths,
        },
      })
        .then((res) => {
          console.log(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
      this.close();
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>