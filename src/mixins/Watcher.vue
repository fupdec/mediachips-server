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
        this.watcher.ws.send(folders);
      };

      // event emmited when receiving message
      this.watcher.ws.onmessage = (msg) => {
        let data = JSON.parse(msg.data);
        this.watcher.updated = true;
        this.watcher.files = data;
      };
    },
  },
  watch: {
    "sets.watchFolders"() {
      if (this.watcher.ws) this.watcher.ws.close();
      else this.runWatcher();
    },
  },
};
</script>