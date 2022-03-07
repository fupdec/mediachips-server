<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn @click="dialogNames = true" v-on="on" icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <div>
        <v-dialog v-model="dialogNames" scrollable width="600">
          <v-card>
            <DialogHeader
              @close="dialogNames = false"
              :header="`Adding ${page.name}`"
              :buttons="buttons"
              closable
            />

            <v-card-text class="pa-sm-4 pa-2">
              <v-alert type="info" text dense dismissible class="body-2">
                {{
                  `Write a name on a new line to add several ${page.name.toLowerCase()} at once`
                }}
              </v-alert>
              <v-form ref="form" v-model="valid">
                <v-textarea
                  v-model="names"
                  :rules="[nameRules]"
                  label="Names"
                  outlined
                  required
                  autofocus
                  no-resize
                />
                <v-alert
                  v-if="dups.length"
                  border="left"
                  dense
                  text
                  class="body-2"
                  type="warning"
                >
                  These {{ page.name }} already exist: {{ dups.join(", ") }}
                </v-alert>
                <v-alert
                  v-if="added.length"
                  border="left"
                  dense
                  text
                  icon="mdi-plus-circle"
                  close-text="Close"
                  type="success"
                  dismissible
                  class="mt-4 mb-0"
                >
                  Added: {{ added.join(", ") }}
                </v-alert>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <span> Add {{ page.nameSingular }} </span>
  </v-tooltip>
</template>


<script>
import Vue from "vue";
import DialogHeader from "@/components/elements/DialogHeader.vue";

export default {
  name: "ItemsAdd",
  components: {
    DialogHeader,
  },
  mounted() {
    this.initButtons();
  },
  data: () => ({
    names: "",
    dups: [],
    added: [],
    valid: false,
    dialogNames: false,
    buttons: [],
  }),
  computed: {
    page() {
      return this.$store.state.Page;
    },
    content() {
      if (typeof this.searchString == "string")
        return this.searchString.substring(0, 2);
      else return "";
    },
  },
  methods: {
    initButtons() {
      this.buttons.push({
        icon: "plus",
        text: "Add",
        color: "success",
        outlined: false,
        function: () => {
          this.add();
        },
      });
    },
    async add() {
      await this.$refs.form.validate();
      if (!this.valid) return;
      let arr = Vue.prototype.$transformTextToArray(this.names);
      const allItems = ["allItems"];
      this.dups = [];
      this.added = [];

      // TODO check "arr" for dups in themself and in allItems

      for (const n of arr) {
        let duplicate = allItems.find(
          (i) => i.toLowerCase() === n.toLowerCase()
        );
        if (duplicate) {
          this.dups.push(n);
          continue;
        }
        this.added.push(n);
      }
    },
    nameRules(string) {
      let arr = Vue.prototype.$transformTextToArray(string);
      let valid = true;
      for (let i of arr) {
        valid = Vue.prototype.$validateName(i);
        if (valid !== true) break;
      }
      return valid;
    },
  },
};
</script>