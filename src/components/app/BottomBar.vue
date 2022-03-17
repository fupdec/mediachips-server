<template>
  <v-bottom-navigation fixed shift>
    <!-- TODO custom background color depends on current route -->
    <div class="scrollable">
      <div class="scrollable-child bottom-menu-wrap">
        <div class="bottom-menu">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" to="/" exact text color="secondary">
                <span>Home</span>
                <v-icon>mdi-home-outline</v-icon>
              </v-btn>
            </template>
            <span>Home</span>
          </v-tooltip>

          <v-tooltip
            v-for="media in mediaTypes"
            :key="media.name + media.id"
            top
          >
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :to="`/media?typeId=${media.id}`"
                color="secondary"
                exact
                text
              >
                <span v-html="media.name" />
                <v-icon>mdi-{{ media.icon }}</v-icon>
              </v-btn>
            </template>
            <span v-text="media.name" />
          </v-tooltip>

          <v-tooltip v-for="i in meta" :key="i.id" top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :to="`/meta?metaId=${i.id}`"
                color="secondary"
                exact
                text
              >
                <span>{{ i.name }}</span>
                <v-icon>mdi-{{ i.icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ i.name }}</span>
          </v-tooltip>

          <v-menu
            v-if="mediaTypesHidden.length || hiddenMeta.length"
            open-on-hover
            offset-y
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" class="folder btn-hidden" text>
                <span>Hidden</span>
                <v-icon>mdi-chevron-up</v-icon>
              </v-btn>
            </template>

            <v-list dense>
              <v-list-item-group>
                <v-list-item
                  v-for="i in mediaTypesHidden"
                  :key="i.id + 1"
                  :to="`/media?typeId=${i.id}`"
                  color="secondary"
                  link
                  exact
                  text
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-icon left>mdi-{{ i.icon }}</v-icon>
                      {{ i.name }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  v-for="i in hiddenMeta"
                  :key="i.id + 1"
                  :to="`/meta?metaId=${i.id}`"
                  color="secondary"
                  link
                  exact
                  text
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-icon left>mdi-{{ i.icon }}</v-icon>
                      {{ i.name }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" to="/settings" color="secondary" text>
                <span>Settings</span>
                <v-icon>mdi-cog-outline</v-icon>
              </v-btn>
            </template>
            <span>Settings</span>
          </v-tooltip>

          <div
            v-if="watcher.folders.length && sets.watchFolders == '1'"
            @mouseover="folderHovered = true"
            @mouseleave="folderHovered = false"
            class="folders"
          >
            <v-tooltip v-for="folder in watcher.folders" :key="folder.id" top>
              <template v-slot:activator="{ on, attrs }">
                <div class="folder-wrapper">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    @click="openDialogFolder(folder.path)"
                    :disabled="watcher.busy"
                    class="folder"
                    text
                  >
                    <v-icon v-if="watcher.busy">mdi-folder-sync-outline</v-icon>
                    <v-icon v-else>mdi-folder-outline</v-icon>
                  </v-btn>
                  <v-badge
                    v-if="!watcher.busy"
                    :value="getNewFiles(folder.path)"
                    :content="getNewFiles(folder.path)"
                    :offset-x="folderHovered ? 70 : 58"
                    :offset-y="folderHovered ? -6 : -8"
                    :dot="!folderHovered"
                    color="info"
                  />
                  <v-badge
                    v-if="!watcher.busy"
                    :value="getLostFiles(folder.path)"
                    :content="getLostFiles(folder.path)"
                    :offset-x="folderHovered ? 70 : 58"
                    :offset-y="folderHovered ? 18 : 10"
                    :dot="!folderHovered"
                    color="warning"
                  />
                </div>
              </template>
              <span>{{ folder.name }}</span>
            </v-tooltip>
          </div>
        </div>
      </div>
    </div>
  </v-bottom-navigation>
</template>


<script>
export default {
  name: "BottomBar",
  data: () => ({
    folderHovered: false,
  }),
  computed: {
    sets() {
      return this.$store.state.settings;
    },
    mediaTypes() {
      return this.$store.state.mediaTypes.filter((i) => !i.hidden);
    },
    mediaTypesHidden() {
      return this.$store.state.mediaTypes.filter((i) => i.hidden);
    },
    meta() {
      return this.$store.state.meta.filter(
        (i) => i.type == "array" && !i.metaSetting.hidden
      );
    },
    hiddenMeta() {
      return this.$store.state.meta.filter(
        (i) => i.type == "array" && i.metaSetting.hidden
      );
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
    getLostFiles(folder) {
      if (_.filter(this.watcher.files, { folder }).length) {
        const index = _.findIndex(this.watcher.files, { folder });
        return this.watcher.files[index].lostFiles.length;
      } else return "";
    },
    getNewFiles(folder) {
      if (_.filter(this.watcher.files, { folder }).length) {
        const index = _.findIndex(this.watcher.files, { folder });
        return this.watcher.files[index].newFiles.length;
      } else return "";
    },
    openDialogFolder(folder) {
      const index = _.findIndex(this.watcher.files, { folder });
      this.watcher.folder = this.watcher.files[index];
      this.watcher.dialogFolder = true;
    },
  },
};
</script>


<style lang="scss">
.v-bottom-navigation {
  .__view {
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
  }
  .v-btn {
    -webkit-user-drag: none !important;
    letter-spacing: 0;
    &.folder {
      .v-btn__content > *:not(.v-icon) {
        opacity: 0 !important;
      }
      .v-icon {
        transform: none !important;
      }
    }
  }
  .folders {
    display: flex;
    height: 100%;
  }
  .v-btn.folder,
  .folder-wrapper {
    height: 100%;
  }
  .bottom-menu {
    height: 56px;
    display: inline-flex;
    &-wrap {
      text-align: center;
      white-space: nowrap;
    }
  }
  .btn-hidden {
    min-width: 50px;
  }
  .draggable {
    display: flex;
    height: 100%;
    & > span {
      display: flex;
      height: 100%;
    }
  }
  .btn-meta {
    display: flex;
    height: 100%;
  }
  .v-badge__badge {
    pointer-events: none;
  }
}
</style>