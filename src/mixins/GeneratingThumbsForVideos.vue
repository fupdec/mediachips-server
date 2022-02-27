<script>
import axios from "axios";
import Vue from "vue";

export default {
  beforeDestroy() {
    this.isGenBreak = true;
  },
  mounted() {
    this.$nextTick(() => {});
  },
  data: () => ({
    isGenGridsRun: false,
    isGenTimelinesRun: false,
    isGenBreak: false,
    numberOfCreatedGrid: 0,
    genTimeout: null,
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    tasks: {
      get() {
        return this.$store.state.tasks;
      },
      set(val) {
        this.$store.commit("updateState", {
          key: "tasks",
          value: val,
        });
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
      this.isGenGridsRun = true;
      const taskId = Vue.prototype.$getRandomId();
      this.tasks.push({
        id: taskId,
        text: "Generating grids images",
        icon: "apps",
      });

      const x = this.tasks.findIndex((i) => i.id === taskId);
      for (let i = 0; i < videos.length; i++) {
        if (this.isGenBreak) break;
        if (x > -1)
          this.tasks[x].text = `Generating grids images ${i + 1} of ${
            videos.length
          }`;
        const video = videos[i];
        try {
          await this.createVideoGrid(video.path, `${video.id}.jpg`);
        } catch (error) {
          // console.log(error)
        }
      }

      // TODO rerender items if grid is created
      //   if (this.numberOfCreatedGrid) this.$store.commit("updateVideos");
      this.numberOfCreatedGrid = 0;
      this.isGenGridsRun = false;
      this.tasks.splice(x, 1);
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
            ++this.numberOfCreatedGrid;
            resolve(res);
          })
          .catch((e) => {
            // console.log(e);
            reject(e);
          });
      });
    },
    async createTimelines(videos) {
      this.isGenTimelinesRun = true;
      const taskId = Vue.prototype.$getRandomId();
      this.tasks.push({
        id: taskId,
        text: "Generating timelines images",
        icon: "view-carousel",
      });

      const x = this.tasks.findIndex((i) => i.id === taskId);
      for (let i = 0; i < videos.length; i++) {
        if (this.isGenBreak) break;
        if (x > -1)
          this.tasks[x].text = `Generating timelines images ${i + 1} of ${
            videos.length
          }`;
        const video = videos[i];
        // const frame = path.join(`/userfiles/media/timelines/${video.id}_5.jpg`);
        try {
          await this.createVideoTimeline(video);
        } catch (error) {
          // console.log(error)
        }
      }

      this.isGenTimelinesRun = false;
      this.tasks = this.tasks.slice(x, 0);
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
      clearInterval(this.genTimeout);
      this.isGenBreak = true;
      this.genTimeout = setTimeout(() => {
        this.isGenBreak = false;
        if (!this.isGenGridsRun) {
          if (this.$store.state.settings.videoPreviewStatic == "grid")
            this.createGrids(videos);
        }
        if (!this.isGenTimelinesRun) {
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