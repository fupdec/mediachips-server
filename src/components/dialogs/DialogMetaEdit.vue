<template>
  <div>
    <v-dialog
      v-if="dialog"
      :value="dialog"
      @input="close"
      :fullscreen="$vuetify.breakpoint.xs"
      scrollable
      width="600"
    >
      <v-card>
        <DialogHeader
          @close="close"
          :header="`Meta: ${meta.name}`"
          :buttons="buttons"
          closable
        />

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
        </v-card-text>
      </v-card>
    </v-dialog>

    <DialogDeleteConfirm
      v-if="dialogDeleteMeta"
      @close="dialogDeleteMeta = false"
      @delete="deleteMeta"
      :dialog="dialogDeleteMeta"
      :text="textDialogDelete"
    />

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
  name: "DialogMetaEdit",
  props: {
    dialog: Boolean,
    meta: Object,
  },
  components: {
    DialogHeader,
    DialogIcons: () => import("@/components/dialogs/DialogIcons.vue"),
    DialogDeleteConfirm: () =>
      import("@/components/dialogs/DialogDeleteConfirm.vue"),
    MetaSettingsArray: () =>
      import("@/components/dialogs/meta/MetaSettingsArray.vue"),
    MetaSettingsRating: () =>
      import("@/components/dialogs/meta/MetaSettingsRating.vue"),
  },
  mounted() {
    this.initButtons();
    this.initMeta();
    this.getSettings();
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
    buttons: [],
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    textDialogDelete() {
      let t = "The meta will be removed from all assigned media and items.\n";
      if (this.meta.type == "array")
        t += "And it will also delete all items of this meta.\n";
      t += "Are you sure?";
      return t;
    },
  },
  methods: {
    initButtons() {
      this.buttons.push(
        {
          icon: "delete",
          text: "Delete",
          color: "error",
          outlined: false,
          function: () => {
            dialogDeleteMeta = true;
          },
        },
        {
          icon: "check",
          text: "Apply",
          color: "success",
          outlined: false,
          function: () => {
            this.apply();
          },
        }
      );
    },
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