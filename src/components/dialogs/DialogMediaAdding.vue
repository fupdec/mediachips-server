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
        :header="`Adding media`"
        :buttons="buttons"
        closable
      />

      <v-card-text class="text-center pa-2 pa-sm-4">
        <!-- <v-btn v-if="isElectron" @click="chooseMultipleDir" outlined>
          <v-icon left>mdi-folder-open</v-icon> Choose Folders
        </v-btn>
        <v-btn v-else @click="chooseFiles" outlined>
          <v-icon left>mdi-file</v-icon> Choose Files
        </v-btn> -->

        <v-form ref="form" v-model="valid" class="mt-4">
          <v-textarea
            v-model="paths"
            :rules="[(v) => !!v || 'Path is required']"
            label="Paths to files or folders"
            hint="Each path starts on a new line"
            outlined
            no-resize
            autofocus
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
    this.paths = "";
    this.initButtons();
  },
  data: () => ({
    valid: false,
    buttons: [],
    dialogParserSettings: false,
  }),
  computed: {
    isElectron() {
      return this.$store.state.isElectron;
    },
    paths: {
      get() {
        return this.$store.state.Tasks.mediaAdding.paths;
      },
      set(value) {
        this.$store.state.Tasks.mediaAdding.paths = value;
      },
    },
  },
  methods: {
    initButtons() {
      this.buttons.push(
        // {
        //   icon: "cog",
        //   text: "Settings",
        //   outlined: true,
        //   function: () => {
        //     this.dialogParserSettings = true;
        //   },
        // },
        {
          icon: "plus",
          text: "Add",
          color: "success",
          outlined: false,
          function: () => {
            this.start();
          },
        }
      );
    },
    chooseMultipleDir() {},
    chooseFiles() {},
    start() {
      this.$refs.form.validate();
      if (!this.valid) return;
      this.$store.state.Tasks.mediaAdding.dialogProcess = true;
      this.$root.$emit("addMedia");
      this.close();
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>