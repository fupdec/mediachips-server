<template>
  <v-menu offset-y nudge-bottom="10" :close-on-content-click="false">
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-btn v-on="{ ...onMenu, ...onTooltip }" icon>
            <v-icon>mdi-format-size</v-icon>
          </v-btn>
        </template>
        <span>Item Size: {{ badge }}</span>
      </v-tooltip>
    </template>
    <v-list dense>
      <v-list-item-group
        :value="size"
        @change="update($event)"
        mandatory
        color="primary"
      >
        <v-list-item v-for="i in sizes" :key="i.value" :value="i.value">
          <v-list-item-content>
            <v-list-item-title v-text="i.text"></v-list-item-title>
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
    sizes: [
      {
        value: 1,
        text: "XS",
      },
      {
        value: 2,
        text: "S",
      },
      {
        value: 3,
        text: "M",
      },
      {
        value: 4,
        text: "L",
      },
      {
        value: 5,
        text: "XL",
      },
    ],
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
    badge() {
      const index = this.sizes.findIndex((i) => i.value == this.sets.size);
      if (index > -1) return this.sizes[index].text;
      else return "M";
    },
    size() {
      const index = this.sizes.findIndex((i) => i.value == this.sets.size);
      if (index > -1) return this.sizes[index].value;
      else return 3;
    },
  },
  methods: {
    update(val) {
      this.sets.size = val;
    },
  },
};
</script>