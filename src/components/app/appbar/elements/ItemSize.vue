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
    <v-card width="300">
      <v-toolbar color="primary" height="36">
        <span class="headline">Item Size</span>
        <v-spacer></v-spacer>
        <v-icon>mdi-card-bulleted-settings</v-icon>
      </v-toolbar>
      <v-slider
        @input="updateSize($event)"
        :value="size"
        min="1"
        max="5"
        step="1"
        class="pa-3"
        :tick-labels="sizes"
      />
    </v-card>
  </v-menu>
</template>


<script>
export default {
  name: "ItemSize",
  data: () => ({
    size: 3,
    sizes: ["XS", "S", "M", "L", "XL"],
  }),
  methods: {
    updateSize(size) {
      this.size = size
      this.$root.$emit("updateItemSize", size);
    },
  },
};
</script>