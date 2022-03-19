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
        header="Watched folder"
        closable
      />

      <div class="px-4 pt-4 d-flex justify-space-between flex-wrap">
        <div>
          <v-icon left>mdi-folder</v-icon>
          <span v-text="watched.folder.name" />
        </div>
        <div v-text="watched.folder.path" class="text--secondary mt-1" />
      </div>

      <v-expansion-panels v-model="panel" class="pa-2 pa-sm-4">
        <v-expansion-panel v-for="i in watched.files" :key="i.type.id">
          <v-expansion-panel-header>
            <span>
              <v-icon left>mdi-{{ i.type.icon }}</v-icon>
              <span v-text="i.type.name" />
              <v-chip
                v-if="i.new.length"
                v-text="i.new.length"
                color="info"
                class="px-2 ml-2"
                small
              />
              <v-chip
                v-if="i.lost.length"
                v-text="i.lost.length"
                color="warning"
                class="px-2 ml-2"
                small
              />
            </span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-virtual-scroll
              v-if="i.new.length > 0"
              :height="i.new.length > 10 ? '150': i.new.length * 10 * 15"
              :items="i.new"
              class="virtual-scroller"
              item-height="15"
            >
              <template v-slot:default="{ item }">
                <div class="caption">{{ item }}</div>
              </template>
            </v-virtual-scroll>

            <v-virtual-scroll
              v-if="i.lost.length > 0"
              :height="i.new.length > 10 ? '150': i.new.length * 10 * 15"
              :items="i.lost"
              class="virtual-scroller"
              item-height="20"
            >
              <template v-slot:default="{ item }">
                <div>{{ item }}</div>
              </template>
            </v-virtual-scroll>

            <div
              v-if="i.lost.length == 0 && i.new.length == 0"
              class="text-center pa-8"
            >
              <v-icon size="80" color="green">mdi-folder-sync</v-icon>
              <div class="green--text">
                Media in the folder and in the database are synchronized!
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-dialog>
</template>


<script>
import DialogHeader from "@/components/elements/DialogHeader.vue";

export default {
  name: "DialogFolder",
  data: () => ({
    panel: 0,
  }),
  components: {
    DialogHeader,
  },
  computed: {
    watched() {
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