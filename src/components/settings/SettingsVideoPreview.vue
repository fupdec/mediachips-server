<template>
  <v-card outlined class="pb-4 px-4 mt-6 mx-2">
    <div class="headline text-center pt-4 pb-6">Video preview</div>
    <div class="d-flex align-center">
      <span class="mr-6">Static</span>
      <v-radio-group
        :value="sets.videoPreviewStatic"
        @change="setOption($event, 'videoPreviewStatic')"
        class="mt-0 pt-0"
        mandatory
        hide-details
        row
      >
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-radio v-bind="attrs" v-on="on" label="Thumb" value="thumb" />
          </template>
          <div class="d-flex flex-column align-center">
            <v-icon dark>mdi-image</v-icon>
            <span>Default thumb</span>
          </div>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-radio v-bind="attrs" v-on="on" value="grid">
              <template v-slot:label>
                <v-icon color="warning" small left>mdi-alert</v-icon>
                <div>Grid 3x3</div>
              </template>
            </v-radio>
          </template>
          <div class="d-flex flex-column align-center pb-2">
            <v-alert
              icon="mdi-alert"
              class="caption mt-2"
              dark
              text
              outlined
              dense
            >
              <span>
                This feature uses your CPU 100% during image generation. <br />
                Slow operation of the entire system is possible. Use on powerful
                processors.
              </span>
            </v-alert>
            <span>
              Will be generated automatically when the video page is opened.
            </span>
            <span>
              The spinner in the status bar is displayed while the generation
              process is in progress.
            </span>
            <span>
              When all the grids are ready, the cards will update automatically.
            </span>
          </div>
        </v-tooltip>
      </v-radio-group>
    </div>

    <div class="d-flex align-center mt-6">
      <span class="mr-6">On hover</span>
      <v-radio-group
        :value="sets.videoPreviewHover"
        @change="setOption($event, 'videoPreviewHover')"
        class="mt-0 pt-0"
        mandatory
        hide-details
        row
      >
        <v-radio label="None" value="none"></v-radio>

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-radio v-bind="attrs" v-on="on" value="timeline">
              <template v-slot:label>
                <v-icon color="warning" small left>mdi-alert</v-icon>
                <div>Timeline</div>
              </template>
            </v-radio>
          </template>
          <div class="d-flex flex-column align-center pb-2">
            <v-alert
              icon="mdi-alert"
              class="caption mt-2"
              dark
              text
              outlined
              dense
            >
              <span>
                This feature uses your CPU 100% during image generation.
                <br />
                Slow operation of the entire system is possible. Use on powerful
                processors.
              </span>
            </v-alert>
            <span>A frame from the video appears.</span>
            <span>The frame depends on the position of the cursor.</span>
            <span>
              Frames will be generated automatically when the video page is
              opened.
            </span>
            <span>
              The spinner in the status bar is displayed while the generation
              process is in progress.
            </span>
          </div>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-radio v-bind="attrs" v-on="on" label="Video" value="video" />
          </template>
          <div class="d-flex flex-column align-center">
            <v-icon dark>mdi-video</v-icon>
            <span>
              Sections from the video are played. <br />
              Not all video formats are supported
            </span>
          </div>
        </v-tooltip>
      </v-radio-group>
    </div>

    <v-slider
      v-if="sets.videoPreviewHover == 'video'"
      :value="sets.delayVideoPreview"
      @change="setOption($event, 'delayVideoPreview')"
      class="mt-4"
      min="0"
      max="5"
      thumb-size="24"
      thumb-label
      persistent-hint
      :hint="`Delay before starting playback (seconds)
          ${sets.delayVideoPreview}`"
    />
  </v-card>
</template>


<script>
import Vue from "vue";

export default {
  name: "SettingsVideoPreview",
  computed: {
    sets: {
      get() {
        return this.$store.state.settings;
      },
      set(value) {
        this.$store.state.settings = value;
      },
    },
  },
  methods: {
    async setOption(value, option) {
      this.sets[option] = value;
      await Vue.prototype.$setOption(option, value);
    },
  },
};
</script>