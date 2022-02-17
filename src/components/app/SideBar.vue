<template>
  <v-navigation-drawer
    v-model="nav"
    permanent
    app
    mini-variant
    expand-on-hover
    clipped
  >
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
            link
            exact
            :to="`/meta?metaId=${i.id}`"
            active-class="secondary--text"
            color="secondary"
            draggable="false"
          >
            <v-list-item-icon>
              <v-icon>mdi-{{ i.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ i.name }}</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-if="hiddenMeta.length"
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
              v-for="i in hiddenMeta"
              :key="i.id + 1"
              link
              exact
              :to="`/meta?metaId=${i.id}`"
              active-class="secondary--text"
              color="secondary"
              draggable="false"
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
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
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
    nav: {
      get() {
        return this.$store.state.navDrawer;
      },
      set(value) {
        this.$store.state.navDrawer = value;
      },
    },
  },
};
</script>