<template>
  <v-dialog
    v-if="dialog"
    @input="close"
    :value="dialog"
    :fullscreen="$vuetify.breakpoint.xs"
    scrollable
    width="800"
  >
    <v-card>
      <DialogHeader
        @close="close"
        header="Adding filter"
        :buttons="[
          {
            icon: 'plus',
            text: 'Add',
            color: 'success',
            outlined: false,
            function: () => {
              this.add();
            },
          },
        ]"
        closable
      />

      <v-card-text class="pt-4">
        <v-chip-group v-model="selected" color="primary" column multiple>
          <v-chip v-for="(i, x) in params" :key="x" outlined>
            <v-icon size="20" left>mdi-{{ i.icon }}</v-icon>
            {{ i.text }}
            <v-icon right small>{{ getIcon(i.type) }}</v-icon>
          </v-chip>
        </v-chip-group>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


<script>
import Vue from "vue";
import axios from "axios";
import DialogHeader from "@/components/elements/DialogHeader.vue";

export default {
  name: "DialogFiltersAdd",
  props: {
    dialog: Boolean,
    params: Array,
  },
  components: {
    DialogHeader,
  },
  mounted() {},
  data: () => ({
    selected: [],
  }),
  computed: {},
  methods: {
    add() {
      let params = this.params.filter((i, x) => this.selected.includes(x));
      this.$emit("add", params);
    },
    close() {
      this.$emit("close");
    },
    getIcon(type) {
      return Vue.prototype.$getIconDataType(type);
    },
  },
};
</script>