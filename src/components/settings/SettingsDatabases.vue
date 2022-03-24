<template>
  <div class="mx-4">
    <v-btn @click="add" color="success" class="pr-4 mb-2" rounded depressed>
      <v-icon left>mdi-plus</v-icon> Add Database
    </v-btn>

    <v-list dense rounded class="px-0">
      <v-list-item
        v-for="i in databases"
        :key="i.id"
        @click="openDialogConfirm(i)"
        :class="[{ active: i.active }]"
        class="list-item-rounded"
      >
        <v-list-item-avatar v-if="i.active" color="success">
          <v-icon v-text="`mdi-cogs`" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="i.name" />
          <v-list-item-subtitle>
            Created {{ getDate(i.createdAt) }}
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn-toggle dense rounded>
            <v-btn @click.stop="edit(i)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn v-if="!i.active" @click.stop="confirmRemoving(i)">
              <v-icon color="error">mdi-close</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-dialog v-model="dialogDb" width="600" scrollable>
      <v-card>
        <DialogHeader
          @close="dialogDb = false"
          :header="headerText"
          :buttons="buttons"
          closable
        />

        <v-card-text class="pa-sm-4 pa-2">
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="dbName"
              :rules="[(v) => !!v || 'Name is required', nameRules]"
              label="Name"
              autofocus
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <DialogConfirm
      v-if="dialogActivateConfirm"
      @close="dialogActivateConfirm = false"
      @confirm="activateDb"
      :dialog="dialogActivateConfirm"
      :text="confirmText"
    />

    <DialogDeleteConfirm
      v-if="dialogDeleteConfirm"
      @close="dialogDeleteConfirm = false"
      @delete="deleteDb"
      :dialog="dialogDeleteConfirm"
      :text="deleteText"
    />

    <v-dialog
      v-model="dialogSelected"
      width="400"
      overlay-opacity="1"
      persistent
    >
      <v-card>
        <v-card-text class="text-center pa-6">
          The database is activated. <br />
          Please restart the application.
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import Vue from "vue";
import axios from "axios";

export default {
  name: "SettingsDatabases",
  components: {
    DialogHeader: () => import("@/components/elements/DialogHeader.vue"),
    DialogConfirm: () => import("@/components/dialogs/DialogConfirm.vue"),
    DialogDeleteConfirm: () =>
      import("@/components/dialogs/DialogDeleteConfirm.vue"),
  },
  data: () => ({
    dbName: "",
    db: null,
    valid: false,
    buttons: [],
    dialogDb: false,
    dialogActivateConfirm: false,
    dialogDeleteConfirm: false,
    dialogSelected: false,
    headerText: "",
    confirmText: "Activate database?",
    deleteText: "The database will be permanently deleted. \r Are you sure?",
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    databases: {
      get() {
        return this.$store.state.databases;
      },
      set(value) {
        this.$store.state.databases = value;
      },
    },
    dialogConfirm: {
      get() {
        return this.$store.state.Dialogs.confirm;
      },
      set(value) {
        this.$store.state.Dialogs.confirm = value;
      },
    },
  },
  methods: {
    getDate(ms) {
      return Vue.prototype.$getDateFromMs(ms);
    },
    add() {
      this.dbName = "";
      this.headerText = "Adding database";
      this.buttons = [
        {
          icon: "plus",
          text: "Add",
          color: "success",
          outlined: false,
          function: () => {
            this.addDb();
          },
        },
      ];
      this.dialogDb = true;
    },
    async addDb() {
      this.$refs.form.validate();
      if (!this.valid) return;

      await axios({
        method: "post",
        url: this.apiUrl + "/api/task/createDb",
        data: {
          name: this.dbName,
        },
      })
        .then((res) => {
          this.databases = res.data;
          this.db = this.databases.sort((a, b) => b.createdAt - a.createdAt)[0];
          console.log(this.db);
          this.dialogActivateConfirm = true;
        })
        .catch((e) => {
          console.log(e);
        });

      this.dialogDb = false;
    },
    edit(db) {
      this.db = db;
      this.dbName = db.name;
      this.headerText = "Editing database";
      this.buttons = [
        {
          icon: "content-save",
          text: "Save",
          color: "success",
          outlined: false,
          function: () => {
            this.updateDb();
          },
        },
      ];
      this.dialogDb = true;
    },
    async updateDb() {
      this.$refs.form.validate();
      if (!this.valid) return;

      await axios({
        method: "post",
        url: this.apiUrl + "/api/task/editDb",
        data: {
          id: this.db.id,
          name: this.dbName,
        },
      })
        .then((res) => {
          this.databases = res.data;
        })
        .catch((e) => {
          console.log(e);
        });

      this.dialogDb = false;
    },
    openDialogConfirm(db) {
      if (db.active) return;
      this.db = db;
      this.dialogActivateConfirm = true;
    },
    async activateDb() {
      await axios({
        method: "post",
        url: this.apiUrl + "/api/task/selectDb",
        data: {
          id: this.db.id,
        },
      })
        .then((res) => {
          this.databases = res.data;
        })
        .catch((e) => {
          console.log(e);
        });

      this.dialogActivateConfirm = false;
      this.dialogSelected = true;
    },
    confirmRemoving(db) {
      this.db = db;
      this.dialogDeleteConfirm = true;
    },
    async deleteDb() {
      await axios({
        method: "post",
        url: this.apiUrl + "/api/task/deleteDb",
        data: {
          id: this.db.id,
        },
      })
        .then((res) => {
          this.databases = res.data;
        })
        .catch((e) => {
          console.log(e);
        });

      this.dialogDeleteConfirm = false;
    },
    nameRules(string) {
      return Vue.prototype.$validateName(string);
    },
  },
};
</script>


<style lang="scss" scoped>
.list-item-rounded {
  background-color: #6a6a6a12;
  &.active {
    pointer-events: none;
    .v-btn {
      pointer-events: all;
    }
  }
}
</style>