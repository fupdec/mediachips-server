<template>
  <v-navigation-drawer
    v-model="nav"
    permanent
    app
    mini-variant
    expand-on-hover
    clipped
  >
    <vuescroll :ops="ops">
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
          :to="`/media?typeId=${type.id}&tabId=default`"
          active-class="secondary--text"
          color="secondary"
          draggable="false"
        >
          <v-list-item-icon>
            <v-icon>mdi-{{ type.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ type.name }}</v-list-item-title>
        </v-list-item>

        <v-divider v-if="metaList.length > 0" class="my-1" />

        <v-list-item
          v-for="meta in metaList"
          :key="meta.id"
          link
          exact
          :to="`/meta?metaId=${meta.id}&tabId=default`"
          active-class="secondary--text"
          color="secondary"
          draggable="false"
        >
          <v-list-item-icon>
            <v-icon>mdi-{{ meta.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ meta.name }}</v-list-item-title>
        </v-list-item>

        <v-list-item
          v-if="hiddenMetaList.length"
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
            v-for="meta in hiddenMetaList"
            :key="meta.id + 1"
            link
            exact
            :to="`/meta?metaId=${meta.id}&tabId=default`"
            active-class="secondary--text"
            color="secondary"
            draggable="false"
          >
            <v-list-item-icon>
              <v-icon>mdi-{{ meta.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ meta.name }}</v-list-item-title>
          </v-list-item>
        </div>

        <v-divider class="my-1" />

        <v-list-item link to="/settings" color="secondary" draggable="false">
          <v-list-item-icon>
            <v-icon>mdi-cog-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
      </v-list>
    </vuescroll>
  </v-navigation-drawer>
</template>


<script>
import axios from "axios";
import vuescroll from "vuescroll";

export default {
  name: "SideBar",
  components: { vuescroll },
  async mounted() {
    await this.getMediaList();
    await this.getMetaList();
    this.$root.$on("updateNavbar", () => {
      this.getMetaList();
    });
  },
  data: () => ({
    ops: {
      scrollPanel: { scrollingX: false },
      rail: { size: "4px" },
    },
    mediaTypes: [],
    metaList: [],
    hiddenMetaList: [],
    showHidden: false,
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    nav: {
      get() {
        return this.$store.state.navDrawer;
      },
      set(value) {
        this.$store.state.navDrawer = value;
      },
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
};
</script>