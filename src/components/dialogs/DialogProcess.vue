<template>
  <v-dialog
    v-if="dialog"
    :value="dialog"
    :fullscreen="$vuetify.breakpoint.xs"
    width="600"
    scrollable
    persistent
  >
    <v-card>
      <v-card-text class="pa-4">
        <v-alert type="info" dense text class="body-2"> {{ text }}</v-alert>
        <Loading />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


<script>
export default {
  name: "DialogProcess",
  components: {
    Loading: () => import("@/components/elements/Loading.vue"),
  },
  props: {
    dialog: Boolean,
    text: {
      type: String,
      default:
        "Please wait until the end of the process. This may take several minutes.",
    },
  },
};
</script>