<template>
  <div>
    <v-dialog
      v-if="dialog"
      :value="dialog"
      @input="close"
      scrollable
      width="600"
    >
      <v-card>
        <div class="d-flex justify-space-between">
          <div class="headline ma-4">Settings of meta "{{ meta.name }}"</div>
          <div
            class="
              d-flex
              flex-sm-row flex-column-reverse
              justify-end
              ma-sm-4 ma-2
            "
          >
            <v-btn @click="close" outlined>
              <v-icon left>mdi-close</v-icon> Cancel
            </v-btn>
            <v-spacer class="ma-sm-2 ma-1"></v-spacer>
            <v-btn @click="apply" color="success" depressed>
              <v-icon left>mdi-check</v-icon> Apply
            </v-btn>
          </div>
        </div>

        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <v-form
            v-model="valid"
            ref="form"
            class="flex-grow-1"
            @submit.prevent
          >
            <v-text-field v-model="name" :rules="[nameRules]" label="Name" />
            <v-text-field
              v-if="meta.type == 'array'"
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
          </v-form>

          <!-- Rating -->
          <MetaSettingsRating
            v-if="meta.type == 'rating'"
            @update="updateRating($event)"
            :meta="meta"
          />

          <!-- String -->
          <v-switch
            v-if="meta.type == 'string'"
            v-model="isLink"
            label="Link to an Internet address"
            hide-details
          />

          <!-- Array -->
          <MetaSettingsArray
            v-if="meta.type == 'array'"
            @update="updateSettingsArray($event)"
            :meta="meta"
          />

          <div class="mt-6 text-right">
            <v-btn @click="dialogDeleteMeta = true" color="error" depressed>
              <v-icon left>mdi-delete</v-icon>
              Delete meta
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDeleteMeta">
      <v-card>
        <v-card-text class="text-center">
          <v-icon large color="error" class="py-6"> mdi-alert-outline </v-icon>
          <div class="error--text">
            The meta will be removed from all assigned media and items.
            <div v-if="meta.type == 'array'">
              And it will also delete all items of this meta.
            </div>
            Are you sure?
          </div>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-btn @click="dialogDeleteMeta = false" plain>
            <v-icon left>mdi-close</v-icon> Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="deleteMeta" color="error" plain>
            <v-icon left>mdi-check</v-icon> Delete
          </v-btn>
        </v-card-actions>
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

export default {
  name: "DialogMetaEdit",
  props: {
    dialog: Boolean,
    meta: Object,
  },
  name: "DialogEditMetaRating",
  components: {
    DialogIcons: () => import("@/components/dialogs/DialogIcons.vue"),
    MetaSettingsArray: () =>
      import("@/components/dialogs/meta/MetaSettingsArray.vue"),
    MetaSettingsRating: () =>
      import("@/components/dialogs/meta/MetaSettingsRating.vue"),
  },
  mounted() {
    this.$nextTick(() => {
      this.initMeta();
      this.getSettings();
    });
  },
  data: () => ({
    dialogIcons: false,
    dialogDeleteMeta: false,
    valid: false,
    name: "",
    singular: "",
    metaHint: "",
    metaIcon: "shape",
    isLink: false,
    rating: {},
    settingsArray: {},
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
  },
  methods: {
    initMeta() {
      const meta = this.meta;
      this.name = meta.name;
      this.singular = meta.nameSingular;
      this.metaHint = meta.hint;
      this.metaIcon = meta.icon;
    },
    changeIcon(icon) {
      this.dialogIcons = false;
      this.metaIcon = icon;
    },
    getHint() {
      const type = this.meta.type;
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
    async apply() {
      this.$refs.form.validate();
      if (!this.valid) return;

      await axios({
        method: "put",
        url: this.apiUrl + "/api/Meta/" + this.meta.id,
        data: {
          name: this.name,
          nameSingular: this.singular,
          hint: this.metaHint,
          icon: this.metaIcon,
        },
      })
        .then(() => {
          if (this.type == "array") this.$root.$emit("getMeta");
        })
        .catch((e) => {
          console.log(e);
        });

      this.updateSettings();
      this.close();
    },
    getSettings() {
      axios
        .get(this.apiUrl + "/api/MetaSetting/" + this.meta.id)
        .then((res) => {
          const settings = res.data;
          this.isLink = settings.isLink;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    updateSettings() {
      const data = {
        ...this.settingsArray,
        ...this.rating,
        ...{
          isLink: this.isLink,
        },
      };
      axios({
        method: "put",
        url: this.apiUrl + "/api/MetaSetting/" + this.meta.id,
        data: data,
      });
      this.$emit("update", this.meta.type);
    },
    updateRating(rating) {
      this.rating = rating;
    },
    updateSettingsArray(settings) {
      this.settingsArray = settings;
    },
    close() {
      this.$emit("close");
    },
    deleteMeta() {
      this.$emit("delete", this.meta);
    },
  },
};
</script>