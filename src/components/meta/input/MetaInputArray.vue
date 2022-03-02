<template>
  <v-autocomplete
    @input="setVal($event)"
    :value="val"
    :items="listItems"
    item-value="id"
    :rules="[rules]"
    :disabled="disabled"
    :filter="filterItems"
    :menu-props="{ contentClass: 'list-with-preview' }"
    :label="meta.name"
    :hint="meta.hint"
    append-icon="mdi-chevron-down"
    :prepend-icon="prependIcon"
    :persistent-hint="view.persistentHint"
    :hide-details="view.hideDetails"
    :outlined="view.outlined"
    hide-selected
    multiple
    clearable
    class="val"
  >
    <!-- TODO add rules -->
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        @click="removeItem(data.item.id)"
        @mouseover.stop="showHoverImage($event, data.item.id)"
        @mouseleave.stop="$store.state.hover.show = false"
        :input-value="data.selected"
        :color="data.item.color"
        :label="meta.metaSetting.chipLabel"
        :outlined="meta.metaSetting.chipOutlined"
      >
        <span>{{ data.item.name }}</span>
      </v-chip>
    </template>
    <template v-slot:item="data">
      <div
        @mouseover.stop="showHoverImage($event, data.item.id)"
        @mouseleave.stop="$store.state.hover.show = false"
        class="list-item"
      >
        <span v-if="meta.metaSetting.favorite">
          <v-icon v-if="data.item.favorite" color="pink" left small>
            mdi-heart
          </v-icon>
          <v-icon v-else left small> mdi-heart-outline </v-icon>
        </span>
        <span v-if="meta.metaSetting.color">
          <v-icon :color="data.item.color || ''" left size="14">
            mdi-circle
          </v-icon>
        </span>
        <span>{{ data.item.name }}</span>
        <span v-if="meta.metaSetting.synonyms" class="synonyms">
          {{ data.item.synonyms }}
        </span>
      </div>
    </template>
  </v-autocomplete>
</template>


<script>
import Vue from "vue";
import axios from "axios";

export default {
  name: "MetaInputArray",
  props: {
    metaId: Number,
    disabled: Boolean || false,
    dialog: String,
    cond: null,
    value: Array,
    prependIcon: null,
  },
  async beforeMount() {
    await axios
      .get(this.apiUrl + "/api/meta/" + this.metaId)
      .then((res) => {
        this.meta = res.data;
      })
      .catch((e) => {
        console.log(e);
      });
    if (this.dialog == "filtering") {
      this.view.persistentHint = false;
      this.view.hideDetails = true;
      this.view.outlined = true;
    }
  },
  mounted() {
    this.getItems();
  },
  data: () => ({
    meta: {},
    val: [],
    listItems: [],
    view: {
      persistentHint: true,
      hideDetails: false,
      outlined: false,
    },
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
  },
  methods: {
    async getItems() {
      let sets = {};
      sets.metaId = this.metaId;
      sets.page = 0;
      sets.limit = 10000;
      sets.sortBy = "name";
      sets.sortDir = "asc";
      sets.filters = [];
      sets.query = Vue.prototype.$filterItems(sets, "items");

      await axios({
        method: "post",
        url: this.apiUrl + "/api/item/filter",
        data: sets,
      })
        .then((res) => {
          this.listItems = res.data.items;
        })
        .catch((e) => {
          this.listItems = [];
          console.log(e);
        });
    },
    setVal(val) {
      this.val = val;
      this.$emit("input", val);
    },
    showHoverImage(event, itemId) {
      Vue.prototype.$showHoverImage(event, this.metaId, itemId);
    },
    removeItem(item) {
      const index = this.val.indexOf(item);
      if (index > -1) this.val.splice(index, 1);
      this.$store.state.hover.show = false;
    },
    filterItems(itemObj, queryText, itemText) {
      let item = _.cloneDeep(itemObj);
      let query = queryText.toLowerCase();

      function foundByChars(text, query) {
        text = text.toLowerCase();
        let foundCharIndex = 0;
        let foundAllChars = false;
        for (let i = 0; i < query.length; i++) {
          const char = query.charAt(i);
          const x = text.indexOf(char, foundCharIndex);
          if (x > -1) (foundAllChars = true), (foundCharIndex = x + 1);
          else return false;
        }
        return foundAllChars;
      }

      let filtersDefault = this.$store.state.settings.typingFiltersDefault;

      if (filtersDefault) {
        let x = item.name.toLowerCase().indexOf(query);
        if (x > -1) return true;
        else {
          if (!item.synonyms) return false;
          for (let i of item.synonyms) {
            let indexSub = i.toLowerCase().indexOf(query);
            if (indexSub > -1) return true;
          }
          return false;
        }
      } else {
        if (foundByChars(item.name, query)) return true;
        else {
          if (!item.synonyms) return false;
          for (let i of item.synonyms) return foundByChars(i, query);
          return false;
        }
      }
    },
    rules() {
      if (this.dialog !== "filtering") return true;
      if (this.val !== null && this.val.length > 0) return true;
      else if (this.cond === "is null" || this.cond === "null") return true;
      else return "Value is required";
    },
  },
  watch: {
    value(val) {
      this.val = val;
    },
  },
};
</script>