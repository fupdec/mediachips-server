<template>
  <div>
    <v-dialog
      v-if="dialog"
      :value="dialog"
      @input="close"
      scrollable
      width="1000"
    >
      <v-card>
        <div class="d-flex pa-4">
          <div class="headline">Filter {{page.name}}</div>
          <v-spacer class="mx-2"></v-spacer>
          <v-btn
            @click="dialogSavedFilters = true"
            class="mx-4"
            outlined
          >
            <v-icon left>mdi-content-save</v-icon> Save / load filters
          </v-btn>
          <v-btn @click="apply" color="success" depressed>
            <v-icon left>mdi-plus</v-icon> Add
          </v-btn>
        </div>

        <v-divider></v-divider>

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
  },
  mounted() {
    this.$nextTick(function () {});
  },
  data: () => ({}),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    page() {
      return this.$store.state.page;
    },
  },
  methods: {
    apply() {
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>