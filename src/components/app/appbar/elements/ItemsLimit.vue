<template>
  <v-menu offset-y nudge-bottom="10" :close-on-content-click="false">
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-badge
            :content="sets.limit"
            class="text-uppercase"
            color="secondary"
            overlap
            offset-x="25"
            offset-y="25"
          >
            <v-btn v-on="{ ...onMenu, ...onTooltip }" icon tile>
              <v-icon>mdi-view-list</v-icon>
            </v-btn>
          </v-badge>
        </template>
        <span>Items Per Page</span>
      </v-tooltip>
    </template>
    <v-list dense>
      <v-list-item-group
        :value="limit"
        @change="update($event)"
        mandatory
        color="primary"
      >
        <v-list-item v-for="i in limits" :key="i">
          <v-list-item-content>
            <v-list-item-title v-text="i"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>


<script>
export default {
  name: "ItemsLimit",
  data: () => ({
    limits: [25, 50, 100, 200, 300],
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
    limit() {
      return this.limits.findIndex((i) => i == this.sets.limit);
    },
  },
  methods: {
    update(val) {
      this.sets.limit = this.limits[val];
    },
  },
};
</script>