<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn @click="dialogNames = true" v-on="on" icon tile>
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <div>
        <v-dialog v-model="dialogNames" scrollable width="600">
          <v-card>
            <div class="d-flex justify-space-between align-center">
              <div class="headline ma-sm-4 ma-2">
                Adding New {{ page.name }}
              </div>
              <div
                class="
                  d-flex
                  flex-sm-row flex-column-reverse
                  justify-end
                  ma-sm-4 ma-2
                "
              >
                <v-btn @click="dialogNames = false" outlined>
                  <v-icon left>mdi-close</v-icon> Cancel
                </v-btn>
                <v-spacer class="ma-sm-2 ma-1"></v-spacer>
                <v-btn @click="add" color="success" depressed>
                  <v-icon left>mdi-plus</v-icon> Add
                </v-btn>
              </div>
            </div>

            <v-divider></v-divider>

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
    <span> Add New {{ page.nameSingular }} </span>
  </v-tooltip>
</template>


<script>
import Vue from "vue";

export default {
  name: "ItemsAdd",
  data: () => ({
    names: "",
    dups: [],
    added: [],
    valid: false,
    dialogNames: false,
  }),
  computed: {
    page() {
      return this.$store.state.page;
    },
    sets: {
      get() {
        return this.$store.state.pageSettings;
      },
      set(value) {
        return (this.$store.state.pageSettings = value);
      },
    },
    content() {
      if (typeof this.searchString == "string")
        return this.searchString.substring(0, 2);
      else return "";
    },
  },
  methods: {
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
  watch: {
    "sets.query"(val) {
      this.searchString = val;
    },
  },
};
</script>