<template>
  <v-form ref="form" v-model="valid">
    <v-btn
      v-show="index != 0"
      @click="toggleUnion"
      outlined
      rounded
      x-small
      class="mb-2"
    >
      {{ filter.union === "AND" ? "AND" : "OR" }}
    </v-btn>

    <v-card outlined class="filter-row pa-2 mb-2">
      <v-autocomplete
        @input="setBy($event)"
        :value="filter.by"
        :items="listBy"
        :disabled="filter.lock"
        :filter="filterBy"
        :rules="[(v) => !!v || 'By is required']"
        item-value="by"
        label="By"
        class="by"
        outlined
        dense
        hide-selected
        hide-details
      >
        <template v-slot:selection="data">
          <v-icon>mdi-{{ data.item.icon }}</v-icon>
          <span class="mx-2">{{ data.item.text }}</span>
          <v-icon small>{{ getIconType(data.item.type) }}</v-icon>
        </template>
        <template v-slot:item="data">
          <div class="d-flex justify-space-between" style="width: 100%">
            <v-icon>mdi-{{ data.item.icon }}</v-icon>
            <span class="mx-2" style="width: 100%">{{ data.item.text }}</span>
            <v-icon small>{{ getIconType(data.item.type) }}</v-icon>
          </div>
        </template>
      </v-autocomplete>

      <v-autocomplete
        @input="setCond($event)"
        :value="filter.cond"
        :items="getListCond(filter.type)"
        :disabled="filter.lock"
        :filter="filterBy"
        :rules="[(v) => !!v || 'Condition is required']"
        item-value="cond"
        label="Condition"
        class="cond mx-sm-2"
        outlined
        dense
        hide-selected
        hide-details
      >
        <template v-slot:selection="data">
          <v-icon>mdi-{{ data.item.icon }}</v-icon>
          <span class="mx-2">{{ data.item.text }}</span>
        </template>
        <template v-slot:item="data">
          <div class="list-item">
            <v-icon left>mdi-{{ data.item.icon }}</v-icon>
            <span>{{ data.item.text }}</span>
          </div>
        </template>
      </v-autocomplete>

      <v-text-field
        v-if="filter.type === 'string' || filter.type === null"
        @input="setVal($event)"
        :value="filter.val"
        :disabled="
          filter.lock || filter.cond == 'is null' || filter.cond == 'not null'
        "
        :rules="[validVal]"
        label="String"
        class="val"
        outlined
        dense
        hide-details
      />

      <v-text-field
        v-if="filter.type === 'number'"
        @input="setVal($event)"
        :value="filter.val"
        :disabled="
          filter.lock || filter.cond == 'is null' || filter.cond == 'not null'
        "
        :rules="[validVal]"
        type="number"
        label="Number"
        class="val"
        outlined
        dense
        hide-details
      />

      <v-text-field
        v-if="filter.type === 'date'"
        @click="pickDate"
        :value="filter.val"
        :disabled="
          filter.lock || filter.cond == 'is null' || filter.cond == 'not null'
        "
        :rules="[validVal]"
        label="Date"
        class="val"
        outlined
        dense
        readonly
        hide-details
      />

      <v-autocomplete
        v-if="filter.type === 'array'"
        @input="setVal($event)"
        :value="filter.val"
        :items="listItems"
        item-value="id"
        :disabled="
          filter.lock || filter.cond == 'empty' || filter.cond == 'not empty'
        "
        :menu-props="{ contentClass: 'list-with-preview' }"
        :ref="filter.by"
        :filter="filterItems"
        :rules="[validVal]"
        label="Values"
        class="val hidden-close"
        outlined
        multiple
        dense
        hide-selected
        hide-details
      >
        <template v-slot:selection="data">
          <v-chip
            v-bind="data.attrs"
            @click="data.select"
            @click:close="removeItem(data.item.id)"
            @mouseover.stop="showHoverImage($event, data.item.id)"
            @mouseleave.stop="$store.state.hover.show = false"
            :input-value="data.selected"
            :color="data.item.color"
            :label="meta.metaSetting.chipLabel"
            :outlined="meta.metaSetting.chipOutlined"
            small
            close
            class="my-1 px-2"
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
              <v-icon v-if="data.item.favorite" color="pink" left size="14">
                mdi-heart
              </v-icon>
              <v-icon v-else left size="14"> mdi-heart-outline </v-icon>
            </span>
            <span v-if="meta.metaSetting.color">
              <v-icon :color="data.item.color || ''" left x-small>
                mdi-circle
              </v-icon>
            </span>
            <span>{{ data.item.name }}</span>
            <span v-if="meta.metaSetting.synonyms" class="aliases">
              {{ data.item.synonyms }}
            </span>
          </div>
        </template>
      </v-autocomplete>

      <v-card-actions class="pa-0">
        <v-btn
          @click="duplicate"
          title="Duplicate filter"
          class="ma-1 ml-sm-3"
          color="green"
          outlined
          icon
          fab
          x-small
          :disabled="filter.type == 'boolean'"
        >
          <v-icon>mdi-content-duplicate</v-icon>
        </v-btn>

        <v-btn
          @click="remove"
          :disabled="filter.lock"
          class="ma-1"
          color="red"
          outlined
          icon
          fab
          x-small
          title="Remove filter"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>


