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

      <v-list-item v-for="i in watcher.folders" :key="i.id" @click="toggle(i)">
        <v-list-item-avatar>
          <v-icon v-text="`mdi-eye${i.watch ? '' : '-off'}`" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            <v-icon v-for="type in i.types" :key="type.id" small>
              mdi-{{ type.icon }}
            </v-icon>
            <span v-text="i.name" class="ml-2" />
          </v-list-item-title>
          <v-list-item-subtitle v-text="i.path" />
        </v-list-item-content>

        <v-list-item-action>
          <v-btn-toggle dense rounded>
            <v-btn @click.stop="edit(i)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn @click.stop="confirmRemoving(i)">
              <v-icon color="error">mdi-close</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-dialog
      v-model="dialogFolder"
      :fullscreen="$vuetify.breakpoint.xs"
      scrollable
      width="600"
    >
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

            <div>Media types</div>
            <v-alert type="error" :value="mediaTypesError" text dense>
              Please select at least one media type
            </v-alert>
            <v-chip-group
              v-model="folderMediaTypes"
              active-class="primary--text"
              multiple
              column
            >
              <v-chip
                v-for="i in mediaTypes"
                :key="i.id"
                @click="mediaTypesError = false"
                outlined
              >
                <v-icon size="20" left>mdi-{{ i.icon }}</v-icon>
                {{ i.name }}
              </v-chip>
            </v-chip-group>
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
  name: "SettingsWatchedFolders",
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
    mediaTypesError: false,
    folderMediaTypes: [],
    dialogFolder: false,
    dialogDelete: false,
    text: "This folder will be removed from watchlists. \r Are you sure?",
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    mediaTypes() {
      return this.$store.state.mediaTypes;
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
      this.folderMediaTypes = [];
      this.dialogFolder = true;
    },
    async getFolders() {
      this.watcher.folders = await Vue.prototype.$getWatchedFolders();
    },
    async add() {
      await this.$refs.form.validate();
      if (!this.valid) return;
      if (this.folderMediaTypes.length == 0) {
        this.mediaTypesError = true;
        return;
      }

      await axios({
        method: "post",
        url: this.apiUrl + "/api/WatchedFolder",
        data: {
          folder: {
            path: this.folderPath,
            name: this.folderName || this.folderPath,
          },
          types: this.folderMediaTypes.map((i) => this.mediaTypes[i].id),
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
      this.folderMediaTypes = folder.types.map((i) =>
        this.mediaTypes.findIndex((x) => x.id == i.id)
      );
      this.folderPath = folder.path;
      this.folderName = folder.name;
      this.buttons = [
        {
          icon: "content-save",
          text: "Save",
          color: "success",
          outlined: false,
          function: () => {
            this.add();
          },
        },
      ];
      this.dialogFolder = true;
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
          watch: !folder.watch,
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