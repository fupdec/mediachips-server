<template>
  <div class="app-bar-container">
    <div>
      <ItemSearch />
    </div>

    <v-spacer></v-spacer>
    <img @click="toggleDarkMode" :src="logo" class="logo"/>
    <v-spacer></v-spacer>

    <div>
      <ItemsPerPage />
      <ItemSize />
    </div>
  </div>
</template>


<script>
const path = require("path");
export default {
  name: "ItemsAppbar",
  components: {
    ItemSearch: () => import("@/components/app/appbar/elements/ItemSearch.vue"),
    ItemsPerPage: () => import("@/components/app/appbar/elements/ItemsPerPage.vue"),
    ItemSize: () => import("@/components/app/appbar/elements/ItemSize.vue"),
  },
  computed: {
    logo() {
      return path.join(__dirname, '/icons/icon.png');
    },
  },
  methods: {
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    }
  }
};
</script>


<style lang="scss" scoped>
.logo {
  position: absolute;
  left: 0;
  right: 0;
  top: 8px;
  margin: auto;
  height: 32px;
}
</style>