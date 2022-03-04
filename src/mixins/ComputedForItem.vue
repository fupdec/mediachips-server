<script>
import Vue from "vue";

export default {
  computed: {
    selection: {
      get() {
        return this.$store.state.Page.selection;
      },
      set(value) {
        this.$store.commit("updateStatePage", {
          key: "selection",
          value: value,
        });
      },
    },
    isSelected() {
      return this.selection.includes(this.id);
    },
    id() {
      return this.item ? this.item.id : this.video.id;
    },
  },
  methods: {
    stopSmoothScroll(event) {
      if (event.button != 1) return;
      event.preventDefault();
      event.stopPropagation();
    },
    hoverImage(event, metaId, itemId) {
      clearTimeout(this.$store.state.hover.timeout);
      this.$store.state.hover.timeout = setTimeout(() => {
        Vue.prototype.$showHoverImage(event, metaId, itemId);
      }, 500);
    },
    hideHoverImage() {
      clearTimeout(this.$store.state.hover.timeout);
      this.$store.state.hover.show = false
    },
    toggleSelect() {
      const id = this.id;
      if (this.selection.includes(id)) {
        const x = this.selection.findIndex((i) => i == id);
        if (x > -1) this.selection.splice(x, 1);
      } else this.selection.push(id);
    },
  },
};
</script>