<template>
  <v-menu offset-y nudge-bottom="10">
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-btn v-on="{ ...onMenu, ...onTooltip }" icon>
            <v-icon>mdi-book-open-page-variant-outline</v-icon>
          </v-btn>
        </template>
        <span>Items Per Page: {{ badge }}</span>
      </v-tooltip>
    </template>

    <v-list dense>
      <v-list-item-group
        :value="limit"
        @change="update($event)"
        mandatory
        color="primary"
      >
        <v-list-item v-for="i in limits" :key="i.value" :value="i.value">
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
  name: "ItemsLimit",
  data: () => ({
    limits: [
      {
        value: 25,
        text: 25,
      },
      {
        value: 50,
        text: 50,
      },
      {
        value: 99,
        text: 99,
      },
      {
        value: 101,
        text: "∞",
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
      const index = this.limits.findIndex((i) => i.value == this.sets.limit);
      if (index > -1) return this.limits[index].text;
      else return 25;
    },
    limit() {
      const index = this.limits.findIndex((i) => i.value == this.sets.limit);
      if (index > -1) return this.limits[index].value;
      else return 1000;
    },
  },
  methods: {
    update(val) {
      this.sets.limit = val;
      this.$root.$emit("setItemsLimit", val);
    },
  },
};
</script>