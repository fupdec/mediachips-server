<template>
  <v-menu offset-y nudge-bottom="10" :close-on-content-click="false">
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-btn v-on="{ ...onMenu, ...onTooltip }" icon tile>
            <v-icon> mdi-plus </v-icon>
          </v-btn>
        </template>
        <span> Add New {{ page.nameSingular }} </span>
      </v-tooltip>
    </template>
    <v-card width="500">
      <div class="d-flex pa-4">
        <div class="headline">Adding New {{ page.nameSingular }}</div>
        <v-spacer class="mx-2"></v-spacer>
        <v-btn @click="add" color="success" depressed>
          <v-icon left>mdi-plus</v-icon> Add
        </v-btn>
      </div>

      <v-divider></v-divider>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-textarea
            v-model="names"
            label="Names"
            outlined
            required
            :rules="[nameRules]"
            autofocus
            :hint="`Write a name on a new line to add several ${page.name.toLowerCase()} at once`"
            no-resize
          />
          <v-alert
            v-if="dups.length"
            border="left"
            dense
            text
            dismissible
            class="mt-4 mb-0"
            icon="mdi-plus-circle-multiple-outline"
            close-text="Close"
            type="warning"
          >
            Already in the database: {{ dups.join(", ") }}
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
  </v-menu>
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
    add() {
      this.$refs.form.validate();
      if (!this.valid) return;
      let arr = this.names.trim();
      arr = arr.split(/\r?\n/);
      arr = arr.filter((el) => el != "");
      arr = arr.map((s) => s.trim());

      const allItems = ["allItems"];

      this.dups = [];
      this.added = [];

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
      return Vue.prototype.$validateName(string);
    },
  },
  watch: {
    "sets.query"(val) {
      this.searchString = val;
    },
  },
};
</script>