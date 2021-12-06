<template>
  <v-menu offset-y nudge-bottom="10" :close-on-content-click="false">
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-badge
            :value="searchStringComputed"
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
          :value="searchStringComputed"
          @input="changeSearchString($event)"
          autofocus
          @click:clear="clearSearch"
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
    searchStringComputed: "",
  }),
  methods: {
    changeSearchString(e) {
      this.searchStringComputed = e;
    },
    clearSearch() {
      this.$root.$emit("searchItems", "");
    },
    search() {
      this.$root.$emit("searchItems", this.searchStringComputed);
    },
  },
};
</script>