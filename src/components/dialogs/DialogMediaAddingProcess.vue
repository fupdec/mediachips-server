<template>
  <v-dialog
    v-if="dialog"
    :value="dialog"
    @input="close"
    :fullscreen="$vuetify.breakpoint.xs"
    scrollable
    width="800"
  >
    <v-card>
      <DialogHeader
        @close="close"
        :header="`Adding media`"
        :buttons="buttons"
        closable
      />

      <v-progress-linear v-if="task.active" height="2" indeterminate reverse />

      <v-card-actions class="pa-4">
        <v-progress-linear
          v-model="task.progress"
          :class="{ active: task.active }"
          class="progress-striped"
          height="20"
          rounded
        >
          <template v-slot="{ value }">
            <strong class="process-percents">{{ Math.ceil(value) }} %</strong>
          </template>
        </v-progress-linear>
      </v-card-actions>
      <div class="d-flex justify-space-between px-4">
        <div>{{ task.status }}</div>
        <div class="text--secondary caption">{{ task.processed }}</div>
      </div>

      <v-card-text class="pa-4">
        <div v-if="task.added.length > 0" class="mb-4">
          <v-chip
            v-text="`Added: ${task.added.length}`"
            color="success"
            class="mb-2"
            small
          />
          <v-card outlined class="pa-2">
            <v-virtual-scroll
              :height="task.added.length > 10 ? 150 : task.added.length * 15"
              :items="task.added"
              class="virtual-scroller"
              item-height="15"
            >
              <template v-slot:default="{ item }">
                <div class="caption">{{ item }}</div>
              </template>
            </v-virtual-scroll>
          </v-card>
        </div>

        <div v-if="task.errors.length > 0">
          <v-chip
            v-text="`Errors: ${task.errors.length}`"
            color="error"
            class="mb-2"
            small
          />
          <v-card outlined class="pa-2">
            <v-virtual-scroll
              :height="task.errors.length > 10 ? 150 : task.errors.length * 15"
              :items="task.errors"
              class="virtual-scroller"
              item-height="15"
            >
              <template v-slot:default="{ item }">
                <div class="caption">{{ item }}</div>
              </template>
            </v-virtual-scroll>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


<script>
import DialogHeader from "@/components/elements/DialogHeader.vue";

export default {
  name: "DialogMediaAddingProcess",
  props: {
    dialog: Boolean,
  },
  components: {
    DialogHeader,
  },
  mounted() {
    this.initButtons();
    this.task.active = true;
  },
  data: () => ({
    buttons: [],
  }),
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
    initButtons() {
      this.buttons.push({
        icon: "stop",
        text: "Stop",
        color: "error",
        outlined: false,
        function: () => {
          this.stop();
        },
      });
    },
    stop() {
      this.task.stopped = true;
      this.buttons = [];
    },
    close() {
      this.$emit("close");
    },
  },
  watch: {
    "task.finished"() {
      this.buttons = [];
      this.task.progress = 100;
    },
  },
};
</script>


<style lang="scss">
.progress-striped {
  .v-progress-linear__determinate {
    &.primary {
      overflow: hidden;
      position: absolute;
      &:after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        background-image: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.25) 25%,
          transparent 0,
          transparent 50%,
          rgba(255, 255, 255, 0.25) 0,
          rgba(255, 255, 255, 0.25) 75%,
          transparent 0,
          transparent
        );
        background-size: 40px 40px;
        background-repeat: repeat;
        transition: width 4s ease-in-out;
        height: 100%;
        width: 100%;
      }
    }
  }
  &.active {
    .v-progress-linear__determinate {
      &.primary {
        &:after {
          animation: cssProgressActive 2s linear infinite;
        }
      }
    }
  }
  &[aria-valuenow="100"] {
    .v-progress-linear__determinate {
      &.primary {
        &:after {
          animation-play-state: paused;
        }
      }
    }
  }
}
.process-percents {
  background-color: rgba(255, 255, 255, 0.5);
  padding: 1px 4px 1px;
  border-radius: 10px;
  line-height: 1;
}

@keyframes cssProgressActive {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 40px 40px;
  }
}
</style>