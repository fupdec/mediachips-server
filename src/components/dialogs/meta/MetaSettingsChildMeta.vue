<template>
  <div>
  </div>
</template>


<script>
import Vue from "vue";
import axios from "axios";
import vuescroll from "vuescroll";

export default {
  name: "MetaSettingsChildMeta",
  props: {
    meta: Object,
  },
  components: {},
  mounted() {
    this.$nextTick(() => {
      this.getChildMeta();
    });
  },
  data: () => ({
    childMeta: [],
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
  },
  methods: {
    async getChildMeta() {
      await axios
        .get(this.apiUrl + "/api/ChildMeta?metaId=" + this.meta.id)
        .then((res) => {
          this.childMeta = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  watch: {},
};
</script>