<template>
  <v-navigation-drawer permanent app mini-variant expand-on-hover clipped>
    <div class="scrollable vertical">
      <div class="scrollable-child">
        <v-list nav dense>
          <v-list-item link to="/" color="secondary" draggable="false">
            <v-list-item-icon>
              <v-icon>mdi-home-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-divider v-if="mediaTypes.length > 0" class="my-1" />

          <v-list-item
            v-for="type in mediaTypes"
            :key="type.name + type.id"
            link
            exact
            :to="`/media?typeId=${type.id}`"
            active-class="secondary--text"
            color="secondary"
            draggable="false"
          >
            <v-list-item-icon>
              <v-icon>mdi-{{ type.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ type.name }}</v-list-item-title>
          </v-list-item>

          <v-divider v-if="meta.length > 0" class="my-1" />

          <v-list-item
            v-for="i in meta"
            :key="i.id"
            :to="`/meta?metaId=${i.id}`"
            active-class="secondary--text"
            color="secondary"
            draggable="false"
            exact
            link
          >
            <v-list-item-icon>
              <v-icon>mdi-{{ i.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ i.name }}</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-if="mediaTypesHidden.length || hiddenMeta.length"
            @click="showHidden = !showHidden"
            draggable="false"
          >
            <v-list-item-icon>
              <v-icon>mdi-chevron-{{ showHidden ? "up" : "down" }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Toggle hidden</v-list-item-title>
          </v-list-item>

          <div v-if="showHidden">
            <v-list-item
              v-for="i in mediaTypesHidden"
              :key="i.id + 1"
              :to="`/media?typeId=${i.id}`"
              active-class="secondary--text"
              color="secondary"
              draggable="false"
              exact
              link
            >
              <v-list-item-icon>
                <v-icon>mdi-{{ i.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ i.name }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-for="i in hiddenMeta"
              :key="i.id + 1"
              :to="`/meta?metaId=${i.id}`"
              active-class="secondary--text"
              color="secondary"
              draggable="false"
              exact
              link
            >
              <v-list-item-icon>
                <v-icon>mdi-{{ i.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ i.name }}</v-list-item-title>
            </v-list-item>
          </div>

          <v-divider class="my-1" />

          <v-list-item link to="/settings" color="secondary" draggable="false">
            <v-list-item-icon>
              <v-icon>mdi-cog-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ $t("headings.settings") }}</v-list-item-title>
          </v-list-item>

          <div
            v-if="watcher.files.length && sets.watchFolders == '1'"
            @mouseover="folderHovered = true"
            @mouseleave="folderHovered = false"
          >
            <v-divider class="my-1" />
            <v-list-item
              v-for="i in watcher.files"
              :key="i.folder.id"
              @click="openDialogFolder(i)"
              :disabled="watcher.busy"
            >
              <v-list-item-icon>
                <v-icon v-if="watcher.busy">mdi-folder-sync-outline</v-icon>
                <v-icon v-else>mdi-folder-outline</v-icon>
                <v-badge
                  v-if="!watcher.busy"
                  :value="getBadgeVal(i.files, 'new')"
                  :content="getBadgeVal(i.files, 'new')"
                  :offset-x="folderHovered ? 35 : 30"
                  :offset-y="folderHovered ? 12 : 6"
                  :dot="!folderHovered"
                  color="info"
                />
                <v-badge
                  v-if="!watcher.busy"
                  :value="getBadgeVal(i.files, 'lost')"
                  :content="getBadgeVal(i.files, 'lost')"
                  :offset-x="folderHovered ? 35 : 30"
                  :offset-y="folderHovered ? 35 : 26"
                  :dot="!folderHovered"
                  color="warning"
                />
              </v-list-item-icon>
              <v-list-item-title v-text="i.folder.name" />
            </v-list-item>
          </div>
        </v-list>
      </div>
    </div>
  </v-navigation-drawer>
</template>


<script>
export default {
  name: "SideBar",
  data: () => ({
    showHidden: false,
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
    openDialogFolder(folder) {
      this.watcher.folder = folder;
      this.watcher.dialogFolder = true;
    },
    getBadgeVal(files, type) {
      let value = 0;
      for (let i of files) value += i[type].length;
      return value;
    },
  },
};
</script>