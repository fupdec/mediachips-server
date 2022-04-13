<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn @click="add" v-on="on" icon>
        <v-icon>mdi-tab</v-icon>
      </v-btn>
    </template>
    <span>Open in Tab</span>
  </v-tooltip>
</template>


<script>
import axios from "axios";
import Vue from "vue";

export default {
  name: "TabAdd",
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    tabs: {
      get() {
        return this.$store.state.tabs;
      },
      set(value) {
        this.$store.commit("updateState", {
          key: "tabs",
          value: _.cloneDeep(value),
        });
      },
    },
    page() {
      return this.$store.state.Page;
    },
  },
  methods: {
    add() {
      axios({
        method: "post",
        url: this.apiUrl + "/api/tab",
        data: {
          name: this.page.name,
          icon: this.page.icon,
          url: this.$route.path,
          itemId: Vue.prototype.$getUrlParam("itemId"),
          typeId: Vue.prototype.$getUrlParam("typeId"),
          metaId: Vue.prototype.$getUrlParam("metaId"),
        },
      })
        .then((res) => {
          console.log(res.data);
          this.$root.$emit("getTabs");
        })
        .catch((e) => {
          // console.log(e);
        });
    },
  },
};
</script>