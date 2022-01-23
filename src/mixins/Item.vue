<script>
import Vue from "vue";

export default {
  computed: {
    selected: {
      get() {
        return this.$store.state.selected;
      },
      set(value) {
        this.$store.commit("updateState", {
          key: "selected",
          value: value,
        });
      },
    },
    isSelect() {
      return this.$store.state.isSelect;
    },
    isSelected() {
      return this.selected.includes(this.id);
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
      Vue.prototype.$showHoverImage(event, metaId, itemId);
    },
    toggleSelect() {
      const id = this.id;
      if (this.selected.includes(id)) {
        const x = this.selected.findIndex((i) => i == id);
        if (x > -1) this.selected.splice(x, 1);
      } else this.selected.push(id);
    },
  },
};
</script>