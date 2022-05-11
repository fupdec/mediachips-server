<template>
  <div>
    <v-dialog
      v-if="dialog"
      :value="dialog"
      @input="close"
      :fullscreen="$vuetify.breakpoint.xs"
      width="800"
      scrollable
    >
      <v-card>
        <DialogHeader @close="close" header="Saved filters" closable />

        <v-card-text class="pa-4 pb-0">
          <div v-if="savedFilters.length > 0">
            <v-card
              v-for="(i, x) in savedFilters"
              :key="x"
              class="mb-4"
              outlined
            >
              <div class="py-2 px-4 d-flex align-center">
                <div class="mr-2 body-1">{{ i.name }}</div>
                <v-btn @click="edit(i)" small icon>
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </div>

              <div class="d-flex px-2">
                <FiltersChips :filters="i.filters" :isTooltip="true" />
              </div>

              <v-card-actions>
                <v-btn
                  @click="load(i)"
                  color="success"
                  class="pr-4"
                  rounded
                  small
                  text
                >
                  <v-icon left>mdi-check</v-icon> Apply
                </v-btn>
                <v-btn @click="rewrite(i)" class="pr-4" rounded small text>
                  <v-icon left>mdi-content-save</v-icon> Rewrite
                </v-btn>
                <v-btn
                  @click="openDialogDelete(i)"
                  color="error"
                  class="pr-4"
                  rounded
                  small
                  text
                >
                  <v-icon left>mdi-delete</v-icon> Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>

          <div v-else class="text-center py-2">
            <v-icon class="mb-2">mdi-ghost-outline</v-icon>
            <div class="caption">No saved filters</div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <DialogDeleteConfirm
      v-if="dialogDel"
      @close="dialogDel = false"
      @delete="deleteSavedFilter"
      :dialog="dialogDel"
      text="Delete saved filter?"
    />
  </div>
</template>


<script>
import Vue from "vue";
import axios from "axios";
import ComputedForItemsPage from "@/mixins/ComputedForItemsPage";
import DialogHeader from "@/components/elements/DialogHeader.vue";

export default {
  name: "DialogItemsSavedFilters",
  props: {
    dialog: Boolean,
  },
  components: {
    DialogHeader,
    DialogDeleteConfirm: () =>
      import("@/components/dialogs/DialogDeleteConfirm.vue"),
    FiltersChips: () => import("@/components/elements/FiltersChips.vue"),
  },
  mixins: [ComputedForItemsPage],
  mounted() {
    this.typeId = Vue.prototype.$getUrlParam("typeId");
    this.itemId = Vue.prototype.$getUrlParam("itemId");
    this.metaId = Vue.prototype.$getUrlParam("metaId");
    this.tabId = Vue.prototype.$getUrlParam("tabId");
    this.init();
  },
  data: () => ({
    itemId: null,
    typeId: null,
    metaId: null,
    tabId: null,
    savedFilters: [],
    dialogDel: false,
    selected: null,
  }),
  methods: {
    async init() {
      await axios({
        method: "post",
        url: this.apiUrl + "/api/SavedFilter/findAll",
        data: {
          itemId: this.itemId,
          typeId: this.typeId,
          metaId: this.metaId,
          tabId: this.tabId,
        },
      })
        .then((res) => {
          console.log(res.data);
          this.savedFilters = res.data;
        })
        .catch((e) => {
          console.log(e);
        });

      for (let i of this.savedFilters) {
        let filters = await Vue.prototype.$getFilters(i.id);
        Vue.set(i, "filters", filters);
      }
    },
    openDialogDelete(savedFilter) {
      this.selected = savedFilter;
      this.dialogDel = true;
    },
    async deleteSavedFilter() {
      const savedFilter = this.selected;
      console.log(savedFilter);
      await axios.delete(this.apiUrl + "/api/SavedFilter/" + savedFilter.id);
      const filterRows = savedFilter.filters;
      for (let i of filterRows) {
        await axios.delete(this.apiUrl + "/api/FilterRow/" + i.id);
      }
      await this.init();
      this.dialogDel = false;
    },
    close() {
      this.$emit("close");
    },
    edit(savedFilter) {},
    rewrite(savedFilter) {},
    load(savedFilter) {
      this.$store.commit("updateStateItems", {
        key: "filters",
        value: savedFilter.filters,
      });
    },
  },
};
</script>