<template>
  <v-navigation-drawer
    v-model="$store.state.filters.visible"
    :app="$store.state.filters.attached"
    :class="[
      { 'ml-14': sets.bottomBar == '0' },
      { 'pb-12': sets.bottomBar == '0' },
      { 'padding-bottom': sets.bottomBar == '1' },
      { deattached: !$store.state.filters.attached },
    ]"
    class="mt-12 filters-drawer"
    width="350"
    fixed
  >
    <v-subheader class="d-flex justify-space-between">
      <div class="d-flex align-center">
        <v-icon left small color="grey">mdi-filter</v-icon> Filters
      </div>
      <v-btn @click="attach" icon>
        <v-icon v-if="$store.state.filters.attached" small>mdi-pin</v-icon>
        <v-icon v-else small>mdi-pin-outline</v-icon>
      </v-btn>
    </v-subheader>

    <div class="px-2">
      <v-btn
        @click="apply"
        :disabled="!isReady"
        color="success"
        class="mb-2"
        block
        depressed
        rounded
      >
        <v-icon left>mdi-check</v-icon> Apply
      </v-btn>
      <v-btn
        @click="dialogSave = true"
        :disabled="!isReady"
        class="mb-2"
        block
        depressed
        rounded
      >
        <v-icon left>mdi-content-save</v-icon> Save
      </v-btn>
      <v-btn
        @click="dialogLoad = true"
        :disabled="!isReady"
        class="mb-2"
        block
        depressed
        rounded
      >
        <v-icon left>mdi-content-save-move</v-icon> Load
      </v-btn>
      <v-btn
        @click="dialogAdd = true"
        :disabled="!isReady"
        class="mb-2 green--text"
        block
        depressed
        rounded
      >
        <v-icon left>mdi-plus</v-icon> Add
      </v-btn>
      <v-btn
        v-if="filters.length > 1"
        :disabled="!isReady"
        class="mb-2 red--text"
        block
        depressed
        rounded
      >
        <v-icon left>mdi-close</v-icon> Remove all
      </v-btn>

      <v-spacer class="my-4"></v-spacer>

      <div v-if="isReady">
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
          @pickDate="pickDate(i)"
          @valid="validate($event)"
        />
      </div>

      <div v-if="filters.length == 0" class="text-center py-6 overline">
        <v-icon large class="mb-2">mdi-filter-off-outline</v-icon>
        <div>No filters</div>
      </div>
    </div>

    <v-dialog v-model="dialogSave" width="600" scrollable>
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

    <DialogFiltersSaved
      v-if="dialogLoad"
      :dialog="dialogLoad"
      @close="dialogLoad = false"
      @apply="loadSavedFilter($event)"
    />

    <DialogFiltersAdd
      v-if="dialogAdd"
      @add="add($event)"
      @close="dialogAdd = false"
      :dialog="dialogAdd"
      :params="listBy"
    />

    <v-dialog v-model="datePicker.dialog" width="auto">
      <v-date-picker
        @change="setDate($event)"
        :value="datePicker.value"
        color="primary"
        no-title
      />
    </v-dialog>
  </v-navigation-drawer>
</template>


<script>
import Vue from "vue";
import axios from "axios";
import Cols from "../../../app/configs/filter-cols.js";
import ComputedForItemsPage from "@/mixins/ComputedForItemsPage";
import DialogHeader from "@/components/elements/DialogHeader.vue";

/**
 обозначения ключей для объекта "фильтр": 
 id - уникальный номер взятый из таблицы БД,
 param - параметр, по которому будет производиться фильтрация,
 type - тип данных для фильтрации,
 cond - условие,
 val - значение,
 note - дополнительная информация,
 favorite - избранное, отображение на панели инструментов,
 active - состояние фильтра,
 lock - блокировка от удаления пользователем,
 */

