<template>
  <div>
    <v-list v-if="childMeta.length" dense class="list-zebra pa-0">
      <v-list-item v-for="(m, i) in childMeta" :key="i" class="pr-1 pl-2">
        <div
          class="d-flex justify-space-between align-center"
          style="width: 100%"
        >
          <v-chip outlined>
            <v-icon left>mdi-{{ m["meta.icon"] }}</v-icon>
            <span>{{ m["meta.name"] }}</span>
            <v-icon right small>{{ getIcon(m["meta.type"]) }}</v-icon>
            <!-- TODO scraper field -->
          </v-chip>
          <span>
            <v-btn @click="remove(i)" color="red" icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </span>
        </div>
      </v-list-item>
    </v-list>
    <div v-else class="mb-4 text-center">
      <v-icon large class="mb-2">mdi-card-off-outline</v-icon>
      <div>No meta added</div>
    </div>
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
          console.log(res.data);
          this.childMeta = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getIcon(type) {
      return Vue.prototype.$getIconDataType(type);
    },
    remove(index) {},
  },
  watch: {},
};
</script>