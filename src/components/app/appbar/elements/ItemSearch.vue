<template>
  <v-menu offset-y nudge-bottom="10" :close-on-content-click="false">
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-badge
            :value="searchString"
            icon="mdi-format-letter-case"
            overlap
            offset-x="23"
            offset-y="44"
          >
            <v-btn v-on="{ ...onMenu, ...onTooltip }" icon tile>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-badge>
        </template>
        <span>Search by Name</span>
      </v-tooltip>
    </template>
    <v-card width="350">
      <div class="pa-2 d-flex">
        <v-text-field
          :value="searchString"
          @input="update($event)"
          autofocus
          @click:clear="clear"
          @keypress.enter="search"
          outlined
          dense
          hide-details
          clearable
          class="pt-0"
        />
        <v-btn
          @click="search"
          class="ml-2"
          color="primary"
          depressed
          height="40"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div>
    </v-card>
  </v-menu>
</template>


<script>
export default {
  name: "ItemSearch",
  data: () => ({
    searchString: "",
  }),
  computed: {
    sets: {
      get() {
        return this.$store.state.pageSettings;
      },
      set(value) {
        return (this.$store.state.pageSettings = value);
      },
    },
  },
  methods: {
    update(val) {
      this.searchString = val;
    },
    clear() {
      this.sets.query = "";
    },
    search() {
      this.sets.query = this.searchString;
    },
  },
  watch: {
    "sets.query"(val) {
      this.searchString = val;
    },
  },
};
</script>