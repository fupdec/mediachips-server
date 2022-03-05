<template>
  <v-dialog
    v-if="dialog"
    :value="dialog"
    @input="close"
    :fullscreen="$vuetify.breakpoint.xs"
    scrollable
    persistent
    width="980"
  >
    <v-card>
      <DialogHeader
        @close="close"
        :header="`Adding New Media`"
        :buttons="buttons"
        closable
      />

      <v-stepper v-model="step">
        <v-stepper-header style="height: 50px">
          <v-stepper-step :complete="step > 1" step="1" class="py-0">
            Folders
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step > 2" step="2" class="py-0">
            Settings
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3" class="py-0"> Scanning </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-card>
            <v-card-text class="text-center">
              <v-textarea
                v-model="folders"
                outlined
                no-resize
                label="Paths to files or folders"
                hint="Each path starts on a new line"
              />

              <v-btn v-if="isElectron" @click="chooseMultipleDir" outlined>
                <v-icon left>mdi-folder-open</v-icon> Choose Folders
              </v-btn>
              <v-btn v-else @click="chooseFiles" outlined>
                <v-icon left>mdi-file</v-icon> Choose Files
              </v-btn>
            </v-card-text>
          </v-card>
        </v-stepper-items>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>


<script>
import DialogHeader from "@/components/elements/DialogHeader.vue";

export default {
  name: "DialogMediaAdding",
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
    step: 1,
    folders: [],
    buttons: [],
  }),
  computed: {
    isElectron() {
      return this.$store.state.isElectron;
    },
  },
  methods: {
    initButtons() {
      this.buttons.push({
        icon: "check",
        text: "Continue",
        color: "success",
        outlined: false,
        function: () => {
          ++this.step;
        },
      });
    },
    chooseMultipleDir() {},
    chooseFiles() {},
    close() {
      this.$emit("close");
    },
  },
};
</script>