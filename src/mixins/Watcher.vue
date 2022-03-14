<script>
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
      let extensions = [
        "3gp",
        "avi",
        "f4v",
        "flv",
        "m4v",
        "mkv",
        "mod",
        "mov",
        "mp4",
        "mpeg",
        "mpg",
        "mts",
        "rm",
        "rmvb",
        "swf",
        "ts",
        "vob",
        "webm",
        "wmv",
        "yuv",
      ];

      this.watcher.ws = new WebSocket(
        this.apiUrl.replace("http", "ws") + "/watcher"
      );

      this.watcher.ws.onopen = () => {
        const folders = JSON.stringify({
          type: "init",
          data: this.watcher.folders,
          extensions,
        });
        this.watcher.busy = true;
        this.watcher.ws.send(folders);
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
    updateWatcher() {
      if (this.sets.watchFolders !== "1") return;
      const folders = JSON.stringify({
        type: "update",
        data: this.watcher.folders,
      });
      this.watcher.busy = true;
      this.watcher.ws.send(folders);
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
    "watcher.folders"() {
      this.updateWatcher();
    },
  },
};
</script>