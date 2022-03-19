<script>
import Vue from "vue";

export default {
  computed: {
    watcher: {
      get() {
        return this.$store.state.Watcher;
      },
      set(value) {
        this.$store.state.Watcher = value;
      },
    },
  },
  methods: {
    runWatcher() {
      if (this.sets.watchFolders !== "1") return;

      this.watcher.ws = new WebSocket(
        this.apiUrl.replace("http", "ws") + "/watcher"
      );

      this.watcher.ws.onopen = () => {
        const watchedFolders = this.watcher.folders.filter((x) => x.watch);
        let exts = Vue.prototype.$getWatchedFoldersExtensions(watchedFolders);
        const data = JSON.stringify({
          type: "start",
          folders: watchedFolders,
          extensions: exts,
        });
        this.watcher.busy = true;
        this.watcher.ws.send(data);
      };

      // event emmited when receiving message
      this.watcher.ws.onmessage = (msg) => {
        this.watcher.busy = false;
        msg = JSON.parse(msg.data);
        switch (msg.type) {
          case "files":
            this.watcher.files = msg.data;
            break;
          case "closed":
            this.watcher.ws.close();
            break;
        }
      };
    },
    updateWatcher(watchedFolders) {
      if (this.sets.watchFolders !== "1") return;
      let exts = Vue.prototype.$getWatchedFoldersExtensions(watchedFolders);
      const data = JSON.stringify({
        type: "update",
        folders: watchedFolders,
        extensions: exts,
      });
      this.watcher.busy = true;
      this.watcher.ws.send(data);
    },
    stopWatcher() {
      const msg = JSON.stringify({
        type: "stop",
      });
      this.watcher.busy = true;
      this.watcher.ws.send(msg);
    },
  },
  watch: {
    "sets.watchFolders"(val) {
      if (val == "0" && this.watcher.ws && this.watcher.ws.readyState == 1)
        this.stopWatcher();
      else this.runWatcher();
    },
    "watcher.folders"(val) {
      this.updateWatcher(val.filter((x) => x.watch));
    },
  },
};
</script>