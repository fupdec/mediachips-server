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
        <div class="d-flex justify-space-between">
          <div class="headline ma-4">Filter {{ page.name }}</div>
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
          <v-card-text class="text-center">
            <FilterRow
              v-for="(f, i) in filters"
              :key="i"
              :filter="f"
              @remove="remove(i)"
              @duplicate="duplicate(i)"
            />
          </v-card-text>
        </vuescroll>

        <div v-if="filters.length == 0" class="text-center py-6 overline">
          <v-icon large class="mb-2">mdi-ghost-outline</v-icon>
          <div>No filters</div>
        </div>

        <v-card-actions class="pt-0">
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
  </div>
</template>


<script>
import Vue from "vue";
import axios from "axios";
import vuescroll from "vuescroll";

export default {
  props: {
    dialog: Boolean,
  },
  name: "DialogItemsFilter",
  components: {
    vuescroll,
    FilterRow: () => import("@/components/dialogs/filters/FilterRow.vue"),
  },
  mounted() {
    this.$nextTick(function () {});
  },
  data: () => ({
    filters: [],
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    page() {
      return this.$store.state.page;
    },
  },
  methods: {
    add() {
      this.filters.push({
        by: null,
        type: null,
        cond: null,
        val: null,
        flag: null,
        lock: false,
      });
    },
    duplicate(index) {
      this.filters.push(this.filters[index]);
    },
    remove(index) {
      this.filters.splice(index, 1);
    },
    removeAll() {},
    apply() {},
    close() {
      this.$emit("close");
    },
  },
};
</script>