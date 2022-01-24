<template>
  <div>
    <v-container class="text-center">
      <v-alert type="info" outlined>
        Welcome to mediaChips. You can open the application in a browser at
        <b> {{ localhost }} </b>
      </v-alert>
      <v-alert type="info" outlined>
        The current version 0.1.0-alpha only works with database backups from
        application version 0.11.1-beta <br />
        To import your database, first specify the exact path to the backup
        archive
      </v-alert>

      <v-text-field
        v-model="backup"
        label="Place here full path to the backup archive"
      ></v-text-field>
      <v-btn @click="importData" :disabled="!backup" color="success">
        <v-icon left> mdi-database-import </v-icon> Import Database
      </v-btn>
    </v-container>

    <v-dialog v-model="dialogImport" persistent width="500px">
      <v-card class="text-center py-4">
        <v-card-text>
          <div v-if="isImportRun">
            <div class="headline mb-4">Importing database...</div>
            <v-alert type="info" dense text class="body-2">
              This may take a few minutes
            </v-alert>
            <Loading />
          </div>
          <div class="headline">{{ importStatus }}</div>
        </v-card-text>
        <v-btn
          @click="dialogImport = false"
          :disabled="isImportRun"
          color="success"
          class="mt-4"
          depressed
        >
          <v-icon left>mdi-check</v-icon> OK
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  components: {
    Loading: () => import("@/components/elements/Loading.vue"),
  },
  data: () => ({
    backup:
      "C:\\Users\\CHANGETOUSERNAME\\AppData\\Roaming\\mediaChips\\userfiles\\backups\\CHANGETOLASTBACKUP.zip",
    isImportRun: false,
    importStatus: "",
    dialogImport: false,
  }),
  computed: {
    localhost() {
      return this.$store.state.localhost;
    },
  },
  methods: {
    importData() {
      this.dialogImport = true;
      this.isImportRun = true;
      axios
        .post(this.localhost + "/api/Task/importDatabase", {
          path: this.backup,
        })
        .then((e) => {
          this.importStatus = "Successfully imported";
          this.isImportRun = false;
          this.$root.$emit("updateNavbar");
        })
        .catch((e) => {
          this.importStatus = e;
          this.isImportRun = false;
        });
    },
  },
};
</script>