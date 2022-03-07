<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn @click="openDialog" v-on="on" icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <DialogMediaAdding
        v-if="dialogAdd"
        @close="dialogAdd = false"
        :dialog="dialogAdd"
      />
    </template>

    <span> Add New {{ page.name }} </span>
  </v-tooltip>
</template>


<script>
export default {
  name: "ItemsAdd",
  components: {
    DialogMediaAdding: () =>
      import("@/components/dialogs/DialogMediaAdding.vue"),
  },
  mounted() {},
  data: () => ({
    dialogAdd: false,
  }),
  computed: {
    page() {
      return this.$store.state.Page;
    },
    task: {
      get() {
        return this.$store.state.Tasks.mediaAdding;
      },
      set(value) {
        this.$store.state.Tasks.mediaAdding = value;
      },
    },
  },
  methods: {
    openDialog() {
      if (this.task.active) this.task.dialogProcess = true;
      else this.dialogAdd = true;
    },
  },
};
</script>