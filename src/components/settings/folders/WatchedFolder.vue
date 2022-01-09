<template>
  <v-list-item class="folder-list">
    <div class="folder-item">
      <div v-if="edit" class="name">
        <v-btn
          @click="edit = false"
          class="mr-1"
          color="red"
          icon
          fab
          x-small
          title="Cancel"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-text-field
          v-model="folderName"
          class="d-inline-flex"
          hide-details
          outlined
          dense
        />
        <v-btn
          @click="rename"
          :disabled="folderName == ''"
          class="ml-1"
          color="green"
          icon
          fab
          x-small
          title="Save folder name"
        >
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </div>
      <div v-else class="name">
        <v-btn
          @click="(edit = true), (folderName = folder.name)"
          class="mr-1"
          icon
          fab
          x-small
          title="Edit folder name"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-chip label outlined :title="folder.name">
          <span>{{ folder.name }}</span>
        </v-chip>
      </div>
      <v-chip
        @click="open"
        label
        outlined
        class="path"
        :title="`Open in explorer: ${folder.path}`"
      >
        <v-icon left class="icon-closed">mdi-folder</v-icon>
        <v-icon left class="icon-open">mdi-folder-open</v-icon>
        <span>{{ folder.path }}</span>
      </v-chip>
    </div>
    <v-switch
      v-model="folder.watch"
      @change="toggle"
      class="ml-4 mt-0 pt-0"
      hide-details
      title="Toggle watch"
    />
    <v-btn
      @click="remove"
      class="ml-2"
      color="red"
      icon
      fab
      x-small
      title="Remove folder"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-list-item>
</template>


<script>
export default {
  props: {
    folder: Object,
  },
  mounted() {
    this.$nextTick(async () => {});
  },
  data: () => ({
    edit: false,
    folderName: "",
  }),
  computed: {},
  methods: {
    rename() {
      this.$emit("rename");
    },
    toggle() {
      this.$emit("toggle");
    },
    remove() {
      this.$emit("remove");
    },
    open() {
      this.$emit("open");
    },
  },
};
</script>