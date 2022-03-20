<template>
  <v-lazy>
    <v-card
      :disabled="!reg && x > 9"
      @contextmenu.stop="showMenu"
      @mousedown="stopSmoothScroll($event)"
      v-ripple="{ class: 'primary--text' }"
      :class="{ favorite: media.favorite }"
      class="media-card meta-card"
      outlined
      hover
    >
      <v-img @click="openPath(media.path)" :src="thumb">
        <div v-if="!reg && x > 9" class="reg-block">
          <div>App not registered</div>
        </div>

        <v-btn
          :color="isFileExists ? 'white' : 'error'"
          class="btn-play"
          icon
          fab
        >
          <v-icon x-large>mdi-play</v-icon>
        </v-btn>

        <v-rating
          :value="media.rating"
          @input="setVal($event, 'rating')"
          color="yellow darken-2"
          background-color="#eee"
          class="rating"
          empty-icon="mdi-star-outline"
          half-icon="mdi-star-half-full"
          dense
          half-increments
          hover
          clearable
        />

        <v-checkbox
          v-model="media.favorite"
          @change="setVal($event, 'favorite')"
          :false-value="0"
          :true-value="1"
          off-icon="mdi-heart-outline"
          on-icon="mdi-heart"
          color="pink"
          class="ma-0 pa-0 fav-btn"
          hide-details
          dark
        />

        <v-btn @click.stop="edit" color="primary" class="btn-edit" small fab>
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-img>

      <div class="description">
        <div class="media-card-title" :title="fileName" v-html="fileName" />

        <NestedItems
          :item="media"
          :items="items"
          :values="values"
          :metadata="nestedMetadata"
          type="image"
        />
      </div>

      <v-icon
        v-if="media.bookmark"
        class="bookmark"
        color="red"
        :title="media.bookmark"
        v-html="'mdi-bookmark'"
      />

      <v-overlay
        :value="page.isSelect"
        @click.stop="toggleSelect"
        :color="isSelected ? 'primary' : '#7777'"
        z-index="1"
        absolute
      >
        <v-icon v-if="isSelected" size="50">
          mdi-checkbox-marked-outline
        </v-icon>
      </v-overlay>
    </v-card>
  </v-lazy>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import ComputedForItem from "@/mixins/ComputedForItem";
import NestedItems from "@/components/items/NestedItems.vue";

export default {
  name: "ItemImage",
  props: {
    media: Object,
    reg: Boolean,
    upd: Array,
    x: Number,
  },
  components: {
    NestedItems,
  },
  mixins: [ComputedForItem],
  async beforeMount() {
    await this.getItems();
    await this.getValues();
    await this.getImg();
    await this.checkFileExists();
  },
  data: () => ({
    items: [],
    values: [],
    thumb: null,
    isFileExists: true,
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    fileName() {
      return Vue.prototype.$getFileNameFromPath(this.media.path);
    },
    page() {
      return this.$store.state.Page;
    },
    sets() {
      return this.$store.state.settings;
    },
    nestedMetadata() {
      return {
        filesize: Vue.prototype.$getReadableFileSize(this.media.filesize),
        fileExtension: Vue.prototype.$getFileExtensionFromPath(this.media.path),
      };
    },
  },
  methods: {
    async getImg() {
      this.thumb = await Vue.prototype.$getLocalImage(this.media.path, true);
    },
    getItems() {
      let url = `/api/ItemsInMedia?mediaId=${this.media.id}`;
      axios
        .get(this.apiUrl + url)
        .then((res) => {
          this.items = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getValues() {
      let url = `/api/ValuesInMedia?mediaId=${this.media.id}`;
      axios
        .get(this.apiUrl + url)
        .then((res) => {
          this.values = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    edit() {
      this.$store.state.Dialogs.mediaEditing.show = true;
      this.$store.state.Dialogs.mediaEditing.media = this.media;
    },
    async checkFileExists() {
      let res = await Vue.prototype.$checkFileExists(this.media.path);
      this.isFileExists = res.status == 201;
    },
    async setVal(val, key) {
      await axios({
        method: "put",
        url: this.apiUrl + "/api/media/" + this.media.id,
        data: {
          [key]: val,
        },
      });
      this.$root.$emit("getItemsFromDb", []);
    },
    showMenu(e) {
      e.preventDefault();
      let contextMenu = [];
      contextMenu.push({
        name: `Edit`,
        type: "item",
        icon: "pencil",
        action: () => {
          this.edit();
        },
      });
      contextMenu.push({ type: "divider" });
      if (!this.page.isSelect)
        contextMenu.push({
          name: `Open File`,
          type: "item",
          icon: "file",
          disabled: !this.isFileExists,
          action: () => {
            this.openPath(this.media.path);
          },
        });
      if (!this.page.isSelect)
        contextMenu.push({
          name: `Open file folder`,
          type: "item",
          icon: "folder-open",
          disabled: !this.isFileExists,
          action: () => {
            this.openPath(this.media.path, true);
          },
        });
      contextMenu.push({ type: "divider" });
      contextMenu.push({
        name: `Delete`,
        type: "item",
        icon: "delete",
        color: "red",
        action: () => {
          this.dialogDeleting = true;
        },
      });
      this.$store.dispatch("showContextMenu", {
        x: e.clientX,
        y: e.clientY,
        content: contextMenu,
      });
    },
    openPath(entryPath, isDir) {
      if (!this.isFileExists) return;
      Vue.prototype.$openPath(entryPath, isDir);
    },
  },
  watch: {
    upd(arr) {
      if (arr.includes(this.media.id)) {
        this.getItems();
        this.getValues();
      }
    },
  },
};
</script>