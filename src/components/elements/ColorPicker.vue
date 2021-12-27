<template>
  <v-dialog :value="dialog" @input="close" width="300">
    <v-card>
      <v-toolbar>
        <v-btn @click="apply" color="success" block depressed>
          <v-icon left>mdi-check</v-icon> apply
        </v-btn>
      </v-toolbar>
      <v-color-picker @update:color="changeColor($event)" :value="palette" />
    </v-card>
  </v-dialog>
</template>


<script>
export default {
  props: {
    dialog: Boolean,
    color: String,
  },
  name: "ColorPicker",
  mounted() {
    this.$nextTick(() => {
      this.palette = this.color;
    });
  },
  data: () => ({
    palette: "#ffab00",
  }),
  computed: {},
  methods: {
    changeColor(e) {
      this.palette = e.hex;
    },
    apply() {
      this.$emit("getColor", this.palette);
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>