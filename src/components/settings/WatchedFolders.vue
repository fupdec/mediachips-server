<template>
  <v-card outlined class="px-4">
    <div class="headline text-center my-4">
      Folders
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" right>
            mdi-help-circle-outline
          </v-icon>
        </template>
        <span>
          Add folders with your videos so that app can watch <br />
          new videos and check deleted ones
        </span>
      </v-tooltip>
    </div>
    <v-list dense v-if="folders.length" shaped class="pb-0 pl-2">
      <v-list-item v-for="(folder, i) in folders" :key="i" class="folder-list">
        <div class="folder-item">
          <div v-if="folderNameEdit == i" class="name">
            <v-btn
              @click="folderNameEdit = -1"
              class="mr-1"
              color="red"
              icon
              fab
              x-small
              title="Cancel"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-text-field
              v-model="folderName"
              class="d-inline-flex"
              hide-details
              outlined
              dense
            />
            <v-btn
              @click="renameFolder(i)"
              :disabled="folderName == ''"
              class="ml-1"
              color="green"
              icon
              fab
              x-small
              title="Save folder name"
            >
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </div>
          <div v-else class="name">
            <v-btn
              @click="(folderNameEdit = i), (folderName = folder.name)"
              class="mr-1"
              icon
              fab
              x-small
              title="Edit folder name"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-chip label outlined :title="folder.name">
              <span>{{ folder.name }}</span>
            </v-chip>
          </div>
          <v-chip
            @click="openFolder(folder.path)"
            label
            outlined
            class="path"
            :title="`Open in explorer: ${folder.path}`"
          >
            <v-icon left class="icon-closed">mdi-folder</v-icon>
            <v-icon left class="icon-open">mdi-folder-open</v-icon>
            <span>{{ folder.path }}</span>
          </v-chip>
        </div>
        <v-switch
          v-model="folder.watch"
          @change="updateFolders"
          class="ml-4 mt-0 pt-0"
          hide-details
          title="Toggle watch"
        />
        <v-btn
          @click="removeFolder(i)"
          class="ml-2"
          color="red"
          icon
          fab
          x-small
          title="Remove folder"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
    <div v-else class="text-center overline pt-2">
      <v-icon size="40">mdi-folder-outline</v-icon>
      <div>There are no watched folders yet</div>
    </div>
    <v-card-actions>
      <v-btn @click="addFolder" rounded dark color="green" class="pr-4">
        <v-icon left>mdi-plus</v-icon> Add watched folder
      </v-btn>
      <v-spacer></v-spacer>
      <div class="d-flex align-center">
        <div class="mr-6">Watch folders:</div>
        <v-switch
          v-model="watchFolders"
          :label="watchFolders ? 'Yes' : 'No'"
          inset
          class="d-inline"
          :disabled="folders.length == 0"
        />
      </div>
    </v-card-actions>
  </v-card>
</template>


<script>
import axios from "axios";

export default {
  name: "WatchedFolders",
  mounted() {
    this.$nextTick(async () => {
      await this.getFolders();
    });
  },
  data: () => ({
    folders: [],
    watchFolders: false,
    folderName: "",
    folderNameEdit: -1,
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
  },
  methods: {
    async getFolders() {
      await axios
        .get(this.apiUrl + "/api/WatchedFolder")
        .then((res) => {
          this.folders = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async addFolder() {
      await axios({
        method: "post",
        url: this.apiUrl + "/api/WatchedFolder",
        data: {
          path: "D:\\torrents",
          name: "D:\\torrents",
          typeId: 1,
        },
      })
        .then(() => {
          this.getFolders();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async renameFolder(i) {
      const folder = this.folders[i];
      await axios({
        method: "put",
        url: this.apiUrl + "/api/WatchedFolder/" + folder.id,
        data: {
          name: this.folderName,
        },
      })
        .then(async () => {
          await this.getFolders();
          this.folderNameEdit = -1;
        })
        .catch((e) => {
          this.folderNameEdit = -1;
          console.log(e);
        });
    },
    async removeFolder(i) {
      const folder = this.folders[i];
      await axios({
        method: "delete",
        url: this.apiUrl + "/api/WatchedFolder/" + folder.id,
      })
        .then(() => {
          this.getFolders();
          this.folders.splice(i, 1);
          if (this.folders.length == 0) this.watchFolders = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    updateFolders() {},
  },
};
</script>


<style lang="scss" scoped>
.folder-list {
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: rgba(150, 150, 150, 0.1);
  padding-left: 5px;
  padding-right: 3px;
  margin-bottom: 3px;
  .folder-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc(100% - 40px);
    .v-input__slot {
      min-height: 32px !important;
    }
    .name {
      display: flex;
      align-items: center;
      max-width: calc(50% - 40px);
    }
    .path {
      max-width: 40%;
      .icon-open {
        display: none;
      }
      &:hover {
        .icon-closed {
          display: none;
        }
        .icon-open {
          display: inline-flex;
        }
      }
    }
  }
}
</style>