<template>
  <div class="mx-4">
    <v-btn @click="addDb" color="success" class="pr-4 mb-2" rounded depressed>
      <v-icon left>mdi-plus</v-icon> Add Database
    </v-btn>

    <v-list dense rounded class="px-0">
      <v-list-item
        v-for="i in databases"
        :key="i.id"
        v-on="i.active ? {} : { click: openDialogConfirm }"
        style="background-color: #6a6a6a12"
      >
        <v-list-item-avatar :color="i.active ? 'success' : ''">
          <v-icon v-text="`mdi-database-${i.active ? 'cog' : 'off'}`" />
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

    <v-dialog v-model="dialogEditing" width="600" scrollable>
      <v-card>
        <DialogHeader
          @close="dialogEditing = false"
          :header="`Editing database`"
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
  </div>
</template>


<script>
import Vue from "vue";

export default {
  name: "SettingsDatabases",
  components: {
    DialogHeader: () => import("@/components/elements/DialogHeader.vue"),
    DialogConfirm: () => import("@/components/dialogs/DialogConfirm.vue"),
    DialogDeleteConfirm: () =>
      import("@/components/dialogs/DialogDeleteConfirm.vue"),
  },
  mounted() {
    this.initButtons();
  },
  data: () => ({
    dbName: "",
    dbEditing: null,
    valid: false,
    buttons: [],
    dialogEditing: false,
    dialogActivateConfirm: false,
    dialogDeleteConfirm: false,
    confirmText: "Activate database?",
    deleteText: "The database will be permanently deleted. \r Are you sure?",
  }),
  computed: {
    databases() {
      return this.$store.state.databases;
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
    initButtons() {
      this.buttons.push({
        icon: "content-save",
        text: "Save",
        color: "success",
        outlined: false,
        function: () => {
          this.updateDb();
        },
      });
    },
    getDate(ms) {
      return Vue.prototype.$getDateFromMs(ms);
    },
    addDb() {},
    edit(db) {
      this.dbEditing = db;
      this.dbName = db.name;
      this.dialogEditing = true;
    },
    updateDb() {
      this.$refs.form.validate();
      if (!this.valid) return;
      this.dialogEditing = false;
    },
    openDialogConfirm() {
      this.dialogActivateConfirm = true;
    },
    activateDb() {
      this.dialogActivateConfirm = false;
    },
    confirmRemoving(db) {
      this.dbEditing = db;
      this.dialogDeleteConfirm = true;
    },
    deleteDb() {
      this.dialogDeleteConfirm = false;
    },
    nameRules(string) {
      return Vue.prototype.$validateName(string);
    },
  },
};
</script>