export default {
  name: "Filters",
  props: {
    isReady: Boolean,
  },
  components: {
    DialogHeader,
    FilterRow: () => import("@/components/app/FilterRow.vue"),
    DialogFiltersSaved: () =>
      import("@/components/dialogs/filters/DialogFiltersSaved.vue"),
    DialogFiltersAdd: () =>
      import("@/components/dialogs/filters/DialogFiltersAdd.vue"),
  },
  mixins: [ComputedForItemsPage],
  async mounted() {
    this.typeId = Vue.prototype.$getUrlParam("typeId");
    this.itemId = Vue.prototype.$getUrlParam("itemId");
    this.metaId = Vue.prototype.$getUrlParam("metaId");
    this.tabId = Vue.prototype.$getUrlParam("tabId");
    this.$root.$on("removeFilter", (index) => {
      this.remove(index);
      this.apply();
    });
    this.$root.$on("removeAllFilters", () => {
      this.removeAll();
      this.apply();
    });
  },
  beforeDestroy() {
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
    dialogAdd: false,
    savedFilters: [],
  }),
  computed: {
    sets() {
      return this.$store.state.settings;
    },
    Items() {
      return this.$store.state.Items;
    },
  },
  methods: {
    init() {
      let listBy = [];

      let defaults = this.cols.standart;
      defaults.forEach((i) => {
        i.group = "Default";
      });
      defaults.sort((a, b) => (a.text > b.text ? 1 : b.text > a.text ? -1 : 0));
      listBy = [...listBy, ...defaults];

      if (this.isMediaPage || this.isItemPage) {
        let media = this.cols.media;
        media.forEach((i) => {
          i.group = "File";
        });
        media.sort((a, b) => (a.text > b.text ? 1 : b.text > a.text ? -1 : 0));
        listBy = [...listBy, ...media];

        if (Vue.prototype.$getUrlParam("typeId") == 1) {
          let video = this.cols.video;
          video.forEach((i) => {
            i.group = "Video";
          });
          video.sort((a, b) =>
            a.text > b.text ? 1 : b.text > a.text ? -1 : 0
          );
          listBy = [...listBy, ...video];
        }
      } else if (this.isMetaPage) {
        let metaItem = this.cols.metaItem;
        metaItem.forEach((i) => {
          i.group = "Item";
        });
        metaItem.sort((a, b) =>
          a.text > b.text ? 1 : b.text > a.text ? -1 : 0
        );
        listBy = [...listBy, ...metaItem];
      }

      let assigned = this.$store.state.Items.assigned;
      assigned.sort((a, b) =>
        a.meta.name > b.meta.name ? 1 : b.meta.name > a.meta.name ? -1 : 0
      );
      for (let i of assigned) {
        listBy.push({
          param: i.meta.id,
          type: i.meta.type,
          icon: i.meta.icon,
          text: i.meta.name,
          group: "Meta",
        });
      }

      this.listBy = listBy;
      this.filters = _.cloneDeep(this.$store.state.Items.filters);
    },
    add(params) {
      this.dialogAdd = false;
      for (let i of params) {
        console.log(i);
        let cond = Vue.prototype.$getListCond(i.type);
        if (cond) cond = cond[0].cond;
        let fltr = Vue.prototype.$getFilterObject({
          param: i.param,
          type: i.type,
          cond: cond,
        });
        this.filters.push(fltr);
      }
    },
    setBy(value, index) {
      this.filters[index].param = value;
      let found = this.listBy.findIndex((i) => i.param == value);
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
    remove(index) {
      const filter = _.cloneDeep(this.filters[index]);
      this.filtersForRemove.push(filter);
      this.filters.splice(index, 1);
      ++this.updKey;
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
    attach() {
      this.$store.state.filters.attached = !this.$store.state.filters.attached;
    },
  },
  watch: {
    "Items.filters"(val) {
      this.filters = _.cloneDeep(val);
      ++this.updKey;
    },
    isReady(val) {
      if (val) this.init();
    },
  },
};
</script>


<style lang="scss" scoped>
.filters-drawer {
  z-index: 3;
  &.padding-bottom {
    padding-bottom: 104px;
  }
  &.deattached {
    opacity: 0.95;
  }
}
</style>