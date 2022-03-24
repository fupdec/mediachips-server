<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn @click="dialog = true" v-on="on" icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
      <span> Global Search </span>
    </v-tooltip>

    <v-dialog
      :value="dialog"
      @input="close"
      content-class=" dialog-position-start"
      scrollable
      width="680"
    >
      <v-card>
        <v-card-actions>
          <v-text-field
            v-model="query"
            @input="run"
            placeholder="Enter text..."
            append-icon="mdi-magnify"
            class="mt-3"
            rounded
            filled
            autofocus
            hide-details
          />
        </v-card-actions>

        <v-card-text class="pa-4">
          <div class="text-center font-italic mb-2">
            <span v-if="!query" v-text="`Start typing to see the result...`" />
            <span v-if="query && isEmptyObj(items)" v-text="`Nothing found`" />
          </div>
          <v-card v-for="(group, x) in items" :key="x" class="mb-4" outlined>
            <v-btn
              @click="openMeta(group[0].metaId)"
              block
              depressed
              v-html="x"
            />
            <v-chip-group column class="pl-2">
              <v-chip v-for="i in group" :key="i.id" @click="openItem(i)">
                {{ i.name }}
              </v-chip>
            </v-chip-group>
          </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "GlobalSearch",
  mounted() {
    this.$nextTick(() => {});
  },
  data: () => ({
    dialog: false,
    query: null,
    debounce: 0,
    items: {},
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
  },
  methods: {
    async search() {
      if (!this.query) {
        this.items = {};
        return;
      }
      let url = "/api/item/search";
      let query = `SELECT * FROM items WHERE name LIKE '%${this.query}%'`;
      await axios({
        method: "post",
        url: this.apiUrl + url,
        data: { query },
      })
        .then((res) => {
          let items = res.data[0];
          items = _.groupBy(items, "metaId");
          let renamed = {};
          let meta = this.$store.state.meta;
          for (let i in items) {
            let x = meta.findIndex((m) => m.id == i);
            if (x > -1) renamed[meta[x].name] = items[i].slice(0, 10);
          }
          this.items = renamed;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    run() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(async () => {
        await this.search();
      }, 100);
    },
    openMeta(metaId) {
      let url = "/meta?metaId=" + metaId;
      this.$router.push(url);
      this.close();
    },
    openItem(i) {
      let url = "/item?metaId=" + i.metaId + "&itemId=" + i.id + "&typeId=1";
      this.$router.push(url);
      this.close();
    },
    close() {
      this.dialog = false;
      this.items = [];
      this.query = null;
    },
    isEmptyObj(obj) {
      return _.isEmpty(obj);
    },
  },
};
</script>