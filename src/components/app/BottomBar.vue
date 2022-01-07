<template>
  <v-bottom-navigation fixed shift>
    <!-- TODO custom background color depends on current route -->
    <vuescroll :ops="ops">
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

        <v-tooltip v-for="meta in metaList" :key="meta.id" top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              :to="`/meta?metaId=${meta.id}&tabId=default`"
              :title="meta.name"
              color="secondary"
              exact
              text
            >
              <span>{{ meta.name }}</span>
              <v-icon>mdi-{{ meta.icon }}</v-icon>
            </v-btn>
          </template>
          <span>{{ meta.name }}</span>
        </v-tooltip>

        <v-menu v-if="hiddenMetaList.length" offset-y top open-on-hover>
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
                v-for="meta in hiddenMetaList"
                :key="meta.id + 1"
                :to="`/meta?metaId=${meta.id}&tabId=default`"
                color="secondary"
                link
                exact
                text
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon left>mdi-{{ meta.icon }}</v-icon>
                    {{ meta.name }}
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
    </vuescroll>
  </v-bottom-navigation>
</template>


<script>
import axios from "axios";
import vuescroll from "vuescroll";

export default {
  name: "BottomBar",
  components: { vuescroll },
  async mounted() {
    await this.getMediaList();
    await this.getMetaList();
    this.$root.$on("updateNavbar", () => {
      this.getMetaList();
    });
  },
  data: () => ({
    folderHovered: false,
    ops: {
      scrollPanel: { scrollingY: false },
      rail: { size: "4px" },
    },
    mediaTypes: [],
    metaList: [],
    hiddenMetaList: [],
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
  },
  methods: {
    async getMediaList() {
      await axios
        .get(this.apiUrl + "/api/mediaType")
        .then((res) => {
          this.mediaTypes = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getMetaList() {
      await axios
        .get(this.apiUrl + "/api/meta")
        .then((res) => {
          let metaAll = res.data.filter((i) => i.type == "array");
          this.metaList = metaAll.filter((i) => !i.metaSetting.hidden);
          this.hiddenMetaList = metaAll.filter((i) => i.metaSetting.hidden);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  watch: {},
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
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: 56px;
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