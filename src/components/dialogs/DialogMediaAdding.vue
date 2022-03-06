<template>
  <v-dialog
    v-if="dialog"
    :value="dialog"
    @input="close"
    :fullscreen="$vuetify.breakpoint.xs"
    scrollable
    width="980"
  >
    <v-card>
      <DialogHeader
        @close="close"
        :header="`Adding New Media`"
        :buttons="buttons"
        closable
      />

      <v-card-text class="text-center pa-2 pa-sm-4">
        <v-btn v-if="isElectron" @click="chooseMultipleDir" outlined>
          <v-icon left>mdi-folder-open</v-icon> Choose Folders
        </v-btn>
        <v-btn v-else @click="chooseFiles" outlined>
          <v-icon left>mdi-file</v-icon> Choose Files
        </v-btn>

        <v-form ref="form" v-model="valid" class="mt-4">
          <v-textarea
            v-model="paths"
            :rules="[(v) => !!v || 'Path is required']"
            label="Paths to files or folders"
            hint="Each path starts on a new line"
            outlined
            no-resize
          />
        </v-form>
      </v-card-text>
    </v-card>

    <DialogParsingSettings
      v-if="dialogParserSettings"
      @close="dialogParserSettings = false"
      :dialog="dialogParserSettings"
    />
  </v-dialog>
</template>


<script>
import axios from "axios";
import DialogHeader from "@/components/elements/DialogHeader.vue";
import DialogParsingSettings from "@/components/dialogs/DialogParsingSettings.vue";

export default {
  name: "DialogMediaAdding",
  props: {
    dialog: Boolean,
  },
  components: {
    DialogHeader,
    DialogParsingSettings,
  },
  mounted() {
    this.initButtons();
  },
  data: () => ({
    valid: false,
    paths: "",
    buttons: [],
    dialogMediaScanning: false,
    dialogParserSettings: false,
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    isElectron() {
      return this.$store.state.isElectron;
    },
  },
  methods: {
    initButtons() {
      this.buttons.push(
        {
          icon: "cog",
          text: "Settings",
          outlined: true,
          function: () => {
            this.dialogParserSettings = true;
          },
        },
        {
          icon: "plus",
          text: "Add",
          color: "success",
          outlined: false,
          function: () => {
            this.run();
          },
        }
      );
    },
    chooseMultipleDir() {},
    chooseFiles() {},
    async run() {
      await this.$refs.form.validate();
      if (!this.valid) return;

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
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>