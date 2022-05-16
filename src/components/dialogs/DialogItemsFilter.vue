<template>
  <div>
    <v-dialog
      v-if="dialog"
      :value="dialog"
      @input="close"
      :fullscreen="$vuetify.breakpoint.xs"
      width="1200"
      scrollable
    >
      <v-card>
        <DialogHeader
          @close="close"
          :header="`Filter ${Items.name}`"
          :buttons="buttons"
          closable
        />

        <v-card-text class="text-center py-4 px-2 px-sm-4">
          <v-alert type="error" :value="!valid" text dismissible>
            Some filters are empty. Please complete or delete
          </v-alert>

          <FilterRow
            v-for="(f, i) in filters"
            :key="i + updKey"
            :filter="f"
            :index="i"
            :listBy="listBy"
            ref="filterRow"
            @setBy="setBy($event, i)"
            @setCond="setCond($event, i)"
            @setVal="setVal($event, i)"
            @setUnion="setUnion($event, i)"
            @remove="remove(i)"
            @duplicate="duplicate(i)"
            @pickDate="pickDate(i)"
            @valid="validate($event)"
          />
        </v-card-text>

        <div v-if="filters.length == 0" class="text-center pb-6 overline">
          <v-icon large class="mb-2">mdi-ghost-outline</v-icon>
          <div>No filters</div>
        </div>

        <v-card-actions class="mb-2">
          <v-spacer></v-spacer>
          <v-btn
            @click="add"
            class="ma-2 mt-0 pr-4"
            color="success"
            rounded
            depressed
          >
            <v-icon left>mdi-plus</v-icon> Add
          </v-btn>
          <v-btn
            v-if="filters.length"
            @click="removeAll"
            class="ma-2 mt-0 pr-4"
            color="error"
            depressed
            rounded
          >
            <v-icon left>mdi-close</v-icon> Remove all
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogSave" width="800" scrollable>
      <v-card>
        <DialogHeader
          @close="dialogSave = false"
          header="Saving filter"
          :buttons="[
            {
              icon: 'content-save',
              text: 'Save',
              color: 'success',
              outlined: false,
              function: () => {
                save();
              },
            },
          ]"
          closable
        />

        <v-card-text class="text-center py-4 px-2 px-sm-4">
          <v-form
            v-model="validName"
            ref="formSave"
            class="flex-grow-1"
            @submit.prevent
          >
            <v-text-field
              v-model="filterName"
              :rules="[nameRules]"
              label="Name of filter"
              autofocus
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <DialogItemsSavedFilters
      v-if="dialogLoad"
      :dialog="dialogLoad"
      @close="dialogLoad = false"
      @apply="loadSavedFilter($event)"
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
import Cols from "../../../app/configs/filter-cols.js";
import ComputedForItemsPage from "@/mixins/ComputedForItemsPage";
import DialogHeader from "@/components/elements/DialogHeader.vue";

