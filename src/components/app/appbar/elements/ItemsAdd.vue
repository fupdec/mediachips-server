<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn @click="dialogNames = true" v-on="on" icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-dialog v-model="dialogNames" scrollable width="600">
        <v-card>
          <DialogHeader
            @close="dialogNames = false"
            :header="`Adding ${Items.name}`"
            :buttons="buttons"
            closable
          />

          <v-card-text class="pa-sm-4 pa-2">
            <v-form ref="form" v-model="valid">
              <v-textarea
                v-model="names"
                :rules="[(v) => !!v || 'Name is required', nameRules]"
                hint="Write a name on a new line to add several"
                label="Names"
                outlined
                required
                autofocus
                no-resize
              />
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
    <span> Add {{ Items.nameSingular }} </span>
  </v-tooltip>
</template>


<script>
import axios from "axios";
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
    apiUrl() {
      return this.$store.state.localhost;
    },
    Items() {
      return this.$store.state.Items;
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
      let names = Vue.prototype.$transformTextToArray(this.names);
      const items = this.Items.all;
      this.dups = [];
      this.added = [];

      for (const n of names) {
        // checking for duplicates
        let duplicate = items.findIndex(
          (i) => i.name.toLowerCase() === n.toLowerCase()
        );
        if (duplicate > -1) {
          this.dups.push(n);
          continue;
        }
        this.added.push(n);
      }

      if (this.dups.length > 0)
        this.$store.commit("setNotification", {
          type: "warning",
          text: `Duplicates: ${this.dups.join(", ")}`,
        });

      if (this.added.length > 0)
        await axios({
          method: "post",
          url: this.apiUrl + "/api/item",
          data: this.added.map((i) => {
            return {
              name: i,
              metaId: +this.$route.query.metaId,
            };
          }),
        })
          .then((res) => {
            this.$store.commit("setNotification", {
              type: "success",
              text: `Added items: ${this.added.join(", ")}`,
            });
            this.$root.$emit("getItemsFromDb", []);
            this.$root.$emit("getItems");
          })
          .catch((e) => {
            // console.log(e);
          });

      this.dialogNames = false;
      this.names = "";
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