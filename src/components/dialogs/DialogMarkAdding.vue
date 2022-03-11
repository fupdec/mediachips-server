<template>
  <v-dialog
    v-model="markAdding.show"
    :attach="p.fullscreen ? '.player' : false"
    content-class="dialog-overflow-visible dialog-position-start"
    overlay-opacity="0.2"
    width="500"
    scrollable
  >
    <v-card>
      <DialogHeader
        @close="markAdding.show = false"
        :header="`Adding Marker`"
        :buttons="buttons"
        closable
      />

      <v-card-text class="pa-2 pa-sm-4">
        <div class="mb-4">
          <span class="body-1" v-text="`Time:`" />
          <v-chip v-text="msToTime(markAdding.time)" class="mx-4" />
          <v-btn @click="changeTime(-1)" icon small>
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <v-btn @click="changeTime(1)" class="ml-2" icon small>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="getTime" class="ml-2" icon small>
                <v-icon>mdi-sync</v-icon>
              </v-btn>
            </template>
            <span> Sync with current time </span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="jumpTo" class="ml-2" icon>
                <v-icon>mdi-redo</v-icon>
              </v-btn>
            </template>
            <span> Jump to time </span>
          </v-tooltip>
          <v-btn @click="togglePause" class="ml-2" icon>
            <v-icon v-if="p.paused">mdi-play</v-icon>
            <v-icon v-else>mdi-pause</v-icon>
          </v-btn>
        </div>

        <v-form v-if="markAdding.type == 'bookmark'" ref="form" v-model="valid">
          <v-textarea
            v-model="text"
            :rules="[(v) => !!v || 'Text is required']"
            label="Text"
            outlined
            required
            autofocus
            no-resize
          />
        </v-form>

        <div v-else class="mark-adding">
          <MetaInputArray
            @input="setVal($event)"
            :value="val"
            :metaId="markAdding.meta.id"
            :multiple="false"
            :autofocus="true"
            :menuProps="
              p.fullscreen
                ? {
                    contentClass: 'custom-list',
                    nudgeBottom: '138px',
                    nudgeRight: '15px',
                    maxHeight: '30vh',
                  }
                : { contentClass: 'custom-list' }
            "
            :attach="p.fullscreen ? '.mark-adding' : false"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


<script>
import Vue from "vue";
import DialogHeader from "@/components/elements/DialogHeader.vue";
import MetaInputArray from "@/components/meta/input/MetaInputArray.vue";

export default {
  name: "DialogMarkAdding",
  props: {
    dialog: Boolean,
    meta: Object,
  },
  components: {
    DialogHeader,
    MetaInputArray,
  },
  mounted() {
    this.initButtons();
  },
  data: () => ({
    val: null,
    text: null,
    valid: false,
    buttons: [],
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    markAdding: {
      get() {
        return this.$store.state.Dialogs.markAdding;
      },
      set(value) {
        this.$store.state.Dialogs.markAdding = value;
      },
    },
    p: {
      get() {
        return this.$store.state.Player;
      },
      set(value) {
        this.$store.state.Player = value;
      },
    },
  },
  methods: {
    initButtons() {
      this.buttons.push({
        icon: "plus",
        text: "Add",
        color: "success",
        outlined: false,
        function: () => {
          this.add();
        },
      });
    },
    msToTime(time) {
      return Vue.prototype.$getReadableDuration(time);
    },
    changeTime(v) {
      let time = this.markAdding.time;
      if (v < 0 && time < 2) return;
      else if (v > 0 && time > this.p.duration - 2) return;
      this.markAdding.time += v;
    },
    getTime() {
      this.markAdding.time = this.p.currentTime;
    },
    jumpTo() {
      let time = this.markAdding.time;
      this.$store.dispatch("playerJumpTo", { time });
    },
    togglePause() {
      this.$emit("togglePause");
    },
    setVal(val) {
      this.val = val;
    },
    add() {
      if (this.markAdding.type == "bookmark") {
        this.$refs.form.validate();
        if (!this.valid) return;
      } else if (!this.val) return;

      let data = {};
      if (this.markAdding.type == "bookmark") data.text = this.text;
      else data.itemId = this.val;

      this.$emit("addMark", data);
      this.markAdding.show = false;
    },
  },
};
</script>