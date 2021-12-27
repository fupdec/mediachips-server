<template>
  <v-navigation-drawer app permanent mini-variant expand-on-hover clipped>
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
          v-for="media in mediaTypes"
          :key="media.name + media.id"
          link
          exact
          :to="`/media?mediaId=${media.id}&tabId=default`"
          active-class="secondary--text"
          color="secondary"
          draggable="false"
        >
          <v-list-item-icon>
            <v-icon>mdi-{{ media.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ media.name }}</v-list-item-title>
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
  mounted() {
    this.$nextTick(() => {
      this.getMediaList();
      this.getMetaList();
      this.$root.$on("updateNavbar", () => {
        this.getMetaList();
      });
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
  },
  methods: {
    getMediaList() {
      axios
        .get(this.apiUrl + "/api/mediaType")
        .then((res) => {
          this.mediaTypes = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getMetaList() {
      axios
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