<template>
  <v-container>
    <v-switch label="Dark mode" v-model="darkMode"></v-switch>
    
    <vuescroll>
      <div style="max-height: 400px">
        <TableMetaInMediaTypes />
      </div>
    </vuescroll>
  </v-container>
</template>


<script>
import vuescroll from "vuescroll";
import TableMetaInMediaTypes from "@/components/settings/TableMetaInMediaTypes.vue";

export default {
  name: "Settings",
  components: {
    vuescroll,
    TableMetaInMediaTypes,
  },
  mounted() {
    this.$nextTick(() => {
      this.darkMode = this.$vuetify.theme.dark;
    });
  },
  data: () => ({
    darkMode: false,
  }),
  computed: {},
  methods: {},
  watch: {
    darkMode() {
      this.$vuetify.theme.dark = this.darkMode;
    },
  },
};
</script>