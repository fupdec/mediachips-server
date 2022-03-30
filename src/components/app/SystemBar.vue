<template>
  <v-system-bar
    :class="{ maximized: maximized }"
    :style="{ background: headerColor }"
    window
    app
  >
    <v-spacer></v-spacer>
    <div class="window-controls">
      <v-btn @click="minimize" width="46" height="28" text tile small>
        <v-icon size="16">mdi-minus</v-icon>
      </v-btn>
      <v-btn
        v-if="maximized"
        @click="unmaximize"
        width="46"
        height="28"
        text
        tile
        small
      >
        <v-icon size="18">mdi-window-restore</v-icon>
      </v-btn>
      <v-btn v-else @click="maximize" width="46" height="28" text tile small>
        <v-icon size="14">mdi-square-outline</v-icon>
      </v-btn>
      <v-btn
        @click="close"
        width="46"
        height="28"
        class="close-app-btn"
        color="#d70000"
        text
        tile
        small
      >
        <v-icon size="18">mdi-window-close</v-icon>
      </v-btn>
    </div>
  </v-system-bar>
</template>


<script>
// import { ipcRenderer } from 'electron';

export default {
  name: "SystemBar",
  props: {
    disabled: Boolean,
  },
  mounted() {
    ipcRenderer.on("maximize", () => {
      this.maximized = true;
    });
    ipcRenderer.on("unmaximize", () => {
      this.maximized = false;
    });
  },
  data: () => ({
    maximized: false,
  }),
  computed: {
    headerColor() {
      if (this.sets.headerGradient == "1") {
        if (this.$vuetify.theme.isDark) {
          return this.sets.headerGradientDark;
        } else return this.sets.headerGradientLight;
      } else {
        if (this.$vuetify.theme.isDark) {
          return this.sets.appColorDarkHeader;
        } else return this.sets.appColorLightHeader;
      }
    },
    sets() {
      return this.$store.state.settings;
    },
  },
  methods: {
    minimize() {
      ipcRenderer.invoke("minimize");
    },
    maximize() {
      this.maximized = true;
      ipcRenderer.invoke("maximize");
    },
    unmaximize() {
      this.maximized = false;
      ipcRenderer.invoke("unmaximize");
    },
    close() {
      ipcRenderer.send("closeApp");
    },
  },
};
</script>

<style lang="scss">
.app-menu-container {
  -webkit-app-region: no-drag;
  position: absolute;
  top: 0;
  left: 30px;
  height: 100%;
  .v-btn {
    text-transform: capitalize;
    font-weight: normal;
    letter-spacing: normal;
    padding: 0 8px !important;
    min-width: 0 !important;
    &__content {
      line-height: 1;
    }
  }
}
.app-system-bar-title {
  font-size: 12px;
}
.v-system-bar {
  overflow: hidden;
  height: 28px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  &:before {
    content: "";
    position: absolute;
    height: 100%;
    top: 3px;
    left: 3px;
    right: 138px;
    background-color: transparent;
    -webkit-app-region: drag;
    pointer-events: none;
  }
  &.maximized:before {
    top: 0;
  }
}
.window-controls {
  -webkit-app-region: no-drag;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  .v-btn:not(.v-btn--round).v-size--small {
    min-width: 0;
  }
  .v-btn.close-app-btn:hover::before {
    opacity: 1;
  }
  .v-btn.close-app-btn:hover .v-icon {
    color: #fff;
  }
}
.v-system-bar--window .window-controls .v-icon {
  margin-right: 0;
}
@media (max-width: 840px) {
  .app-system-bar-title {
    right: 160px;
    position: absolute;
  }
}
@media (max-width: 680px) {
  .app-system-bar-title {
    display: none;
  }
}
</style>