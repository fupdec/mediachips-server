<template>
  <div class="mx-4">
    <v-divider class="mt-4 mb-2" />
    <div class="subtitle-2 text-right mb-4">Folders</div>

    <v-checkbox
      v-model="sets.watchFolders"
      @change="setOption($event, 'watchFolders')"
      :disabled="watcher.busy"
      false-value="0"
      true-value="1"
      class="mt-0"
    >
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Watch folders</div>
          <div class="subtitle-2 mt-1">
            Watch for changes in the folder. New and lost files will be shown.
          </div>
        </div>
      </template>
    </v-checkbox>

    <v-list v-if="sets.watchFolders == '1'" dense rounded class="px-0">
      <v-btn
        @click="addFolder"
        color="success"
        class="pr-4 mb-4"
        rounded
        depressed
      >
        <v-icon left>mdi-plus</v-icon> Add Folder
      </v-btn>

      <v-list-item v-for="f in watcher.folders" :key="f.id" @click="toggle(f)">
        <v-list-item-avatar>
          <v-icon v-text="`mdi-eye${f.watch == 1 ? '-off' : ''}`" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="f.name" />
          <v-list-item-subtitle v-text="f.path" />
        </v-list-item-content>

        <v-list-item-action>
          <v-btn-toggle dense rounded>
            <v-btn @click.stop="edit(f)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn @click.stop="confirmRemoving(f)">
              <v-icon color="error">mdi-close</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-dialog v-model="dialogFolder" scrollable width="600">
      <v-card>
        <DialogHeader
          @close="dialogFolder = false"
          :header="`Adding folder`"
          :buttons="buttons"
          closable
        />

        <v-card-text class="pa-sm-4 pa-2">
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="folderPath"
              :rules="[
                (v) => !!v || 'Path is required',
                (v) => /\\|\/.*/gm.test(v) || 'Wrong path',
              ]"
              label="Path to folder"
              required
              autofocus
            />
            <v-text-field
              v-model="folderName"
              label="Name of folder (optional)"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <DialogDeleteConfirm
      v-if="dialogDelete"
      @close="dialogDelete = false"
      @delete="remove"
      :dialog="dialogDelete"
      :text="text"
    />
  </div>
</template>


<script>
import Vue from "vue";
import axios from "axios";

export default {
  name: "WatchedFolders",
  components: {
    DialogHeader: () => import("@/components/elements/DialogHeader.vue"),
    DialogDeleteConfirm: () =>
      import("@/components/dialogs/DialogDeleteConfirm.vue"),
  },
  mounted() {
    this.getFolders();
  },
  data: () => ({
    folderName: "",
    folderPath: "",
    folder: null,
    buttons: [],
    valid: false,
    dialogFolder: false,
    dialogDelete: false,
    text: "This folder will be removed from watchlists. \r Are you sure?",
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    sets: {
      get() {
        return this.$store.state.settings;
      },
      set(value) {
        this.$store.state.settings = value;
      },
    },
    watcher: {
      get() {
        return this.$store.state.Watcher;
      },
      set(value) {
        this.$store.state.Watcher = value;
      },
    },
  },
  methods: {
    async setOption(value, option) {
      this.sets[option] = value;
      await Vue.prototype.$setOption(option, value);
    },
    addFolder() {
      this.buttons = [
        {
          icon: "plus",
          text: "Add",
          color: "success",
          outlined: false,
          function: () => {
            this.add();
          },
        },
      ];
      this.folderPath = "";
      this.folderName = "";
      this.dialogFolder = true;
    },
    async getFolders() {
      await axios
        .get(this.apiUrl + "/api/WatchedFolder")
        .then((res) => {
          this.watcher.folders = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async add() {
      await this.$refs.form.validate();
      if (!this.valid) return;

      await axios({
        method: "post",
        url: this.apiUrl + "/api/WatchedFolder",
        data: {
          path: this.folderPath,
          name: this.folderName || this.folderPath,
          watch: 1,
        },
      })
        .then(() => {
          this.getFolders();
        })
        .catch((e) => {
          console.log(e);
        });
      this.dialogFolder = false;
    },
    edit(folder) {
      this.folder = folder;
      this.folderPath = folder.path;
      this.folderName = folder.name;
      this.buttons = [
        {
          icon: "content-save",
          text: "Save",
          color: "success",
          outlined: false,
          function: () => {
            this.save();
          },
        },
      ];
      this.dialogFolder = true;
    },
    async save() {
      await axios({
        method: "put",
        url: this.apiUrl + "/api/WatchedFolder/" + this.folder.id,
        data: {
          name: this.folderName,
          path: this.folderPath,
        },
      })
        .then(async () => {
          await this.getFolders();
        })
        .catch((e) => {
          console.log(e);
        });
      this.dialogFolder = false;
    },
    confirmRemoving(folder) {
      this.folder = folder;
      this.dialogDelete = true;
    },
    async remove() {
      await axios({
        method: "delete",
        url: this.apiUrl + "/api/WatchedFolder/" + this.folder.id,
      })
        .then(async () => {
          await this.getFolders();
          // if (this.folders.length == 0) this.setOption("0", "watchFolders");
        })
        .catch((e) => {
          console.log(e);
        });
      this.dialogDelete = false;
    },
    toggle(folder) {
      axios({
        method: "put",
        url: this.apiUrl + "/api/WatchedFolder/" + folder.id,
        data: {
          watch: folder.watch == 1 ? 0 : 1,
        },
      })
        .then(() => {
          this.getFolders();
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>