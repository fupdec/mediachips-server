<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn @click="dialog = true" v-on="on" icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-dialog v-model="dialog" scrollable width="600">
        <v-text-field
          label="Enter text..."
          autofocus
          solo
          rounded
          hide-details
          append-icon="mdi-magnify"
        />
      </v-dialog>
    </template>
    <span> Global Search </span>
  </v-tooltip>
</template>


<script>
export default {
  name: "GlobalSearch",
  data: () => ({
    dialog: false,
  }),
  mounted() {
    this.$nextTick(() => {});
  },
  computed: {},
  methods: {},
};
</script>