<template>
  <v-dialog
    v-model="watcher.dialogFolder"
    :fullscreen="$vuetify.breakpoint.xs"
    width="1200"
    scrollable
  >
    <v-card>
      <DialogHeader
        @close="watcher.dialogFolder = false"
        :header="folder.folder"
        closable
      />

      <v-card-text v-if="folder.newFiles.length > 0" class="pa-2 pa-sm-4">
        <v-alert dense text color="info">
          Number of videos new: {{ folder.newFiles.length }}
        </v-alert>
        <v-virtual-scroll
          :items="folder.newFiles"
          class="virtual-scroller"
          item-height="20"
          height="100"
        >
          <template v-slot:default="{ item }">
            <div>{{ item }}</div>
          </template>
        </v-virtual-scroll>
      </v-card-text>

      <v-card-text v-if="folder.lostFiles.length > 0" class="pa-2 pa-sm-4">
        <v-alert dense text color="warning">
          Number of videos lost: {{ folder.lostFiles.length }}
        </v-alert>
        <v-virtual-scroll
          :items="folder.lostFiles"
          class="virtual-scroller"
          item-height="20"
          height="100"
        >
          <template v-slot:default="{ item }">
            <div>{{ item }}</div>
          </template>
        </v-virtual-scroll>
      </v-card-text>

      <v-card-text
        v-if="folder.lostFiles.length == 0 && folder.newFiles.length == 0"
        class="text-center pa-8"
      >
        <v-icon size="80" color="green">mdi-folder-sync</v-icon>
        <div class="green--text">
          Videos in the folder and in the database are synchronized!
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


<script>
import DialogHeader from "@/components/elements/DialogHeader.vue";

export default {
  name: "DialogFolder",
  components: {
    DialogHeader,
  },
  computed: {
    folder() {
      return this.watcher.folder;
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
    addNewVideos() {
      this.watcher.dialogFolder = false;
    },
  },
};
</script>