<template>
  <div>
    <v-dialog v-model="dialogHeaderGradient" width="600" scrollable persistent>
      <v-card>
        <v-card
          class="d-flex justify-space-between"
          :style="{ background: gradient }"
          :light="!themeDark"
          :dark="themeDark"
          elevation="0"
        >
          <div class="headline ma-4">
            Gradient for {{ themeDark ? "dark" : "light" }} theme
          </div>
          <div
            class="
              d-flex
              flex-sm-row flex-column-reverse
              justify-end
              ma-sm-4 ma-2
            "
          >
            <v-btn @click="close" outlined>
              <v-icon left>mdi-close</v-icon> Cancel
            </v-btn>
            <v-spacer class="ma-sm-2 ma-1"></v-spacer>
            <v-btn @click="apply" color="success" depressed>
              <v-icon left>mdi-check</v-icon> Apply
            </v-btn>
          </div>
        </v-card>

        <v-card-text class="py-4">
          <draggable v-model="colors" v-bind="dragOptions">
            <transition-group>
              <div
                v-for="(color, index) in colors"
                :key="color.id"
                class="d-flex justify-center align-center mb-4"
              >
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon class="mr-4">
                      <v-icon>mdi-drag</v-icon>
                    </v-btn>
                  </template>
                  <span>Drag to change order</span>
                </v-tooltip>
                <v-btn @click="openDialogPalette(index)" outlined rounded>
                  <v-icon left :color="color.hex">mdi-circle</v-icon>
                  {{ "Change Color" }}
                </v-btn>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-on="on"
                      @click="lockColor(index)"
                      class="ml-4"
                      icon
                    >
                      <v-icon v-if="color.disabled"> mdi-lock </v-icon>
                      <v-icon v-else size="20">mdi-lock-open-variant</v-icon>
                    </v-btn>
                  </template>
                  <span>Exclude from color randomization</span>
                </v-tooltip>
              </div>
            </transition-group>
          </draggable>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-btn @click="addColor" fab x-small outlined>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <transition name="fade">
            <v-btn
              @click="removeColor"
              v-if="colors.length > 2"
              fab
              x-small
              outlined
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </transition>
          <v-spacer></v-spacer>
          <v-btn @click="generateGradient" outlined rounded>
            <v-icon left>mdi-dice-5</v-icon> Random
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPalette" width="300">
      <v-card>
        <v-toolbar color="primary">
          <v-btn @click="applyColor" outlined block>
            <v-icon left>mdi-check</v-icon> apply color
          </v-btn>
        </v-toolbar>
        <v-color-picker @update:color="changeColor($event)" :value="palette" />
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import draggable from "vuedraggable";

export default {
  name: "SettingsHeaderGradient",
  props: {
    themeDark: Boolean,
  },
  components: { draggable },
  mounted() {
    this.$nextTick(() => {
      this.dialogHeaderGradient = true;
      this.initColors();
    });
  },
  data: () => ({
    dialogHeaderGradient: false,
    dialogPalette: false,
    colors: [],
    palette: "#435121",
    colorIndex: 0,
    dragOptions: {
      animation: 200,
      group: "description",
      disabled: false,
      ghostClass: "ghost",
    },
  }),
  computed: {
    gradient() {
      let colors = "linear-gradient(to right";
      this.colors.forEach(function (e) {
        colors += "," + e.hex;
      });
      colors += ")";
      return colors;
    },
    savedGradient() {
      return this.themeDark === true
        ? this.$store.state.settings.headerGradientDark
        : this.$store.state.settings.headerGradientLight;
    },
  },
  methods: {
    initColors() {
      let colors = this.savedGradient
        .replace("linear-gradient(to right,", "")
        .replace(")", "")
        .split(",");
      for (let color of colors)
        this.colors.push({
          id: Date.now() + color,
          hex: color,
          disabled: false,
        });
    },
    openDialogPalette(index) {
      this.dialogPalette = true;
      this.colorIndex = index;
      this.palette = this.colors[index].hex;
    },
    changeColor(e) {
      this.palette = e.hex;
    },
    applyColor() {
      this.colors[this.colorIndex].hex = this.palette;
      this.dialogPalette = false;
    },
    addColor() {
      this.colors.push({
        id: Date.now(),
        hex: this.randomHex(),
        disabled: false,
      });
    },
    removeColor() {
      if (this.colors[this.colors.length - 1].disabled == false)
        if (this.colors.length > 2) this.colors.pop();
    },
    generateGradient() {
      for (let i = 0; i < this.colors.length; i++)
        if (this.colors[i].disabled === false)
          this.colors[i].hex = this.randomHex();
    },
    lockColor(index) {
      this.colors[index].disabled === true
        ? (this.colors[index].disabled = false)
        : (this.colors[index].disabled = true);
    },
    randomHex() {
      return "#" + Math.random().toString(16).slice(2, 8);
    },
    close() {
      this.$emit("close");
    },
    apply() {
      let values = {
        gradient: this.gradient,
        themeDark: this.themeDark,
      };
      this.$emit("save", values);
      this.close();
    },
  },
};
</script>