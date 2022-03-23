<template>
  <v-dialog v-if="dialog" :value="dialog" @input="close" width="400" scrollable>
    <v-card>
      <v-card-text class="text-center pt-8">
        <pre v-html="text" />
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-btn @click="close" class="pr-4" text>
          <v-icon left>mdi-close</v-icon> No
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="confirm" color="success" class="pr-4" depressed>
          <v-icon left>mdi-check</v-icon> Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
export default {
  name: "DialogConfirm",
  props: {
    dialog: Boolean,
    text: String,
  },
  methods: {
    close() {
      this.$emit("close");
    },
    confirm() {
      this.$emit("confirm");
    },
  },
};
</script>