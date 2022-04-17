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
    mediaType() {
      const mediaTypes = this.$store.state.mediaTypes;
      const typeId = Vue.prototype.$getUrlParam("typeId")
      if (mediaTypes.length == 0 || !typeId) return { type: null };
      else {
        const type = _.find(mediaTypes, (i) => i.id == typeId);
        this.$store.state.Dialogs.mediaEditing.mediaType = type;
        return type;
      }
    },
  },
};
</script>