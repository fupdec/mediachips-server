<template>
  <v-card outlined>
    <v-alert color="info" text dismissible border="left" class="body-2 mb-2">
      Changes are applied immediately and are irreversible
    </v-alert>

    <v-btn
      @click="openDialogAdd"
      color="success"
      rounded
      depressed
      class="ma-2"
    >
      <v-icon left>mdi-plus</v-icon> Add
    </v-btn>

    <v-btn
      @click="dialogRemove = true"
      :disabled="selectedForRemove.length == 0"
      color="error"
      rounded
      depressed
    >
      <v-icon left>mdi-close</v-icon> Remove
    </v-btn>

    <v-chip-group
      v-if="childMeta.length"
      v-model="selectedForRemove"
      active-class="primary--text"
      multiple
      column
    >
      <v-chip v-for="m in childMeta" :key="m.id" outlined style="margin: 6px">
        <v-icon size="20" left>mdi-{{ m.meta.icon }}</v-icon>
        {{ m.meta.name }}
        <v-icon right small>{{ getIcon(m.meta.type) }}</v-icon>
      </v-chip>
    </v-chip-group>

    <div v-else class="text-center my-4">
      <v-icon large class="mb-2">mdi-ghost-outline</v-icon>
      <div>No child meta</div>
    </div>

    <v-dialog v-if="dialogAdd" v-model="dialogAdd" scrollable width="580">
      <v-card>
        <DialogHeader
          @close="dialogAdd = false"
          :header="`Adding child meta`"
          :buttons="buttons"
          closable
        />

        <v-card-text class="mt-4">
          <v-data-iterator
            :items="metaForAdd"
            :search="search"
            :items-per-page="-1"
            hide-default-footer
            no-data-text="No meta available"
            no-results-text="No meta found"
          >
            <template v-slot:header>
              <v-text-field
                v-if="metaForAdd.length"
                v-model="search"
                dense
                clearable
                rounded
                outlined
                class="mt-2"
                prepend-inner-icon="mdi-magnify"
                label="Search"
                hint="by name, type, hint, icon, date"
                style="max-width: 350px"
              ></v-text-field>
            </template>

            <template v-slot:default="props">
              <v-chip-group
                v-model="selectedForAdd"
                active-class="primary--text"
                multiple
                column
              >
                <v-chip
                  v-for="item in props.items"
                  :key="item.id"
                  outlined
                  style="margin: 6px"
                >
                  <v-icon size="20" left>mdi-{{ item.icon }}</v-icon>
                  {{ item.name }}
                  <v-icon right small>{{ getIcon(item.type) }}</v-icon>
                </v-chip>
              </v-chip-group>
            </template>
          </v-data-iterator>
        </v-card-text>
      </v-card>
    </v-dialog>

    <DialogDeleteConfirm
      v-if="dialogRemove"
      @close="dialogRemove = false"
      @delete="removeMeta"
      :dialog="dialogRemove"
      :text="textForRemove"
    />
  </v-card>
</template>


<script>
import Vue from "vue";
import axios from "axios";
import DialogHeader from "@/components/elements/DialogHeader.vue";

export default {
  name: "MetaSettingsChildMeta",
  props: {
    meta: Object,
  },
  components: {
    DialogHeader,
    DialogDeleteConfirm: () =>
      import("@/components/dialogs/DialogDeleteConfirm.vue"),
  },
  mounted() {
    this.initButtons();
    this.getChildMeta();
  },
  data: () => ({
    childMeta: [],
    metaForAdd: [],
    selectedForAdd: [],
    selectedForRemove: [],
    dialogAdd: false,
    dialogRemove: false,
    search: "",
    buttons: [],
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    textForRemove() {
      return "The meta will be removed from all items.\n Are you sure?";
    },
  },
  methods: {
    initButtons() {
      this.buttons.push({
        icon: "check",
        text: "Apply",
        color: "success",
        outlined: false,
        function: () => {
          this.addMeta();
        },
      });
    },
    async getChildMeta() {
      await axios
        .get(this.apiUrl + "/api/ChildMeta?metaId=" + this.meta.id)
        .then((res) => {
          this.childMeta = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getIcon(type) {
      return Vue.prototype.$getIconDataType(type);
    },
    openDialogAdd() {
      this.dialogAdd = true;
      axios
        .get(this.apiUrl + "/api/Meta")
        .then((res) => {
          const metaAll = res.data;
          let childMetaIds = this.childMeta.map((i) => i.childMetaId);
          let metaFree = metaAll.filter((i) => !childMetaIds.includes(i.id));
          this.metaForAdd = metaFree.filter((i) => i.id != this.meta.id);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async addMeta() {
      for (let index of this.selectedForAdd) {
        const meta = this.metaForAdd[index];
        await axios({
          method: "post",
          url: this.apiUrl + "/api/ChildMeta",
          data: {
            metaId: this.meta.id,
            childMetaId: meta.id,
          },
        });
      }
      this.dialogAdd = false;
      this.selectedForAdd = [];
      this.getChildMeta();
    },
    async removeMeta() {
      for (let index of this.selectedForRemove) {
        const meta = this.childMeta[index];
        await axios.delete(
          this.apiUrl +
            "/api/ChildMeta/" +
            meta.childMetaId +
            `?metaId=${this.meta.id}`
        );
      }

      this.getChildMeta();
      this.selectedForRemove = [];
      this.dialogRemove = false;
    },
  },
  watch: {},
};
</script>