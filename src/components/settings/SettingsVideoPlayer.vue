<template>
  <div class="mx-4">
    <v-divider class="mt-4 mb-2" />
    <div class="subtitle-2 text-right mb-4">Video Player</div>

    <v-checkbox
      v-model="sets.isPlayVideoInSystemPlayer"
      @change="setOption($event, 'isPlayVideoInSystemPlayer')"
      false-value="0"
      true-value="1"
      class="mt-0"
    >
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Open video in system player</div>
          <div class="subtitle-2 mt-1">
            The built-in player is integrated into the application and has its
            own functions
          </div>
        </div>
      </template>
    </v-checkbox>

    <v-checkbox
      v-model="sets.restorePlaybackTime"
      @change="setOption($event, 'restorePlaybackTime')"
      false-value="0"
      true-value="1"
      class="mt-0"
    >
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Restore playback time</div>
          <div class="subtitle-2 mt-1">
            Start watching the video at the point of the previous playback
          </div>
        </div>
      </template>
    </v-checkbox>
  </div>
</template>


<script>
import Vue from "vue";

export default {
  name: "SettingsVideoPlayer",
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