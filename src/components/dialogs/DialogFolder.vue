<template>
  <v-dialog
    v-model="watcher.dialogFolder"
    :fullscreen="$vuetify.breakpoint.xs"
    width="900"
    scrollable
  >
    <v-card>
      <DialogHeader
        @close="watcher.dialogFolder = false"
        header="Watched folder"
        closable
      />

      <v-card-text class="pa-2 pa-sm-4">
        <div class="px-4 pb-4 d-flex justify-space-between flex-wrap">
          <div>
            <v-icon left>mdi-folder</v-icon>
            <span v-text="watched.folder.name" />
          </div>
          <div v-text="watched.folder.path" class="text--secondary mt-1" />
        </div>

        <v-expansion-panels v-model="panel">
          <v-expansion-panel v-for="(i, x) in watched.files" :key="i.type.id">
            <v-expansion-panel-header>
              <span>
                <v-icon left>mdi-{{ i.type.icon }}</v-icon>
                <span v-text="i.type.name" />
                <span v-if="panel !== x">
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
              </span>
            </v-expansion-panel-header>

            <v-expansion-panel-content>
              <div v-if="i.new.length > 0" class="mb-4">
                <v-chip
                  v-text="`New: ${i.new.length}`"
                  color="info"
                  class="mb-2"
                  small
                />
                <v-card outlined class="pa-2">
                  <v-virtual-scroll
                    :height="i.new.length > 10 ? 150 : i.new.length * 15"
                    :items="i.new"
                    class="virtual-scroller"
                    item-height="15"
                  >
                    <template v-slot:default="{ item }">
                      <div class="caption">{{ item }}</div>
                    </template>
                  </v-virtual-scroll>
                </v-card>
              </div>

              <div v-if="i.lost.length > 0">
                <v-chip
                  v-text="`Lost: ${i.lost.length}`"
                  color="warning"
                  class="mb-2"
                  small
                />
                <v-card outlined class="pa-2">
                  <v-virtual-scroll
                    :height="i.lost.length > 10 ? 150 : i.lost.length * 15"
                    :items="i.lost"
                    class="virtual-scroller"
                    item-height="15"
                  >
                    <template v-slot:default="{ item }">
                      <div class="caption">{{ item }}</div>
                    </template>
                  </v-virtual-scroll>
                </v-card>
              </div>

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
      </v-card-text>
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