<script>
import Vue from "vue";
import axios from "axios";

export default {
  props: {
    filter: Object,
    index: Number,
    listBy: Array,
  },
  mounted() {
    this.$nextTick(function () {});
  },
  data: () => ({
    valid: false,
    listItems: [],
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
  },
  methods: {
    setBy(val) {
      if (!val) return;
      this.$emit("setBy", val);
    },
    setCond(val) {
      this.$emit("setCond", val);
    },
    setVal(val) {
      this.$emit("setVal", val);
    },
    toggleUnion() {
      const val = this.filter.union === "AND" ? "OR" : "AND";
      this.$emit("setUnion", val);
    },
    duplicate() {
      this.$emit("duplicate");
    },
    async getItems(metaId) {
      let sets = {};
      sets.metaId = metaId;
      sets.page = 0;
      sets.limit = 10000;
      sets.sortBy = "name";
      sets.sortDir = "asc";
      sets.filters = [];
      sets.query = Vue.prototype.$filterItems(sets, "items");

      await axios
        .get(this.apiUrl + "/api/meta/" + metaId)
        .then((res) => {
          this.meta = res.data;
        })
        .catch((e) => {
          this.listItems = [];
          console.log(e);
        });

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
    getHint() {},
    getIconType(type) {
      return Vue.prototype.$getIconDataType(type);
    },
    showHoverImage(event, itemId) {
      Vue.prototype.$showHoverImage(event, this.filter.by, itemId);
    },
    removeItem(item) {
      const index = this.filter.val.indexOf(item);
      if (index > -1) this.filter.val.splice(index, 1);
      this.$store.state.hover.show = false;
    },
    remove() {
      this.$emit("remove");
    },
    getListCond(type) {
      if (!type) return [];
      else if (type == "number" || type == "date")
        return [
          {
            cond: "=",
            icon: "equal",
            text: "equal",
          },
          {
            cond: "!=",
            icon: "not-equal-variant",
            text: "not equal",
          },
          {
            cond: ">",
            icon: "greater-than",
            text: "greater than",
          },
          {
            cond: "<",
            icon: "less-than",
            text: "less than",
          },
          {
            cond: ">=",
            icon: "greater-than-or-equal",
            text: "greater than or equal",
          },
          {
            cond: "<=",
            icon: "less-than-or-equal",
            text: "less than or equal",
          },
        ];
      else if (type == "string")
        return [
          {
            cond: "like",
            icon: "equal",
            text: "includes",
          },
          {
            cond: "not like",
            icon: "not-equal-variant",
            text: "excludes",
          },
          {
            cond: "is null",
            icon: "code-brackets",
            text: "empty",
          },
          {
            cond: "not null",
            icon: "dots-horizontal",
            text: "not empty",
          },
        ];
      else if (type == "array")
        return [
          {
            cond: "in",
            icon: "math-norm",
            text: "includes one of",
          },
          // TODO includes all and other conditions
          // {
          //   cond: "includes all",
          //   icon: "equal",
          //   text: "includes all",
          // },
          // {
          //   cond: "not in",
          //   icon: "not-equal-variant",
          //   text: "excludes",
          // },
          {
            cond: "is null",
            icon: "code-brackets",
            text: "empty",
          },
          {
            cond: "not null",
            icon: "code-brackets",
            text: "not empty",
          },
        ];
      else if (type == "boolean")
        return [
          {
            cond: "yes",
            icon: "check",
            text: "yes",
          },
          {
            cond: "no",
            icon: "close",
            text: "no",
          },
        ];
      else return [];
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
    filterBy(filter, queryText, itemText) {
      let text = filter.text.toLowerCase();
      let query = queryText.toLowerCase();
      return text.includes(query);
    },
    pickDate() {
      this.$emit("pickDate");
    },
    validate() {
      this.$refs.form.validate();
    },
    validVal(val) {
      const cond = this.filter.cond;
      if (val !== null) return true;
      if (cond !== "is null" && cond !== "is null") return true;
      else return "Value is required";
    },
  },
  watch: {
    async "filter.by"(val) {
      if (typeof val == "number") await this.getItems(val);
    },
    valid(val) {
      this.$emit("valid", val);
    },
  },
};
</script>