<template>
  <div class="mx-4">
    <div class="d-flex">
      <div>
        <div>mediaChips-server v0.5.0-alpha</div>
        <div class="text--secondary">by fupdec</div>
      </div>
      <v-spacer></v-spacer>
      <div class="text-center d-flex flex-column">
        <img :src="logoPath" alt="mediaChips" width="64" height="64" />
        <span>2022</span>
      </div>
    </div>

    <div class="d-flex flex-wrap mt-2">
      <v-btn
        @click="openLink('https://mediaChips.app/')"
        class="px-5 mb-2 mr-2"
        color="#7059b7"
        rounded
        depressed
        dark
      >
        <v-icon left>mdi-web</v-icon> Website
      </v-btn>
      <v-btn
        @click="openLink('https://github.com/fupdec/mediachips')"
        class="px-5 mb-2 mr-2"
        color="#eee"
        light
        rounded
        depressed
      >
        <v-icon left>mdi-github</v-icon> Github
      </v-btn>
      <v-btn
        @click="openLink('https://reddit.com/r/mediaChips/')"
        class="px-5 mb-2 mr-2"
        color="#ff4500"
        rounded
        depressed
      >
        <v-icon left>mdi-reddit</v-icon> Reddit
      </v-btn>
      <v-btn
        @click="openLink('https://discord.gg/dEQPper2yu')"
        class="px-5 mb-2 mr-2"
        color="#7289DA"
        rounded
        depressed
      >
        <v-icon left>mdi-discord</v-icon> Discord
      </v-btn>
      <v-btn
        @click="openLink('https://patreon.com/mediaChips')"
        class="px-5 mb-2 mr-2"
        color="#ff424d"
        rounded
        depressed
      >
        <v-icon left>mdi-patreon</v-icon> Patreon
      </v-btn>
    </div>

    <v-divider class="my-4"></v-divider>

    <div class="d-flex flex-column">
      <div class="mb-4">
        Thanks to the people who worked on these wonderful libraries:
      </div>
      <div class="d-flex flex-wrap">
        <span @click="openLink('https://github.com/electron')" class="mr-2">
          electron,
        </span>
        <span @click="openLink('https://github.com/vuejs/vue')" class="mr-2">
          vue,
        </span>
        <span
          @click="openLink('https://github.com/vuetifyjs/vuetify')"
          class="mr-2"
        >
          vuetify,
        </span>
        <span @click="openLink('https://github.com/vuejs/vuex')" class="mr-2">
          vuex,
        </span>
        <span @click="openLink('https://www.ffmpeg.org/')" class="mr-2">
          ffmpeg,
        </span>
        <span
          @click="openLink('https://github.com/whyboris/Video-Hub-App')"
          class="mr-2"
        >
          videohubapp,
        </span>
        <span @click="openLink('https://github.com/apexcharts')" class="mr-2">
          apexcharts,
        </span>
        <span
          @click="openLink('https://github.com/archiverjs/node-archiver')"
          class="mr-2"
        >
          archiver,
        </span>
        <span @click="openLink('https://github.com/axios/axios')" class="mr-2">
          axios,
        </span>
        <span
          @click="openLink('https://github.com/cheeriojs/cheerio')"
          class="mr-2"
        >
          cheerio,
        </span>
        <span
          @click="openLink('https://github.com/zloirock/core-js')"
          class="mr-2"
        >
          core-js,
        </span>
        <span
          @click="openLink('https://github.com/eugeneware/ffmpeg-static')"
          class="mr-2"
        >
          ffmpeg-static,
        </span>
        <span
          @click="openLink('https://github.com/joshwnj/ffprobe-static')"
          class="mr-2"
        >
          ffprobe-static,
        </span>
        <span
          @click="openLink('https://github.com/pqina/filepond')"
          class="mr-2"
        >
          filepond,
        </span>
        <span
          @click="
            openLink('https://github.com/fluent-ffmpeg/node-fluent-ffmpeg')
          "
          class="mr-2"
        >
          fluent-ffmpeg,
        </span>
        <span
          @click="openLink('https://github.com/jprichardson/node-fs-extra')"
          class="mr-2"
        >
          fs-extra,
        </span>
        <span
          @click="openLink('https://github.com/oliver-moran/jimp')"
          class="mr-2"
        >
          jimp,
        </span>
        <span
          @click="openLink('https://github.com/typicode/lowdb')"
          class="mr-2"
        >
          lowdb,
        </span>
        <span
          @click="openLink('https://github.com/cristiammercado/node-disk-info')"
          class="mr-2"
        >
          node-disk-info,
        </span>
        <span
          @click="openLink('https://github.com/antelle/node-stream-zip')"
          class="mr-2"
        >
          node-stream-zip,
        </span>
        <span
          @click="openLink('https://github.com/dylang/shortid')"
          class="mr-2"
        >
          shortid,
        </span>
        <span
          @click="openLink('https://github.com/Norserium/vue-advanced-cropper')"
          class="mr-2"
        >
          vue-advanced-cropper,
        </span>
        <span
          @click="openLink('https://github.com/P3trur0/vue-country-flag')"
          class="mr-2"
        >
          vue-country-flag,
        </span>
        <span
          @click="openLink('https://github.com/vuejs/vue-router')"
          class="mr-2"
        >
          vue-router,
        </span>
        <span
          @click="openLink('https://www.npmjs.com/package/vue-the-mask')"
          class="mr-2"
        >
          vue-the-mask,
        </span>
        <span
          @click="openLink('https://github.com/SortableJS/Vue.Draggable')"
          class="mr-2"
        >
          vuedraggable,
        </span>
        <span
          @click="openLink('https://github.com/Simonwep/selection')"
          class="mr-2"
        >
          selection,
        </span>
        <span
          @click="openLink('https://github.com/mirari/v-viewer')"
          class="mr-2"
        >
          v-viewer
        </span>
      </div>
      <div @click="openLink('https://aardvark-hosting.nl/')" class="link mt-4">
        Thanks to Aardvark Hosting
      </div>
    </div>
  </div>
</template>


<script>
const path = require("path");
// const shell = require('electron').shell

export default {
  name: "About",
  computed: {
    logoPath() {
      return path.join(__dirname, "/icons/icon.png");
    },
  },
  methods: {
    openLink(link) {
      window.open(link, "_newtab");
      shell.openExternal(link);
    },
  },
};
</script>


<style lang="scss">
.link {
  margin-right: 5px;
}
</style>