<template>
  <div>
    <v-dialog
      v-if="dialog"
      :value="dialog"
      @input="close"
      scrollable
      width="1200"
    >
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <div class="headline mx-4">Filter {{ page.name }}</div>
          <div
            class="
              d-flex
              flex-sm-row flex-column-reverse
              justify-end
              ma-sm-4 ma-2
            "
          >
            <v-btn @click="dialogSavedFilters = true" outlined>
              <v-icon left>mdi-content-save</v-icon> Save / load
            </v-btn>
            <v-spacer class="ma-sm-2 ma-1"></v-spacer>
            <v-btn @click="apply" color="success" depressed>
              <v-icon left>mdi-check</v-icon> Apply
            </v-btn>
          </div>
        </div>

        <v-divider></v-divider>

        <vuescroll>
          <v-card-text class="text-center px-2 px-sm-4">
            <FilterRow
              v-for="(f, i) in filters"
              :key="i"
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
        </vuescroll>

        <div v-if="filters.length == 0" class="text-center pb-6 overline">
          <v-icon large class="mb-2">mdi-ghost-outline</v-icon>
          <div>No filters</div>
        </div>

        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            @click="add"
            class="ma-2 mt-0 pr-4"
            color="success"
            rounded
            depressed
            small
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
            small
          >
            <v-icon left>mdi-close</v-icon> Remove all
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import vuescroll from "vuescroll";
import Cols from "../../../filter-cols";

export default {
  props: {
    dialog: Boolean,
  },
  components: {
    vuescroll,
    FilterRow: () => import("@/components/dialogs/filters/FilterRow.vue"),
  },
  mounted() {
    this.$nextTick(async () => {
      await this.init();
    });
  },
  data: () => ({
    filters: [],
    listBy: [],
    valid: true,
    datePicker: {
      dialog: false,
      index: -1,
      value: null,
    },
    cols: Cols,
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    page() {
      return this.$store.state.page;
    },
    isMetaPage() {
      return Vue.prototype.$checkCurrentPage("meta");
    },
    isMediaPage() {
      return Vue.prototype.$checkCurrentPage("media");
    },
    typeId() {
      return +this.$router.history.current.query.typeId;
    },
    metaId() {
      return +this.$router.history.current.query.metaId;
    },
  },
  methods: {
    async init() {
      let assigned = [];
      this.listBy = [...this.listBy, ...this.cols.standart];

      if (this.isMediaPage) {
        this.listBy = [...this.listBy, ...this.cols.media];
        if (this.typeId == 1) {
          this.listBy = [...this.listBy, ...this.cols.video];

          await axios
            .get(this.apiUrl + "/api/MetaInMediaType")
            .then((res) => {
              assigned = res.data.assigned;
              assigned = assigned.filter((i) => i.id == this.typeId);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      } else if (this.isMetaPage) {
        this.listBy = [...this.listBy, ...this.cols.metaItem];

        await axios
          .get(this.apiUrl + "/api/ChildMeta?metaId=" + this.metaId)
          .then((res) => {
            assigned = res.data;
          })
          .catch((e) => {
            console.log(e);
          });
      }

      for (let i of assigned) {
        this.listBy.push({
          by: i["meta.id"],
          type: i["meta.type"],
          icon: i["meta.icon"],
          text: i["meta.name"],
        });
      }

      this.listBy.sort((a, b) =>
        a.text > b.text ? 1 : b.text > a.text ? -1 : 0
      );

      this.filters = this.$store.state.filters;
    },
    add() {
      this.filters.push({
        by: null,
        type: null,
        cond: null,
        val: null,
        flag: null,
        lock: false,
        union: "AND",
      });
    },
    setBy(value, index) {
      this.filters[index].by = value;
      let found = this.listBy.findIndex((i) => i.by == value);
      if (found > -1) this.filters[index].type = this.listBy[found].type;
      this.filters[index].cond = null;
      this.filters[index].val = null;
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
      const filter = _.cloneDeep(this.filters[index]);
      this.filters.push(filter);
    },
    remove(index) {
      this.filters.splice(index, 1);
    },
    removeAll() {
      this.filters = [];
    },
    async apply() {
      if (this.filters.length) {
        for (let i of this.$refs.filterRow) {
          i.validate();
        }
      }
      if (!this.valid) return;
      this.addFilterRows();
      this.$store.state.filters = _.cloneDeep(this.filters);
      this.$emit("close");
    },
    async addSavedFilter() {
      for (let f of this.filters) {
        await axios({
          method: "post",
          url: this.apiUrl + "/api/FilterRow",
          data: {
            id: f.id,
            filter: f,
          },
        })
          .then((res) => {
            console.log(res.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    async addFilterRows() {
      for (let f of this.filters) {
        await axios({
          method: "post",
          url: this.apiUrl + "/api/FilterRow",
          data: {
            id: f.id,
            filter: f,
          },
        })
          .then((res) => {
            console.log(res.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
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
  },
};
</script>