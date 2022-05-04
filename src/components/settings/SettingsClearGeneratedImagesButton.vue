<template>
  <div class="mx-4 d-inline">
    <div class="d-inline-flex flex-column text-center mb-4">
      <v-btn @click="dialogDelete = true" color="error" depressed rounded>
        <v-icon left>mdi-delete</v-icon> {{ button }}
      </v-btn>

      <div class="mt-2 body-2">
        <v-icon>mdi-harddisk</v-icon>
        {{ folderSize }}
      </div>
    </div>

    <DialogDeleteConfirm
      v-if="dialogDelete"
      @close="dialogDelete = false"
      @delete="clearData"
      :dialog="dialogDelete"
      :text="`This action will delete all generated images.\r Are you sure?`"
    />
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "SettingsClearData",
  props: {
    imageType: String,
    button: String,
  },
  components: {
    DialogDeleteConfirm: () =>
      import("@/components/dialogs/DialogDeleteConfirm.vue"),
  },
  mounted() {
    this.getFolderSize();
  },
  data: () => ({
    dialogDelete: false,
    folderSize: 0,
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    dialogProcess: {
      get() {
        return this.$store.state.Dialogs.process.show;
      },
      set(value) {
        this.$store.state.Dialogs.process.show = value;
      },
    },
  },
  methods: {
    getFolderSize() {
      axios({
        method: "post",
        url: this.apiUrl + "/api/task/getFolderSize",
        data: {
          folder: this.imageType,
        },
      }).then((res) => {
        const { size } = res.data;
        this.folderSize = (size / 1024 / 1024).toFixed(2) + " MB";
      });
    },
    async clearData() {
      this.dialogProcess = true;
      this.dialogDelete = false;

      await axios({
        method: "post",
        url: this.apiUrl + "/api/task/clearData",
        data: {
          imageType: this.imageType,
        },
      });

      this.getFolderSize();
      this.dialogProcess = false;
    },
  },
};
</script>