export default {
  name: "DialogItemsFilter",
  props: {
    dialog: Boolean,
  },
  components: {
    DialogHeader,
    FilterRow: () => import("@/components/dialogs/filters/FilterRow.vue"),
    DialogItemsSavedFilters: () =>
      import("@/components/dialogs/DialogItemsSavedFilters.vue"),
  },
  mixins: [ComputedForItemsPage],
  mounted() {
    this.$root.$on("runSearch", (values) => {
      const { index, by, string } = values;
      if (index > -1) this.filters[index].val = string;
      else
        this.filters.push({
          id: null,
          by: by,
          type: "string",
          cond: "like",
          val: string,
          flag: null,
          lock: false,
          appbar: true,
          union: "AND",
          metaId: null,
        });
      this.apply();
    });
    this.$root.$on("toggleFavorite", (values) => {
      const { index, favorite } = values;
      if (!favorite && index > -1) this.remove(index);
      else
        this.filters.push({
          id: null,
          by: "favorite",
          type: "boolean",
          cond: "=",
          val: null,
          flag: null,
          lock: false,
          appbar: true,
          union: "AND",
          metaId: null,
        });
      this.apply();
    });
    this.$root.$on("removeFilter", (index) => {
      this.remove(index);
      this.apply();
    });
    this.$root.$on("removeAllFilters", () => {
      this.removeAll();
      this.apply();
    });
    this.initButtons();
    this.typeId = Vue.prototype.$getUrlParam("typeId");
    this.itemId = Vue.prototype.$getUrlParam("itemId");
    this.metaId = Vue.prototype.$getUrlParam("metaId");
    this.tabId = Vue.prototype.$getUrlParam("tabId");
  },
  beforeDestroy() {
    this.$root.$off("runSearch");
    this.$root.$off("toggleFavorite");
    this.$root.$off("removeFilter");
    this.$root.$off("removeAllFilters");
  },
  data: () => ({
    itemId: null,
    typeId: null,
    metaId: null,
    tabId: null,
    updKey: 0,
    filters: [],
    filtersForRemove: [],
    listBy: [],
    valid: true,
    datePicker: {
      dialog: false,
      index: -1,
      value: null,
    },
    cols: Cols,
    buttons: [],
    dialogSave: false,
    validName: false,
    filterName: "",
    dialogLoad: false,
    savedFilters: [],
  }),
  methods: {
    initButtons() {
      this.buttons.push(
        {
          icon: "content-save",
          text: "Save",
          outlined: true,
          function: () => {
            this.validateFilters();
            if (!this.valid) return;
            this.filterName = "";
            this.dialogSave = true;
          },
        },
        {
          icon: "content-save-move",
          text: "Load",
          outlined: true,
          function: () => {
            this.dialogLoad = true;
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
    async init() {
      this.listBy = [];

      this.listBy.push({ header: "Default" });
      let defaults = this.cols.standart;
      defaults.sort((a, b) => (a.text > b.text ? 1 : b.text > a.text ? -1 : 0));
      this.listBy = [...this.listBy, ...defaults];

      if (this.isMediaPage || this.isItemPage) {
        this.listBy.push({ header: "File" });

        let media = this.cols.media;
        media.sort((a, b) => (a.text > b.text ? 1 : b.text > a.text ? -1 : 0));
        this.listBy = [...this.listBy, ...media];

        if (Vue.prototype.$getUrlParam("typeId") == 1) {
          this.listBy.push({ header: "Video" });

          let video = this.cols.video;
          video.sort((a, b) =>
            a.text > b.text ? 1 : b.text > a.text ? -1 : 0
          );
          this.listBy = [...this.listBy, ...video];
        }
      } else if (this.isMetaPage) {
        this.listBy.push({ header: "Item" });
        let metaItem = this.cols.metaItem;
        metaItem.sort((a, b) =>
          a.text > b.text ? 1 : b.text > a.text ? -1 : 0
        );
        this.listBy = [...this.listBy, ...metaItem];
      }

      let assigned = this.$store.state.Items.assigned;

      assigned.sort((a, b) =>
        a.meta.name > b.meta.name ? 1 : b.meta.name > a.meta.name ? -1 : 0
      );

      if (assigned.length) this.listBy.push({ header: "Meta" });

      for (let i of assigned) {
        this.listBy.push({
          by: i.meta.id,
          type: i.meta.type,
          icon: i.meta.icon,
          text: i.meta.name,
        });
      }

      this.filters = _.cloneDeep(this.$store.state.Items.filters);
    },
    add() {
      this.filters.push({
        id: null,
        by: null,
        type: null,
        cond: null,
        val: null,
        flag: null,
        lock: false,
        appbar: false,
        union: "AND",
        metaId: null,
      });
    },
    setBy(value, index) {
      this.filters[index].by = value;
      let found = this.listBy.findIndex((i) => i.by == value);
      if (found > -1) this.filters[index].type = this.listBy[found].type;
      this.filters[index].cond = null;
      this.filters[index].val = null;
      if (typeof value == "number") this.filters[index].metaId = value;
    },
    setCond(value, index) {
      this.filters[index].cond = value;
    },
    setVal(value, index) {
      this.filters[index].val = value;
    },
    setUnion(value, index) {
      this.filters[index].union = value;
    },
    duplicate(index) {
      let filter = _.cloneDeep(this.filters[index]);
      filter.id = null;
      this.filters.push(filter);
    },
    remove(index) {
      const filter = _.cloneDeep(this.filters[index]);
      this.filtersForRemove.push(filter);
      this.filters.splice(index, 1);
    },
    removeAll() {
      this.filtersForRemove = this.filters.filter((i) => i.lock !== true);
      this.filters = this.filters.filter((i) => i.lock == true);
    },
    validateFilters() {
      if (!this.dialog || this.filters.length == 0) {
        this.valid = true;
        return;
      }
      for (let i of this.$refs.filterRow) {
        i.validate();
      }
    },
    async apply() {
      this.validateFilters();
      if (!this.valid) return;

      let savedFilter = this.$store.state.Items.savedFilter;
      await this.addFilterRows(savedFilter.id);

      for (let f of this.filtersForRemove) {
        await axios.delete(this.apiUrl + "/api/FilterRow/" + f.id);
      }
      this.filtersForRemove = [];
      this.$store.commit("updateStateItems", {
        key: "filters",
        value: _.cloneDeep(this.filters),
      });
      this.$emit("close");
      this.$root.$emit("setItemsFilters");
    },
    async addFilterRows(filterId, isSavedFilter) {
      for (let f of this.filters) {
        if (isSavedFilter) f.id = null;
        await axios({
          method: "post",
          url: this.apiUrl + "/api/FilterRow",
          data: {
            filter: f,
            filterId: filterId,
            rowId: isSavedFilter ? null : f.id,
          },
        });
      }
    },
    async save() {
      this.$refs.formSave.validate();
      if (!this.validName) return;

      let savedFilter = {};

      await axios({
        method: "post",
        url: this.apiUrl + "/api/SavedFilter",
        data: {
          name: this.filterName,
          itemId: this.itemId,
          typeId: this.typeId,
          metaId: this.metaId,
          tabId: this.tabId,
        },
      })
        .then((res) => {
          savedFilter = res.data[0];
        })
        .catch((e) => {
          console.log(e);
        });

      if (!_.isEmpty(savedFilter)) {
        await this.addFilterRows(savedFilter.id, true);
      }

      this.dialogSave = false;
    },
    loadSavedFilter(filters) {
      this.dialogLoad = false;
      this.filtersForRemove = _.cloneDeep(this.filters);
      ++this.updKey;
      this.filters = _.cloneDeep(filters);
    },
    close() {
      this.$emit("close");
    },
    pickDate(index) {
      this.datePicker.dialog = true;
      this.datePicker.value = this.filters[index].val;
      this.datePicker.index = index;
    },
    setDate(date) {
      this.datePicker.dialog = false;
      this.filters[this.datePicker.index].val = date;
    },
    validate(val) {
      this.valid = val;
    },
    nameRules(string) {
      return Vue.prototype.$validateName(string);
    },
  },
  watch: {
    dialog() {
      this.init();
    },
    "Items.filters"(val) {
      this.filters = _.cloneDeep(val);
    },
  },
};
</script>