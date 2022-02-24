<template>
  <div>
    <v-form v-model="valid" ref="form" @submit.prevent>
      <v-container fluid>
        <v-row>
          <v-col cols="12" lg="6">
            <v-text-field
              v-model="vals.name"
              :rules="[nameRules]"
              label="Name"
              :prepend-icon="showIcons ? 'mdi-alphabetical-variant' : ''"
            />
          </v-col>

          <v-col v-if="meta.metaSetting.synonyms" cols="12" lg="6">
            <v-text-field
              v-model="vals.synonyms"
              label="Synonyms"
              :prepend-icon="showIcons ? 'mdi-alphabetical' : ''"
            />
          </v-col>

          <v-col
            v-if="meta.metaSetting.rating || meta.metaSetting.favorite"
            cols="12"
            lg="6"
          >
            <div class="d-flex justify-space-between">
              <div
                v-if="meta.metaSetting.rating"
                class="text--secondary caption"
              >
                Rating
              </div>
              <div
                v-if="meta.metaSetting.favorite"
                class="text--secondary caption"
              >
                Favorite
              </div>
            </div>
            <div class="d-flex justify-space-between">
              <v-rating
                v-if="meta.metaSetting.rating"
                v-model="vals.rating"
                color="yellow darken-3"
                background-color="grey darken-1"
                empty-icon="mdi-star-outline"
                half-icon="mdi-star-half-full"
                half-increments
                clearable
                dense
                hover
              />
              <v-btn
                v-if="meta.metaSetting.favorite"
                @click="vals.favorite = !vals.favorite"
                icon
              >
                <v-icon v-if="vals.favorite" size="20" color="pink"
                  >mdi-heart</v-icon
                >
                <v-icon v-else size="20" color="grey"
                  >mdi-heart-outline
                </v-icon>
              </v-btn>
            </div>
          </v-col>

          <v-col v-if="meta.metaSetting.color" cols="12" lg="6" class="mt-3">
            <v-icon :color="vals.color" left>mdi-circle</v-icon>
            <v-btn @click="openDialogColor" outlined rounded>
              Change Color
            </v-btn>
          </v-col>

          <v-col v-for="(i, x) in assigned" :key="x" cols="12" lg="6">
            <MetaInputArray
              v-if="i.meta.type === 'array'"
              @input="setVal($event, i.meta.id)"
              :value="vals[i.childMetaId]"
              :metaId="i.childMetaId"
              :prependIcon="showIcons ? `mdi-${i.meta.icon}` : ''"
            />

            <v-text-field
              v-if="i.meta.type === 'number'"
              v-model="vals[i.childMetaId]"
              :label="i.meta.name"
              :hint="i.meta.hint"
              :prependIcon="showIcons ? `mdi-${i.meta.icon}` : ''"
              type="number"
              persistent-hint
            />

            <v-text-field
              v-if="i.meta.type === 'string'"
              v-model="vals[i.childMetaId]"
              :label="i.meta.name"
              :hint="i.meta.hint"
              :prependIcon="showIcons ? `mdi-${i.meta.icon}` : ''"
              persistent-hint
            />

            <v-text-field
              v-if="i.meta.type === 'date'"
              @click="pickDate"
              :value="vals[i.childMetaId]"
              :label="i.meta.name"
              :hint="i.meta.hint"
              :prependIcon="showIcons ? `mdi-${i.meta.icon}` : ''"
              persistent-hint
              readonly
            />

            <div v-if="i.meta.type === 'rating'" class="d-flex flex-column">
              <div
                class="text--secondary caption"
                :class="[{ 'pl-9': showIcons }]"
              >
                {{ i.meta.name }}
              </div>
              <div class="d-flex">
                <v-icon v-html="showIcons ? `mdi-${i.meta.icon}` : ''" left />
                <v-rating
                  :value="vals[i.childMetaId]"
                  @input="setVal($event, i.childMetaId)"
                  :length="i.meta.metaSetting.ratingMax"
                  :full-icon="`mdi-${i.meta.metaSetting.ratingIcon}`"
                  :empty-icon="`mdi-${
                    i.meta.metaSetting.ratingIconEmpty ||
                    i.meta.metaSetting.ratingIcon
                  }`"
                  :half-increments="i.meta.metaSetting.ratingHalf"
                  :half-icon="`mdi-${
                    i.meta.metaSetting.ratingIconHalf ||
                    i.meta.metaSetting.ratingIcon
                  }`"
                  :color="i.meta.metaSetting.ratingColor"
                  background-color="grey"
                  class="meta-rating"
                  clearable
                  hover
                />
              </div>
              <div
                class="text--secondary caption"
                :class="[{ 'pl-9': showIcons }]"
              >
                {{ i.meta.hint }}
              </div>
            </div>
            <!-- TODO add color, country -->
          </v-col>

          <v-col v-if="meta.metaSetting.bookmark" cols="12" lg="6">
            <v-textarea
              v-model="vals.bookmark"
              :prepend-icon="showIcons ? 'mdi-bookmark' : ''"
              label="Bookmark"
              hide-details
              clearable
              auto-grow
              outlined
            />
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <v-dialog v-model="datePicker.dialog">
      <v-date-picker
        @change="setDate($event)"
        :value="datePicker.value"
        color="primary"
        no-title
      />
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import MetaInputArray from "@/components/meta/input/MetaInputArray.vue";

export default {
  name: "ItemEditing",
  props: {
    item: Object,
    meta: Object,
  },
  components: {
    MetaInputArray,
  },
  async beforeMount() {
    this.vals.name = this.item.name || "";
    this.vals.color = this.item.color || "#777";
    this.vals.synonyms = this.item.synonyms;
    this.vals.rating = this.item.rating || 0;
    this.vals.favorite = this.item.favorite || false;
    this.vals.country = this.item.country || "";
    this.vals.bookmark = this.item.bookmark || "";
    await this.getMetaValues();
  },
  data: () => ({
    valid: false,
    vals: {},
    old: {},
    datePicker: {
      dialog: false,
      index: -1,
      value: null,
    },
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    showIcons() {
      return this.$store.state.settings.showIconsOfMetaInEditingDialog == 1;
    },
    assigned() {
      return this.$store.state.Page.assigned;
    },
  },
  methods: {
    async getMetaValues() {
      let urlItems = `/api/ItemsInItem?itemId=${this.item.id}`;
      let items = [];
      await axios
        .get(this.apiUrl + urlItems)
        .then((res) => {
          items = res.data;
        })
        .catch((e) => {
          console.log(e);
        });

      let urlValues = `/api/ValuesInItem?itemId=${this.item.id}`;
      let values = [];
      await axios
        .get(this.apiUrl + urlValues)
        .then((res) => {
          values = res.data;
        })
        .catch((e) => {
          console.log(e);
        });

      const changeVal = (metaId, val) => {
        this.$set(this.vals, metaId, val);
      };

      const assigned = this.assigned;
      // creating all meta and their values
      for (let i of assigned) changeVal(i.childMetaId, null);

      // parsing values and place their value into meta values
      for (let i of values) {
        let v = i.value;
        let x = assigned.findIndex((j) => j.childMetaId == i.metaId);
        if (x > -1) {
          let type = assigned[x].meta.type;
          if (type === "rating") {
            v = Number(v);
            if (isNaN(v)) v = 0;
          } else if (type === "number") {
            v = Number(v);
            if (isNaN(v)) v = null;
          }
        }
        changeVal(i.metaId, v);
      }

      // parsing items. creating array and place it into meta values
      let pi = {}; // parsed items
      for (let i of items) {
        if (!pi[i.metaId]) pi[i.metaId] = [i.itemId];
        else pi[i.metaId].push(i.itemId);
      }
      for (let i in pi) changeVal(i, pi[i]);

      this.old = _.cloneDeep(this.vals);
      // TODO after deleling assigned meta (child meta) also delete values
    },
    nameRules(string) {
      return Vue.prototype.$validateName(string);
    },
    setVal(val, metaId) {
      this.vals[metaId] = val;
    },
    openDialogColor() {},
    pickDate(index) {
      this.datePicker.dialog = true;
      this.datePicker.value = this.val;
      this.datePicker.index = index;
    },
    setDate(date) {
      this.datePicker.dialog = false;
      this.val = date;
    },
    save() {
      if (!this.valid) return;
      console.log("saved");
    },
  },
};
</script>