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

    <DialogConfirm
      @close="dialogActivateConfirm = false"
      @confirm="activate"
      :dialog="dialogActivateConfirm"
      :text="confirmText"
    />
  </div>
</template>


<script>
import Vue from "vue";

export default {
  name: "SettingsDatabases",
  components: {
    DialogConfirm: () => import("@/components/dialogs/DialogConfirm.vue"),
  },
  data: () => ({
    dialogActivateConfirm: false,
    confirmText: "",
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
    getDate(ms) {
      return Vue.prototype.$getDateFromMs(ms);
    },
    addDb() {},
    openDialogConfirm() {
      this.confirmText = "Activate database?";
      this.dialogActivateConfirm = true;
    },
    activate() {
      this.dialogActivateConfirm = false;
    },
    edit() {},
    confirmRemoving() {},
  },
};
</script>