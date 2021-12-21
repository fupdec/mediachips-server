<template>
  <v-switch
    label="Dark mode"
    :value="darkMode"
    @change="change($event)"
  ></v-switch>
</template>


<script>
import Vue from "vue";

export default {
  name: "DarkMode",
  mounted() {
    this.$nextTick(async () => {
      let option = await Vue.prototype.$getOption("darkMode");
      this.darkMode = option.data.value === "1" ? true : false;
    });
  },
  data: () => ({
    darkMode: false,
  }),
  methods: {
    async change(value) {
      this.darkMode = value;
      this.$vuetify.theme.dark = value;
      value = value === true ? "1" : "0";
      await Vue.prototype.$setOption("darkMode", value);
    },
  },
};
</script>