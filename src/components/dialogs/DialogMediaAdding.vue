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
      let exts = [
        "3gp",
        "avi",
        "f4v",
        "flv",
        "m4v",
        "mkv",
        "mod",
        "mov",
        "mp4",
        "mpeg",
        "mpg",
        "mts",
        "rm",
        "rmvb",
        "swf",
        "ts",
        "vob",
        "webm",
        "wmv",
        "yuv",
      ];
      const regex = "." + exts.join("$|.") + "$";
      const regexString = JSON.stringify(regex);
      const paths = this.paths.trim().split("\n");
      let files = [];
      for (const entryPath of paths) {
        await axios({
          method: "post",
          url: this.apiUrl + "/api/Task/getFileList",
          data: {
            path: entryPath,
            filter: regexString,
          },
        })
          .then((res) => {
            files = files.concat(res.data);
          })
          .catch((e) => {
            // console.log(e);
          });
      }

      for (const filePath of files) {
        await axios({
          method: "post",
          url: this.apiUrl + "/api/Task/addMediaVideo",
          data: {
            path: filePath,
          },
        })
          .then((res) => {
            console.log(res.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
      this.$root.$emit("getItemsFromDb", []);
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>