<template>
  <div class="dialog-header">
    <div class="content">
      <div class="headline ma-sm-4 ma-2">{{ header }}</div>

      <div class="actions ma-sm-4 ma-2">
        <v-btn v-if="closable" @click="close" outlined>
          <v-icon left>mdi-close</v-icon> Close
        </v-btn>

        <v-btn
          v-for="(i, x) of buttons"
          :key="x"
          @click="i.function"
          :color="i.color"
          :outlined="i.outlined"
          depressed
          class="ml-sm-4 ml-2"
        >
          <v-icon left>mdi-{{ i.icon }}</v-icon> {{ i.text }}
        </v-btn>
      </div>
    </div>

    <v-divider></v-divider>
  </div>
</template>


<script>
export default {
  name: "DialogHeader",
  props: {
    header: String,
    buttons: Array || [],
    closable: Boolean,
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>


<style lang="scss" scoped>
.dialog-header {
  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .headline {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }
}
@media (max-width: 480px) {
  .dialog-header {
    .content {
      flex-wrap: wrap;
    }
    .headline {
      margin-bottom: 0 !important;
    }
    .actions {
      justify-content: space-between;
    }
  }
}
</style>