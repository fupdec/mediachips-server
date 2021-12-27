<template>
  <v-card flat max-width="800" style="margin: auto" class="my-6 px-4">
    <div class="headline text-center">List of meta</div>

    <v-data-iterator
      :items="meta"
      :search="search"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      :items-per-page="-1"
      hide-default-footer
      no-data-text="Please add meta first"
      no-results-text="No meta found"
    >
      <template v-slot:header>
        <div class="d-flex flex-column align-start my-4">
          <v-btn
            @click="addMeta"
            color="success"
            class="mb-6"
            rounded
            depressed
            height="40"
          >
            <v-icon left>mdi-plus</v-icon>
            Add meta
          </v-btn>

          <div v-if="meta.length" class="d-flex just align-start flex-wrap">
            <v-text-field
              v-model="search"
              dense
              clearable
              rounded
              outlined
              prepend-inner-icon="mdi-magnify"
              label="Search"
              hint="by name, type, hint, icon, date"
              style="max-width: 250px"
            ></v-text-field>

            <v-spacer class="mx-2" />

            <v-select
              v-model="sortBy"
              dense
              rounded
              outlined
              label="Sort by"
              prepend-inner-icon="mdi-sort"
              append-icon="mdi-chevron-down"
              :items="['name', 'type', 'createdAt', 'updatedAt']"
              style="max-width: 200px"
              menu-props="offset-y"
            ></v-select>

            <v-spacer class="mx-2" />

            <v-btn-toggle
              v-model="sortDesc"
              dense
              mandatory
              rounded
              color="primary"
            >
              <v-btn outlined height="40" :value="false">
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn outlined height="40" :value="true">
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>
      </template>

      <template v-slot:default="props">
        <v-chip-group active-class="primary--text" column>
          <v-chip
            v-for="item in props.items"
            :key="item.id"
            outlined
            @click="open(item)"
            style="margin: 6px"
          >
            <v-icon size="20" left>mdi-{{ item.icon }}</v-icon>
            {{ item.name }}
            <v-icon right small>{{ getIcon(item.type) }}</v-icon>
          </v-chip>
        </v-chip-group>
      </template>
    </v-data-iterator>

    <DialogMetaAdd
      v-if="dialogAdd"
      :dialog="dialogAdd"
      @added="finishAdding($event)"
      @close="dialogAdd = false"
    />

    <DialogMetaEdit
      v-if="dialogEdit"
      :dialog="dialogEdit"
      :meta="selectedMeta"
      @close="dialogEdit = false"
      @update="updateMeta($event)"
      @delete="deleteMeta($event)"
    />
  </v-card>
</template>


<script>
import Vue from "vue";
import axios from "axios";

export default {
  name: "MetaList",
  components: {
    DialogMetaAdd: () => import("@/components/dialogs/DialogMetaAdd.vue"),
    DialogMetaEdit: () => import("@/components/dialogs/DialogMetaEdit.vue"),
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getMeta();
    });
  },
  data: () => ({
    meta: [],
    search: "",
    sortBy: "name",
    sortDesc: false,
    dialogAdd: false,
    dialogEdit: false,
    selectedMeta: null,
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
  },
  methods: {
    async getMeta() {
      await axios
        .get(this.apiUrl + "/api/Meta")
        .then((res) => {
          this.meta = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getIcon(type) {
      return Vue.prototype.$getIconDataType(type);
    },
    addMeta() {
      this.dialogAdd = true;
    },
    open(meta) {
      this.selectedMeta = meta;
      this.dialogEdit = true;
    },
    finishAdding(type) {
      this.dialogAdd = false;
      if (["array", "rating"].includes(type)) {
        axios
          .get(this.apiUrl + "/api/Meta/latest")
          .then((res) => {
            this.open(res.data[0]);
          })
          .catch((e) => {
            console.log(e);
          });
      }
      this.getMeta();
      if (this.type == "array") this.$root.$emit("updateNavbar");
    },
    updateMeta(type) {
      this.getMeta();
      if (type == "array") this.$root.$emit("updateNavbar");
    },
    deleteMeta(meta) {
      this.dialogEdit = false;
      axios
        .delete(this.apiUrl + "/api/Meta/" + meta.id)
        .then(() => {
          if (meta.type == "array") this.$root.$emit("updateNavbar");
          this.getMeta();
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>