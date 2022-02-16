<template>
  <v-bottom-navigation fixed shift>
    <!-- TODO custom background color depends on current route -->
    <div class="scrollable">
      <div class="scrollable-child bottom-menu-wrap">
        <div class="bottom-menu">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" to="/" exact text color="secondary" title="Home">
                <span>Home</span>
                <v-icon>mdi-home-outline</v-icon>
              </v-btn>
            </template>
            <span>Home</span>
          </v-tooltip>

          <v-tooltip v-for="type in mediaTypes" :key="type.name + type.id" top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :to="`/media?typeId=${type.id}&tabId=default`"
                :title="type.name"
                color="secondary"
                exact
                text
              >
                <span>{{ type.name }}</span>
                <v-icon>mdi-{{ type.icon }}</v-icon>
              </v-btn>
            </template>
            <span>Videos</span>
          </v-tooltip>

          <v-tooltip v-for="i in meta" :key="i.id" top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :to="`/meta?metaId=${i.id}&tabId=default`"
                :title="i.name"
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

          <v-menu v-if="hiddenMeta.length" offset-y top open-on-hover>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                text
                color="secondary"
                class="folder btn-hidden"
              >
                <span>Hidden</span>
                <v-icon>mdi-chevron-up</v-icon>
              </v-btn>
            </template>

            <v-list dense>
              <v-list-item-group>
                <v-list-item
                  v-for="i in hiddenMeta"
                  :key="i.id + 1"
                  :to="`/meta?metaId=${i.id}&tabId=default`"
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
              <v-btn
                v-on="on"
                to="/settings"
                title="Settings"
                color="secondary"
                text
              >
                <span>Settings</span>
                <v-icon>mdi-cog-outline</v-icon>
              </v-btn>
            </template>
            <span>Settings</span>
          </v-tooltip>
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
    apiUrl() {
      return this.$store.state.localhost;
    },
    mediaTypes() {
      return this.$store.state.mediaTypes;
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
}
</style>