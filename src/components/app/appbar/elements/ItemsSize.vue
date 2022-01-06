<template>
  <v-menu offset-y nudge-bottom="10" :close-on-content-click="false">
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-badge
            :content="sizes[size - 1]"
            class="text-uppercase"
            color="secondary"
            overlap
            offset-x="25"
            offset-y="25"
          >
            <v-btn v-on="{ ...onMenu, ...onTooltip }" icon tile>
              <v-icon>mdi-card-bulleted</v-icon>
            </v-btn>
          </v-badge>
        </template>
        <span>Item Size</span>
      </v-tooltip>
    </template>
    <v-list dense>
      <v-list-item-group
        :value="size"
        @change="update($event)"
        mandatory
        color="primary"
      >
        <v-list-item v-for="(s, i) in sizes" :key="i" :value="i + 1">
          <v-list-item-content>
            <v-list-item-title v-text="s"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>


<script>
export default {
  name: "ItemSize",
  data: () => ({
    size: 3,
    sizes: ["XS", "S", "M", "L", "XL"],
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
      this.sets.size = val;
    },
  },
  watch: {
    "sets.size"(val) {
      this.size = val;
    },
  },
};
</script>