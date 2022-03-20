<script>
import axios from "axios";
import Vue from "vue";

export default {
  beforeDestroy() {
    this.$root.$off("addMedia");
    this.task.stopped = true;
  },
  mounted() {
    this.$root.$on("addMedia", () => {
      this.addMedia();
    });
  },
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    task: {
      get() {
        return this.$store.state.Tasks.mediaAdding;
      },
      set(value) {
        this.$store.state.Tasks.mediaAdding = value;
      },
    },
  },
  methods: {
    async addMedia() {
      this.task.active = true;
      this.task.status = "Scanning files...";
      this.task.processed = "";
      this.task.progress = 0;
      this.task.stopped = false;
      this.task.finished = false;
      this.task.current = 0;
      this.task.total = 0;
      this.task.errors = [];
      this.task.duplicates = [];
      this.task.added = [];

      const taskId = await this.$store.dispatch("setTask", {
        text: "Adding media",
        icon: "file-plus",
        click: () => {
          this.task.dialogProcess = true;
        },
        action: () => {
          this.task.stopped = true;
        },
      });

      const mediaTypes = this.$store.state.mediaTypes;
      const typeId = +this.$route.query.typeId;
      const mediaType = _.find(mediaTypes, i=>i.id == typeId);
      const extensions = mediaType.extensions.split(",");
      const regex = "." + extensions.join("$|.") + "$";
      const regexString = JSON.stringify(regex);
      const paths = Vue.prototype.$transformTextToArray(this.task.paths);
      let files = [];
      for (const entryPath of paths) {
        await axios({
          method: "post",
          url: this.apiUrl + "/api/Task/getFileList",
          data: {
            path: entryPath,
            filter: regexString,
          },
        })
          .then((res) => {
            files = files.concat(res.data);
          })
          .catch((e) => {
            // console.log(e);
          });
      }

      this.task.status = `Gathering metadata and adding media to the database...`;
      this.task.total = files.length;
      let percentage = 100 / files.length;
      const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };

      let itemsInMedia = [];
      for (const filePath of files) {
        if (this.task.stopped) break; // stop process

        await axios({
          method: "post",
          url: this.apiUrl + "/api/Task/addMedia" + mediaType.type,
          data: {
            path: filePath,
            type: mediaType,
          },
        })
          .then((res) => {
            this.task.added.push(filePath);
            const vals = Vue.prototype.$parseFilePath(filePath, res.data.id);
            itemsInMedia = [...itemsInMedia, ...vals];
          })
          .catch((e) => {
            this.task.errors.push(filePath);
            // console.log(e);
          });

        ++this.task.current;
        this.task.processed = `Processed: ${this.task.current} / ${this.task.total}`;
        this.task.progress += percentage;
        if (this.task.progress > 100) this.task.progress = 100;
        await sleep(10);
        await this.$store.dispatch("updateTask", {
          id: taskId,
          data: {
            subtitle: `${this.task.current} of ${this.task.total}`,
            progress: this.task.progress,
          },
        });
      }

      // adding parsed items of media
      this.task.status = `Adding metadata to media...`;
      await axios({
        method: "post",
        url: this.apiUrl + "/api/ItemsInMedia",
        data: itemsInMedia,
      });

      if (!this.task.dialogProcess) {
        if (this.task.added.length > 0)
          this.$store.commit("setNotification", {
            type: "success",
            text: `Added ${this.task.added.length} media`,
          });
        else
          this.$store.commit("setNotification", {
            type: "info",
            text: `No new media found`,
          });
      }
      this.task.finished = true;
      this.task.active = false;
      this.task.status = "Adding media is complete!";
      this.$store.dispatch("removeTask", taskId);
      this.$root.$emit("getItemsFromDb", []);
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>