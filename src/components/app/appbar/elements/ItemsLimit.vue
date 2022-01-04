<template>
  <v-menu offset-y nudge-bottom="10" :close-on-content-click="false">
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-badge
            :content="limit"
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
        @change="updateSize($event)"
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
  props: {
    limit: Number,
  },
  data: () => ({
    limits: [20, 50, 100, 200, 300],
  }),
  computed: {
    size() {
      return this.limits.findIndex((v)=> v == this.limit)
    }
  },
  methods: {
    updateSize(limit) {
      this.$emit("update", this.limits[limit]);
      this.$root.$emit("updateLimit", this.limits[limit]);
    },
  },
};
</script>