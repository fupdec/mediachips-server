<template>
  <v-dialog v-if="dialog" :value="dialog" @input="close">
    <v-card>
      <v-card-text class="text-center">
        <v-icon large color="error" class="py-6"> mdi-alert-outline </v-icon>
        <pre class="error--text" v-html="text" />
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-btn @click="close" plain>
          <v-icon left>mdi-close</v-icon> Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="del" color="error" plain>
          <v-icon left>mdi-check</v-icon> Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
export default {
  name: "DialogDeleteConfirm",
  props: {
    dialog: Boolean,
    text: String,
  },
  methods: {
    close() {
      this.$emit("close");
    },
    del() {
      this.$emit("delete");
    },
  },
};
</script>