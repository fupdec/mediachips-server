<template>
  <div class="editing" :class="{ 'show-icons': showIcons }">
    <v-form v-model="valid" ref="form" @submit.prevent>
      <v-container fluid>
        <v-row>
          <v-col cols="12" lg="6" class="field">
            <v-text-field
              v-model="vals.path"
              :rules="[(v) => !!v || 'Required']"
              :prepend-icon="showIcons ? 'mdi-alphabetical-variant' : ''"
              label="Path"
            />
            <v-btn
              v-if="vals.path !== old.path"
              @click="restore('path')"
              class="restore"
              x-small
              icon
            >
              <v-icon>mdi-restore</v-icon>
            </v-btn>
          </v-col>

          <v-col cols="12" lg="6">
            <div class="d-flex justify-space-between">
              <div class="text--secondary caption">Rating</div>
              <div class="text--secondary caption">Favorite</div>
            </div>
            <div class="d-flex justify-space-between">
              <v-rating
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
              <v-checkbox
                v-model="vals.favorite"
                :false-value="0"
                :true-value="1"
                off-icon="mdi-heart-outline"
                on-icon="mdi-heart"
                color="pink"
                hide-details
                class="ma-0"
              />
            </div>
          </v-col>

          <v-col
            v-for="(i, x) in assigned"
            :key="x"
            cols="12"
            lg="6"
            class="field"
          >
            <MetaInputArray
              v-if="i.meta.type === 'array'"
              @input="setVal($event, i.meta.id)"
              :value="vals[i.metaId]"
              :metaId="i.metaId"
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
              clearable
            />

            <v-text-field
              v-if="i.meta.type === 'string'"
              v-model="vals[i.childMetaId]"
              :label="i.meta.name"
              :hint="i.meta.hint"
              :prependIcon="showIcons ? `mdi-${i.meta.icon}` : ''"
              persistent-hint
              clearable
            />

            <v-text-field
              v-if="i.meta.type === 'date'"
              @click="pickDate(i.childMetaId)"
              :value="vals[i.childMetaId]"
              :label="i.meta.name"
              :hint="i.meta.hint"
              :prependIcon="showIcons ? `mdi-${i.meta.icon}` : ''"
              persistent-hint
              readonly
              clearable
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

            <v-btn
              v-if="!equalOld(i.childMetaId, i.meta.type)"
              @click="restore(i.childMetaId)"
              class="restore"
              x-small
              icon
            >
              <v-icon>mdi-restore</v-icon>
            </v-btn>
            <!-- TODO Date fix, clearable, restore -->
            <!-- TODO add color, country -->
          </v-col>

          <v-col
            cols="12"
            lg="6"
            class="field"
          >
            <v-textarea
              v-model="vals.bookmark"
              :prepend-icon="showIcons ? 'mdi-bookmark' : ''"
              label="Bookmark"
              hide-details
              clearable
              auto-grow
              outlined
            />
            <v-btn
              v-if="vals.bookmark !== old.bookmark"
              @click="restore('bookmark')"
              class="restore"
              x-small
              icon
            >
              <v-icon>mdi-restore</v-icon>
            </v-btn>
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
  name: "MediaEditing",
  props: {
    media: Object,
    meta: Object,
  },
  components: {
    MetaInputArray,
    ColorPicker: () => import("@/components/elements/ColorPicker.vue"),
  },
  async beforeMount() {
    this.vals.path = this.media.path || null;
    this.vals.rating = this.media.rating || 0;
    this.vals.favorite = this.media.favorite || 0;
    this.vals.bookmark = this.media.bookmark || null;
    await this.getMetaValues();
  },
  data: () => ({
    valid: false,
    vals: {},
    old: {},
    datePicker: {
      dialog: false,
      metaId: null,
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
      let urlItems = `/api/ItemsInMedia?mediaId=${this.media.id}`;
      let items = [];
      await axios
        .get(this.apiUrl + urlItems)
        .then((res) => {
          items = res.data;
        })
        .catch((e) => {
          console.log(e);
        });

      let urlValues = `/api/ValuesInMedia?mediaId=${this.media.id}`;
      let values = [];
      await axios
        .get(this.apiUrl + urlValues)
        .then((res) => {
          values = res.data;
        })
        .catch((e) => {
          console.log(e);
        });

      const assigned = this.assigned;
      // creating all meta and their values
      for (let i of assigned) this.setVal(null, i.childMetaId);

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
            // v = Number(v);
            // if (isNaN(v)) v = null;
          }
        }
        this.setVal(v, i.metaId);
      }

      // parsing items. creating array and place it into meta values
      let pi = {}; // parsed items
      for (let i of items) {
        if (!pi[i.metaId]) pi[i.metaId] = [i.itemId];
        else pi[i.metaId].push(i.itemId);
      }
      for (let i in pi) this.setVal(pi[i], i);

      this.vals = Object.assign({}, this.vals, this.vals);
      this.old = _.cloneDeep(this.vals);
      // TODO after deleling assigned meta (child meta) also delete values
    },
    setVal(val, key) {
      this.$set(this.vals, key, val);
    },
    pickDate(metaId) {
      this.datePicker.dialog = true;
      this.datePicker.value = this.vals[metaId];
      this.datePicker.metaId = metaId;
    },
    setDate(date) {
      this.datePicker.dialog = false;
      this.vals[this.datePicker.metaId] = date;
    },
    equalOld(metaId, metaType) {
      let val = this.vals[metaId];
      let old = this.old[metaId];
      if (metaType == "array") {
        val = _.cloneDeep(val);
        old = _.cloneDeep(old);
        if (!val) val = [];
        if (!old) old = [];
        return _.isEqual(val.sort(), old.sort());
      } else return val === old;
    },
    restore(key) {
      let val = _.cloneDeep(this.old[key]);
      this.$set(this.vals, key, val);
    },
    async save() {
      if (!this.valid) return;

      let items = [];
      let values = [];

      for (let key in this.vals) {
        let v = this.vals[key];
        let tv = typeof v;
        let isMeta = /\d/.test(key);
        if (tv == "string") {
          v = v.trim();
          if (v.length == 0) v = null;
        } else if (tv == "object") {
          let ids = _.cloneDeep(v);
          // collecting items of media
          for (let id in ids) {
            items.push({
              parentItemId: this.media.id,
              itemId: ids[id],
              metaId: key,
            });
          }
        }
        // collecting values of media
        if (isMeta && tv !== "object") {
          values.push({
            value: v,
            itemId: this.media.id,
            metaId: key,
          });
        }
      }

      await axios({
        method: "put",
        url: this.apiUrl + "/api/media/" + this.media.id,
        data: this.vals,
      });

      // removing existed items of media
      await axios({
        method: "delete",
        url: this.apiUrl + "/api/ItemsInMedia/" + this.media.id,
      });

      // adding new items of media
      await axios({
        method: "post",
        url: this.apiUrl + "/api/ItemsInMedia",
        data: items,
      });

      // removing existed values of media
      await axios({
        method: "delete",
        url: this.apiUrl + "/api/ValuesInMedia/" + this.media.id,
      });

      // adding new values of media
      await axios({
        method: "post",
        url: this.apiUrl + "/api/ValuesInMedia",
        data: values,
      });

      this.$emit("close");
      this.$root.$emit("getItemsFromDb", [this.media.id]);
    },
  },
};
</script>