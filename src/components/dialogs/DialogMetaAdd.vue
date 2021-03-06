<template>
  <div>
    <v-dialog
      v-if="dialog"
      :value="dialog"
      @input="close"
      scrollable
      width="450"
    >
      <v-card>
        <DialogHeader
          @close="close"
          :header="`Adding meta`"
          :buttons="buttons"
          closable
        />

        <v-card-text class="pa-4">
          <v-alert
            v-show="type == 'array' || type == 'rating'"
            type="info"
            text
            dense
            class="body-2"
          >
            After adding, a dialog with detailed settings will appear
          </v-alert>
          <v-alert
            v-show="type == 'array'"
            type="info"
            text
            dense
            class="body-2"
          >
            You can view and manage array items on the meta page. A link to the
            meta page will appear in the navigation menu.
          </v-alert>
          <v-form
            v-model="valid"
            ref="form"
            class="flex-grow-1"
            @submit.prevent
          >
            <v-select
              v-model="type"
              label="Type"
              :items="[
                'array',
                'string',
                'number',
                'boolean',
                'date',
                'rating',
              ]"
              :rules="[(value) => !!value || 'Type is required']"
              :hint="getHint()"
              menu-props="offset-y"
            >
              <template v-slot:selection="data">
                <v-icon left>{{ getIcon(data.item) }}</v-icon>
                <span class="mr-2">{{ data.item }}</span>
              </template>
              <template v-slot:item="data">
                <v-icon left>{{ getIcon(data.item) }}</v-icon>
                <span>{{ data.item }}</span>
              </template>
            </v-select>

            <v-text-field v-model="name" :rules="[nameRules]" label="Name" />
            <v-text-field
              v-if="type == 'array'"
              v-model="singular"
              :rules="[nameRules]"
              label="Singular name"
            />
            <v-text-field
              v-model="metaHint"
              label="Hint"
              hint="This text under the field is the hint"
            />

            <div class="text--secondary caption mt-2 mb-1">Icon</div>
            <div class="d-flex align-center">
              <v-icon large left>mdi-{{ metaIcon }}</v-icon>
              <v-btn @click="dialogIcons = true" small rounded outlined>
                <v-icon left>mdi-shape-plus</v-icon>
                Change icon
              </v-btn>
            </div>

            <v-switch
              v-if="type == 'string'"
              v-model="isLink"
              label="Link to an Internet address"
              hide-details
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <DialogIcons
      v-if="dialogIcons"
      @close="dialogIcons = false"
      @apply="changeIcon($event)"
    />
  </div>
</template>


<script>
import Vue from "vue";
import axios from "axios";
import DialogHeader from "@/components/elements/DialogHeader.vue";

export default {
  props: {
    dialog: Boolean,
  },
  name: "DialogMetaAdd",
  components: {
    DialogHeader,
    DialogIcons: () => import("@/components/dialogs/DialogIcons.vue"),
  },
  mounted() {
    this.initButtons();
  },
  data: () => ({
    dialogIcons: false,
    valid: false,
    type: "string",
    name: "",
    singular: "",
    metaHint: "",
    metaIcon: "shape",
    isLink: false,
    buttons: [],
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
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
          this.addMeta();
        },
      });
    },
    changeIcon(icon) {
      this.dialogIcons = false;
      this.metaIcon = icon;
    },
    getHint() {
      const type = this.type;
      if (type === "string") return "for description or notes";
      if (type === "date") return "e.g. release date, last viewed date";
      if (type === "number") return "to count";
      if (type === "array")
        return "for multiple items. for example: Earth, Mars, Venus.";
      if (type === "boolean") return "true or false";
      if (type === "rating") return "for scoring";
      return "Please select one of the types";
    },
    getIcon(type) {
      return Vue.prototype.$getIconDataType(type);
    },
    nameRules(string) {
      return Vue.prototype.$validateName(string);
    },
    async addMeta() {
      this.$refs.form.validate();
      if (!this.valid) return;

      await axios({
        method: "post",
        url: this.apiUrl + "/api/Meta",
        data: {
          type: this.type,
          name: this.name,
          nameSingular: this.type == "array" ? this.singular : this.name,
          hint: this.metaHint,
          icon: this.metaIcon,
          metaSetting: {
            isLink: this.isLink,
          },
          pageSetting:
            this.type == "array"
              ? {
                  page: 1,
                }
              : null,
        },
      })
        .then(() => {
          this.$emit("added", this.type);
          if (this.type == "array") this.$root.$emit("getMeta");
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