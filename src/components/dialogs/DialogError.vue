<template>
  <v-dialog
    v-model="$store.state.Dialogs.error.show"
    @input="close"
    width="400"
    scrollable
  >
    <v-card>
      <v-card-text class="text-center">
        <v-icon large color="error" class="py-6"> mdi-alert-octagon </v-icon>
        <pre class="error--text" v-html="$store.state.Dialogs.error.text" />
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-spacer></v-spacer>
        <v-btn @click="close" class="pr-4" text>
          <v-icon left>mdi-close</v-icon> Close
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
export default {
  name: "DialogError",
  methods: {
    close() {
      this.$store.state.Dialogs.error.show = false;
      this.$store.state.Dialogs.error.text = null;
    },
  },
};
</script>