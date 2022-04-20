<template>
  <div class="editing" :class="{ 'show-icons': showIcons }">
    <v-form v-model="valid" ref="form" @submit.prevent>
      <v-container fluid>
        <v-row>
          <v-col cols="12" lg="6" class="field">
            <v-text-field
              v-model="vals.name"
              :rules="[nameRules]"
              :prepend-icon="showIcons ? 'mdi-alphabetical-variant' : ''"
              label="Name"
            />
            <v-btn
              v-if="vals.name !== old.name"
              @click="restore('name')"
              class="restore"
              x-small
              icon
            >
              <v-icon>mdi-restore</v-icon>
            </v-btn>
          </v-col>

          <v-col
            v-if="meta.metaSetting.synonyms"
            cols="12"
            lg="6"
            class="field"
          >
            <v-text-field
              v-model="vals.synonyms"
              :prepend-icon="showIcons ? 'mdi-alphabetical' : ''"
              label="Synonyms"
              clearable
            />
            <v-btn
              v-if="vals.synonyms !== old.synonyms"
              @click="restore('synonyms')"
              class="restore"
              x-small
              icon
            >
              <v-icon>mdi-restore</v-icon>
            </v-btn>
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
              <v-checkbox
                v-if="meta.metaSetting.favorite"
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

          <v-col v-if="meta.metaSetting.color" cols="12" lg="6" class="mt-3">
            <v-icon :color="vals.color" left>mdi-circle</v-icon>
            <v-btn @click="pickColor" outlined rounded> Change Color </v-btn>
          </v-col>

          <v-col v-if="meta.metaSetting.country" cols="12" lg="6">
            <MetaInputCountry
              @input="setVal($event, 'country')"
              :value="vals.country"
            />
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
            v-if="meta.metaSetting.bookmark"
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

    <ColorPicker
      v-if="colorPicker.dialog"
      :dialog="colorPicker.dialog"
      :color="colorPicker.color"
      @close="colorPicker.dialog = false"
      @getColor="setColor($event)"
    />

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

export default {
  name: "ItemEditing",
  props: {
    item: Object,
    meta: Object,
  },
  components: {
    MetaInputArray: () => import("@/components/meta/input/MetaInputArray.vue"),
    MetaInputCountry: () =>
      import("@/components/meta/input/MetaInputCountry.vue"),
    ColorPicker: () => import("@/components/elements/ColorPicker.vue"),
  },
  async beforeMount() {
    this.initValues();
    await this.getMetaValues();
  },
  data: () => ({
    valid: false,
    vals: {},
    old: {},
    colorPicker: {
      dialog: false,
      color: null,
    },
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
      return this.$store.state.Items.assigned;
    },
  },
  methods: {
    initValues() {
      let countries = this.item.country;
      if (countries) countries = countries.split(",");
      this.vals.country = countries || [];
      this.vals.name = this.item.name || null;
      this.vals.color = this.item.color || "#777";
      this.vals.synonyms = this.item.synonyms || null;
      this.vals.rating = this.item.rating || 0;
      this.vals.favorite = this.item.favorite || 0;
      this.vals.bookmark = this.item.bookmark || null;
    },
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
    nameRules(string) {
      return Vue.prototype.$validateName(string);
    },
    setVal(val, key) {
      this.$set(this.vals, key, val);
    },
    pickColor() {
      this.colorPicker.color = this.vals.color;
      this.colorPicker.dialog = true;
    },
    setColor(e) {
      this.vals.color = e;
      this.colorPicker.dialog = false;
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
        if (!isMeta) continue;
        if (tv == "string") {
          v = v.trim();
          if (v.length == 0) v = null;
        } else if (tv == "object") {
          let ids = _.cloneDeep(v);
          // collecting items of item
          for (let id in ids) {
            items.push({
              parentItemId: this.item.id,
              itemId: ids[id],
              metaId: key,
            });
          }
        }
        // collecting values of item
        if (isMeta && tv !== "object") {
          values.push({
            value: v,
            itemId: this.item.id,
            metaId: key,
          });
        }
      }

      let itemVals = _.cloneDeep(this.vals);
      if (itemVals.country && itemVals.country.length)
        itemVals.country = itemVals.country.join();
      else itemVals.country = null;

      await axios({
        method: "put",
        url: this.apiUrl + "/api/item/" + this.item.id,
        data: itemVals,
      });

      // removing existed items of item
      await axios({
        method: "delete",
        url: this.apiUrl + "/api/ItemsInItem/" + this.item.id,
      });

      // adding new items of item
      await axios({
        method: "post",
        url: this.apiUrl + "/api/ItemsInItem",
        data: items,
      });

      // removing existed values of item
      await axios({
        method: "delete",
        url: this.apiUrl + "/api/ValuesInItem/" + this.item.id,
      });

      // adding new values of item
      await axios({
        method: "post",
        url: this.apiUrl + "/api/ValuesInItem",
        data: values,
      });

      this.$emit("close");
      this.$root.$emit("getItemsFromDb", [this.item.id]);
    },
  },
};
</script>