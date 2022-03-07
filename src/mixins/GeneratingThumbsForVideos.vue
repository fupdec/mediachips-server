<script>
import axios from "axios";
import Vue from "vue";

export default {
  beforeDestroy() {
    this.grid.stopped = true;
    this.timeline.stopped = true;
  },
  mounted() {
    this.$nextTick(() => {});
  },
  data: () => ({
    grid: {
      active: false,
      stopped: false,
    },
    timeline: {
      active: false,
      stopped: false,
    },
    timeout: null,
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    tasks: {
      get() {
        return this.$store.state.Tasks.list;
      },
      set(val) {
        this.$store.state.Tasks.list = val;
      },
    },
    isMediaPage() {
      return Vue.prototype.$checkCurrentPage("media");
    },
    isItemPage() {
      return Vue.prototype.$checkCurrentPage("item");
    },
  },
  methods: {
    async createGrids(videos) {
      this.grid.active = true;
      const id = await this.$store.dispatch("setTask", {
        text: "Generating grids images",
        icon: "apps",
        action: () => {
          this.grid.stopped = true;
        },
      });

      let x = 0;
      for (const video of videos) {
        ++x;
        if (this.grid.stopped) break;
        this.$store.dispatch("updateTask", {
          id,
          data: {
            subtitle: `${x} of ${videos.length}`,
            progress: 100 / videos.length * x,
          },
        });
        try {
          await this.createVideoGrid(video.path, `${video.id}.jpg`);
        } catch (error) {
          // console.log(error)
        }
      }

      // TODO rerender items if grid is created
      this.grid.active = false;
      this.$store.dispatch("removeTask", id);
    },
    /**
     * Creating an image by taking a frame from a video.
     * @param {string} input - full path to video file.
     * @param {string} output - name of generated grid image.
     */
    createVideoGrid(input, output) {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: this.apiUrl + "/api/Task/createGrid",
          data: {
            input: input,
            output: output,
            width: 180,
            cols: 3,
            rows: 3,
          },
        })
          .then((res) => {
            resolve(res);
          })
          .catch((e) => {
            // console.log(e);
            reject(e);
          });
      });
    },
    async createTimelines(videos) {
      this.timeline.active = true;
      const id = await this.$store.dispatch("setTask", {
        text: "Generating timeline images",
        icon: "view-column",
        action: () => {
          this.timeline.stopped = true;
        },
      });

      let x = 0;
      for (const video of videos) {
        ++x;
        if (this.timeline.stopped) break;
        await this.$store.dispatch("updateTask", {
          id,
          data: {
            subtitle: `${x} of ${videos.length}`,
            progress: 100 / videos.length * x,
          },
        });
        // const frame = path.join(`/userfiles/media/timelines/${video.id}_5.jpg`);
        try {
          await this.createVideoTimeline(video);
        } catch (error) {
          // console.log(error)
        }
      }

      this.timeline.active = false;
      this.$store.dispatch("removeTask", id);
    },
    createVideoTimeline(video) {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: this.apiUrl + "/api/Task/createTimeline",
          data: video,
        })
          .then((res) => {
            this.$root.$emit("updateVideoFrames", video.id);
            resolve(res);
          })
          .catch((e) => {
            // console.log(e);
            reject(e);
          });
      });
    },
    generateImages(videos) {
      clearInterval(this.timeout);
      this.grid.stopped = false;
      this.timeline.stopped = false;
      this.timeout = setTimeout(() => {
        if (!this.grid.active) {
          if (this.$store.state.settings.videoPreviewStatic == "grid")
            this.createGrids(videos);
        }
        if (!this.timeline.active) {
          if (
            this.$store.state.settings.videoPreviewHover == "timeline" ||
            this.$store.state.settings.videoView == "0"
          )
            this.createTimelines(videos);
        }
      }, 3000);
    },
  },
  watch: {
    itemsOnPage(videos) {
      if (this.isMediaPage || this.isItemPage) this.generateImages(videos);
    },
  },
};
</script>