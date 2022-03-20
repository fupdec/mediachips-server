<script>
import Vue from "vue";

export default {
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    page() {
      return this.$store.state.Page;
    },
    sets() {
      return this.$store.state.settings;
    },
    isMetaPage() {
      return Vue.prototype.$checkCurrentPage("meta");
    },
    isMediaPage() {
      return Vue.prototype.$checkCurrentPage("media");
    },
    isItemPage() {
      return Vue.prototype.$checkCurrentPage("item");
    },
    typeId() {
      return +this.$route.query.typeId;
    },
    metaId() {
      return +this.$route.query.metaId;
    },
    itemId() {
      return +this.$route.query.itemId;
    },
    mediaType() {
      const mediaTypes = this.$store.state.mediaTypes;
      if (mediaTypes.length == 0 || !this.typeId) return { type: null };
      else {
        const type = _.find(mediaTypes, (i) => i.id == this.typeId);
        this.$store.state.Dialogs.mediaEditing.mediaType = type;
        return type;
      }
    },
  },
};
</script>