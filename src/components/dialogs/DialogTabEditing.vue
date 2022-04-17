<template>
  <v-dialog v-model="dialog.show" scrollable width="600">
    <v-card>
      <DialogHeader
        @close="dialog.show = false"
        header="Editing tab name"
        :buttons="buttons"
        closable
      />

      <v-card-text class="pa-sm-4 pa-2">
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="tabName"
            :rules="[(v) => !!v || 'Name is required', nameRules]"
            label="Name"
            required
            autofocus
          />
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


<script>
import Vue from "vue";
import axios from "axios";
import DialogHeader from "@/components/elements/DialogHeader.vue";

export default {
  name: "DialogTabEditing",
  components: {
    DialogHeader,
  },
  mounted() {
    this.initButtons();
  },
  data: () => ({
    valid: false,
    tabName: "",
    buttons: [],
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    dialog: {
      get() {
        return this.$store.state.Dialogs.tabEditing;
      },
      set(value) {
        this.$store.state.Dialogs.tabEditing = value;
      },
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
    save() {
      this.$refs.form.validate();
      if (!this.valid) return;

      axios({
        method: "put",
        url: this.apiUrl + "/api/tab/" + this.dialog.tab.id,
        data: {
          name: this.tabName,
        },
      })
        .then(() => {
          this.$root.$emit("getTabs");
        })
        .catch((e) => {
          console.log(e);
        });

      this.$store.state.Dialogs.tabEditing.show = false;
      this.$store.state.Dialogs.tabEditing.tab = null;
      this.tabName = "";
    },
    nameRules(string) {
      return Vue.prototype.$validateName(string);
    },
  },
  watch: {
    "dialog.tab"(val) {
      if (!val) return;
      this.tabName = this.dialog.tab.name;
    },
  },
};
</script>