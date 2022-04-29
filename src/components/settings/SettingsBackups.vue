<template>
  <div class="mx-4">
    <v-divider class="mt-4 mb-2" />
    <div class="subtitle-2 text-right mb-4">Backups</div>

    <v-btn @click="manageBackups" color="primary" depressed rounded>
      <v-icon left>mdi-database</v-icon> Manage backups
    </v-btn>

    <v-dialog
      v-if="dialog"
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="800"
      scrollable
      persistent
    >
      <v-card>
        <DialogHeader
          @close="dialog = false"
          header="Backups management"
          closable
        />

        <v-card-actions class="mt-2 mt-sm-4 flex-wrap">
          <v-btn
            @click="createBackup"
            color="success"
            class="pr-4 ma-2"
            rounded
            depressed
          >
            <v-icon left>mdi-database-plus</v-icon> Create
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            @click="dialogRestoreConfirm = true"
            :disabled="!isSelectedSingle"
            color="warning"
            class="pr-4 ma-2"
            rounded
            depressed
          >
            <v-icon left>mdi-database-refresh</v-icon> Restore
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            @click="dialogDelete = true"
            :disabled="notSelected"
            color="error"
            class="pr-4 ma-2"
            rounded
            depressed
          >
            <v-icon left>mdi-database-remove</v-icon> Delete
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            @click="importBackup"
            color="info"
            class="pr-4 ma-2"
            rounded
            depressed
          >
            <v-icon left>mdi-database-import</v-icon> Import
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            @click="exportBackup"
            :disabled="!isSelectedSingle"
            color="info"
            class="pr-4 ma-2"
            rounded
            depressed
          >
            <v-icon left>mdi-database-export</v-icon> Export
          </v-btn>
        </v-card-actions>

        <v-card-text class="pa-sm-4 pa-2">
          <v-card outlined>
            <v-data-table
              v-model="selected"
              :loading="!isLoaded"
              :headers="headers"
              :items="backups"
              no-data-text="No backups have been created"
              item-key="date"
              show-select
            />
          </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>

    <DialogConfirm
      v-if="dialogRestoreConfirm"
      @close="dialogRestoreConfirm = false"
      @confirm="restoreBackup"
      :dialog="dialogRestoreConfirm"
      :text="`Restoring will change the current state of the database.\r Are you sure?`"
    />

    <DialogDeleteConfirm
      v-if="dialogDelete"
      @close="dialogDelete = false"
      @delete="deleteBackups"
      :dialog="dialogDelete"
      :text="`The selected backups will be deleted.\r Are you sure?`"
    />
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "SettingsBackups",
  components: {
    DialogHeader: () => import("@/components/elements/DialogHeader.vue"),
    DialogConfirm: () => import("@/components/dialogs/DialogConfirm.vue"),
    DialogDeleteConfirm: () =>
      import("@/components/dialogs/DialogDeleteConfirm.vue"),
  },
  data: () => ({
    isLoaded: false,
    dialog: false,
    backups: [],
    selected: [],
    headers: [
      { text: "Date, time", value: "date" },
      { text: "Total size (MB)", value: "size", sort: (a, b) => a - b },
    ],
    dialogRestoreConfirm: false,
    dialogDelete: false,
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    dbPath() {
      return this.$store.state.dbPath;
    },
    notSelected() {
      return this.selected.length == 0;
    },
    isSelectedSingle() {
      return this.selected.length == 1;
    },
    dialogProcess: {
      get() {
        return this.$store.state.Dialogs.process.show;
      },
      set(value) {
        this.$store.state.Dialogs.process.show = value;
      },
    },
  },
  methods: {
    manageBackups() {
      this.dialog = true;
      setTimeout(() => {
        this.getBackups();
      }, 500);
    },
    async getBackups() {
      this.isLoaded = false;
      await axios
        .get(this.apiUrl + "/api/Task/getBackups")
        .then((res) => {
          this.isLoaded = true;
          this.backups = res.data;
        })
        .catch((e) => {
          this.backups = [];
          console.log(e);
        });
      this.selected = [];
    },
    async createBackup() {
      this.dialogProcess = true;

      await axios
        .get(this.apiUrl + "/api/task/createBackup")
        .then(() => {
          this.getBackups();
        })
        .catch((e) => {
          console.log(e);
        });

      this.dialogProcess = false;
      this.selected = [];
    },
    async deleteBackups() {
      this.dialogDelete = false;
      this.dialogProcess = true;

      for (let i of this.selected) {
        await axios({
          method: "post",
          url: this.apiUrl + "/api/task/deleteBackup",
          data: {
            name: i.date,
          },
        });
      }

      this.dialogProcess = false;
      this.selected = [];
      this.getBackups();
    },
    restoreBackup() {
      this.dialogRestoreConfirm = false;
      this.selected = [];
    },
    importBackup() {},
    exportBackup() {},
  },
};
</script>