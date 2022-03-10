<template>
  <v-dialog
    v-if="dialog"
    :value="dialog"
    @input="close"
    :fullscreen="$vuetify.breakpoint.xs"
    width="500"
    scrollable
  >
    <v-card>
      <DialogHeader
        @close="close"
        :header="`Adding Marker`"
        :buttons="buttons"
        closable
      />

      <v-card-text class="pa-2 pa-sm-4">
        <MetaInputArray
          @input="setVal($event)"
          :value="val"
          :metaId="meta.id"
          :multiple="false"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


<script>
import DialogHeader from "@/components/elements/DialogHeader.vue";
import MetaInputArray from "@/components/meta/input/MetaInputArray.vue";

export default {
  name: "DialogMarkAddingMeta",
  props: {
    dialog: Boolean,
    meta: Object,
  },
  components: {
    DialogHeader,
    MetaInputArray,
  },
  mounted() {
    this.initButtons();
  },
  data: () => ({
    val: null,
    buttons: [],
  }),
  methods: {
    initButtons() {
      this.buttons.push({
        icon: "plus",
        text: "Add",
        color: "success",
        outlined: false,
        function: () => {
          this.add();
        },
      });
    },
    setVal(val) {
      this.val = val;
    },
    add() {
      this.close();
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>