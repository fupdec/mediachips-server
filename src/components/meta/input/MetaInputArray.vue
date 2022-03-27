<template>
  <v-autocomplete
    @input="setVal($event)"
    :value="val"
    :items="listItems"
    item-value="id"
    ref="field"
    :search-input.sync="search"
    :rules="[rules]"
    :disabled="disabled"
    :filter="filterItems"
    :menu-props="menuProps"
    :label="meta.name"
    :hint="meta.hint"
    append-icon="mdi-chevron-down"
    :prepend-icon="prependIcon"
    :persistent-hint="view.persistentHint"
    :hide-details="view.hideDetails"
    :outlined="view.outlined"
    :multiple="multiple"
    :hide-no-data="!search"
    :attach="attach"
    :autofocus="autofocus"
    hide-selected
    clearable
    class="val custom-chips-size"
  >
    <template v-slot:no-data>
      <div v-if="dialog == 'filtering'" class="pa-3">No data available</div>
      <v-list-item v-else @click="create" class="pa-3">
        <span class="mr-2">Create</span>
        <v-chip small v-html="search" />
      </v-list-item>
    </template>
    <!-- TODO add rules -->
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        @click="removeItem(data.item.id)"
        @mouseover.stop="hoverImage($event, data.item.id)"
        @mouseleave.stop="hideHoverImage"
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
        @click="hideHoverImage"
        @mouseover.stop="hoverImage($event, data.item.id)"
        @mouseleave.stop="hideHoverImage"
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
    dialog: String,
    value: [Array, Number],
    disabled: {
      type: Boolean,
      default: false,
    },
    cond: {
      type: String,
      default: null,
    },
    prependIcon: {
      type: String,
      default: null,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    attach: {
      type: [Boolean, String],
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    menuProps: {
      type: Object,
      default: () => ({
        contentClass: "custom-list",
      }),
    },
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
    this.val = this.value;
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
    search: null,
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
      sets.limit = -1;
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
    create() {
      if (!this.search) return;
      let isExists =
        this.listItems.findIndex(
          (i) => i.name.toLowerCase() === this.search.trim().toLowerCase()
        ) > -1;
      if (isExists) return;
      axios({
        method: "post",
        url: this.apiUrl + "/api/item",
        data: [
          {
            name: this.search,
            metaId: this.metaId,
          },
        ],
      })
        .then((res) => {
          this.search = null;
          let val = [res.data[0].id];
          if (typeof this.val == "object") val = [...this.val, ...val];
          this.setVal(val);
          this.getItems();
          this.$root.$emit("getItems");
          if (+this.$route.query.metaId === this.metaId)
            this.$root.$emit("getItemsFromDb", []);
        })
        .catch((e) => {
          // console.log(e);
        });
    },
    setVal(val) {
      this.$refs.field.lazySearch = null;
      this.val = val;
      this.$emit("input", val);
    },
    hoverImage(event, itemId) {
      clearTimeout(this.$store.state.hover.timeout);
      this.$store.state.hover.timeout = setTimeout(() => {
        Vue.prototype.$showHoverImage(event, this.metaId, itemId);
      }, 500);
    },
    hideHoverImage() {
      clearTimeout(this.$store.state.hover.timeout);
      this.$store.state.hover.show = false;
    },
    removeItem(item) {
      const index = this.val.indexOf(item);
      if (index > -1) this.val.splice(index, 1);
      this.hideHoverImage();
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

      if (filtersDefault == "1") {
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