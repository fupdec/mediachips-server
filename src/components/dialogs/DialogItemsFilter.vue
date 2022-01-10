<template>
  <div>
    <v-dialog
      v-if="dialog"
      :value="dialog"
      @input="close"
      scrollable
      width="1200"
    >
      <v-card>
        <div class="d-flex justify-space-between">
          <div class="headline ma-4">Filter {{ page.name }}</div>
          <div
            class="
              d-flex
              flex-sm-row flex-column-reverse
              justify-end
              ma-sm-4 ma-2
            "
          >
            <v-btn @click="dialogSavedFilters = true" outlined>
              <v-icon left>mdi-content-save</v-icon> Save / load
            </v-btn>
            <v-spacer class="ma-sm-2 ma-1"></v-spacer>
            <v-btn @click="apply" color="success" depressed>
              <v-icon left>mdi-check</v-icon> Apply
            </v-btn>
          </div>
        </div>

        <v-divider></v-divider>

        <vuescroll>
          <v-card-text class="text-center">
            <FilterRow
              v-for="(f, i) in filters"
              :key="i"
              :filter="f"
              :listBy="listBy"
              @setBy="setBy($event, i)"
              @setCond="setCond($event, i)"
              @setVal="setVal($event, i)"
              @remove="remove(i)"
              @duplicate="duplicate(i)"
            />
          </v-card-text>
        </vuescroll>

        <div v-if="filters.length == 0" class="text-center pb-6 overline">
          <v-icon large class="mb-2">mdi-ghost-outline</v-icon>
          <div>No filters</div>
        </div>

        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            @click="add"
            class="ma-2 mt-0 pr-4"
            color="success"
            rounded
            depressed
            small
          >
            <v-icon left>mdi-plus</v-icon> Add
          </v-btn>
          <v-btn
            v-if="filters.length"
            @click="removeAll"
            class="ma-2 mt-0 pr-4"
            color="error"
            depressed
            rounded
            small
          >
            <v-icon left>mdi-close</v-icon> Remove all
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import Vue from "vue";
import axios from "axios";
import vuescroll from "vuescroll";

export default {
  props: {
    dialog: Boolean,
  },
  components: {
    vuescroll,
    FilterRow: () => import("@/components/dialogs/filters/FilterRow.vue"),
  },
  mounted() {
    this.$nextTick(function () {
      this.init();
    });
  },
  data: () => ({
    filters: [],
    listBy: [],
    cols: {
      standart: [
        {
          by: "rating",
          type: "number",
          icon: "star",
          text: "Rating",
        },
        {
          by: "favorite",
          type: "boolean",
          icon: "heart",
          text: "Favorite",
        },
        {
          by: "bookmark",
          type: "string",
          icon: "bookmark",
          text: "Bookmark",
        },
        {
          by: "views",
          type: "number",
          icon: "eye",
          text: "Number of views",
        },
        {
          by: "viewedAt",
          type: "date",
          icon: "calendar-clock",
          text: "Viewed date",
        },
        {
          by: "createdAt",
          type: "date",
          icon: "calendar-plus",
          text: "Date added",
        },
        {
          by: "updatedAt",
          type: "date",
          icon: "calendar-edit",
          text: "Editing date",
        },
      ],
      metaItem: [
        {
          by: "name",
          type: "string",
          icon: "alphabetical-variant",
          text: "Name",
        },
        {
          by: "synonyms",
          type: "string",
          icon: "alphabetical",
          text: "Synonyms",
        },
        {
          by: "country",
          type: "array",
          icon: "flag",
          text: "Country",
        },
        {
          by: "color",
          type: "string",
          icon: "palette",
          text: "Color",
        },
      ],
      media: [
        {
          by: "path",
          type: "string",
          icon: "file-search",
          text: "File path",
        },
        {
          by: "filesize",
          type: "number",
          icon: "harddisk",
          text: "File size",
        },
      ],
      video: [
        {
          by: "duration",
          type: "number",
          icon: "timer-outline",
          text: "Duration",
        },
        {
          by: "width",
          type: "number",
          icon: "monitor-screenshot",
          text: "Width",
        },
        {
          by: "height",
          type: "number",
          icon: "monitor-screenshot",
          text: "Height",
        },
        {
          by: "bitrate",
          type: "number",
          icon: "filmstrip",
          text: "Bitrate",
        },
        {
          by: "fps",
          type: "number",
          icon: "filmstrip",
          text: "Frames per second",
        },
        {
          by: "codec",
          type: "string",
          icon: "filmstrip",
          text: "Codec",
        },
      ],
    },
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    page() {
      return this.$store.state.page;
    },
    isMetaPage() {
      return Vue.prototype.$checkCurrentPage("meta");
    },
    isMediaPage() {
      return Vue.prototype.$checkCurrentPage("media");
    },
    typeId() {
      return +this.$router.history.current.query.typeId;
    },
    metaId() {
      return +this.$router.history.current.query.metaId;
    },
  },
  methods: {
    async init() {
      let assigned = [];
      this.listBy = [...this.listBy, ...this.cols.standart];

      if (this.isMediaPage) {
        this.listBy = [...this.listBy, ...this.cols.media];
        if (this.typeId == 1) {
          this.listBy = [...this.listBy, ...this.cols.video];

          await axios
            .get(this.apiUrl + "/api/MetaInMediaType")
            .then((res) => {
              assigned = res.data.assigned;
              assigned = assigned.filter((i) => i.id == this.typeId);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      } else if (this.isMetaPage) {
        this.listBy = [...this.listBy, ...this.cols.metaItem];

        await axios
          .get(this.apiUrl + "/api/ChildMeta?metaId=" + this.metaId)
          .then((res) => {
            assigned = res.data;
          })
          .catch((e) => {
            console.log(e);
          });
      }
      
      for (let i of assigned) {
        this.listBy.push({
          by: i["meta.id"],
          type: i["meta.type"],
          icon: i["meta.icon"],
          text: i["meta.name"],
        });
      }

      this.listBy.sort((a, b) =>
        a.text > b.text ? 1 : b.text > a.text ? -1 : 0
      );
    },
    add() {
      this.filters.push({
        by: null,
        type: null,
        cond: null,
        val: null,
        flag: null,
        lock: false,
      });
    },
    setBy(value, index) {
      this.filters[index].by = value;
      let found = this.listBy.findIndex((i) => i.by == value);
      if (found > -1) this.filters[index].type = this.listBy[found].type;
      this.filters[index].cond = null;
      this.filters[index].val = null;
    },
    setCond(value, index) {
      this.filters[index].cond = value;
    },
    setVal(value, index) {
      this.filters[index].val = value;
    },
    duplicate(index) {
      this.filters.push(this.filters[index]);
    },
    remove(index) {
      this.filters.splice(index, 1);
    },
    removeAll() {
      this.filters = [];
    },
    apply() {
      this.$emit("close");
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>