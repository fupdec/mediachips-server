<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn @click="dialogFilter = true" v-on="on" icon tile>
        <v-badge
          :value="filterBadge"
          :content="filteredTotal"
          overlap
          bottom
          style="z-index: 5"
        >
          <v-icon>mdi-filter-outline</v-icon>
        </v-badge>
      </v-btn>
      <DialogItemsFilter
        v-if="dialogFilter"
        :dialog="dialogFilter"
        @close="dialogFilter = false"
      />
    </template>
    <span>Filter {{ page.name }}</span>
  </v-tooltip>
</template>


<script>
export default {
  name: "ItemsFilter",
  components: {
    DialogItemsFilter: () =>
      import("@/components/dialogs/DialogItemsFilter.vue"),
  },
  data: () => ({
    dialogFilter: false,
    filterBadge: "",
    filteredTotal: "",
  }),
  computed: {
    page() {
      return this.$store.state.page;
    },
  },
  methods: {},
};
</script>