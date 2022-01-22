<template>
  <v-menu offset-y nudge-bottom="10" :close-on-content-click="false">
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-badge :content="badge" :value="badge" offset-x="44" offset-y="25">
            <v-btn v-on="{ ...onMenu, ...onTooltip }" icon>
              <v-icon>mdi-bell-outline</v-icon>
            </v-btn>
          </v-badge>
        </template>
        <span>Notifications</span>
      </v-tooltip>
    </template>

    <v-card width="300">
      <v-card-actions>
        <div class="caption">Notifications</div>
        <v-spacer></v-spacer>
        <v-btn icon x-small @click="clearAll">
          <v-icon>mdi-notification-clear-all</v-icon>
        </v-btn>
        <v-btn icon x-small @click="menu = false">
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </v-card-actions>

      <v-divider></v-divider>

      <vuescroll>
        <v-card-text class="pa-2 notifications-list">
          <v-alert
            v-for="(a, i) in alerts"
            :key="a.id"
            :type="a.type"
            class="mb-1"
            dense
            text
            outlined
          >
            <v-row align="center">
              <v-col class="grow pa-0">
                <div class="caption">{{ a.text }}</div>
              </v-col>
              <v-col class="shrink pa-0">
                <v-btn
                  @click="close(i)"
                  :color="a.type"
                  depressed
                  block
                  icon
                  width="24"
                  height="24"
                >
                  <v-icon size="16">mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>

          <div v-if="alerts.length == 0" class="text-center py-2">
            <v-icon class="mb-2">mdi-ghost-outline</v-icon>
            <div class="caption">No new notifications</div>
          </div>
        </v-card-text>
      </vuescroll>
    </v-card>
  </v-menu>
</template>


<script>
import vuescroll from "vuescroll";

export default {
  name: "Notifications",
  components: {
    vuescroll,
  },
  data: () => ({
    dialog: false,
    alerts: [
      { id: 1, type: "info", text: "Welcome to mediaChips v0.1.0-alpha" },
    ],
  }),
  mounted() {
    this.$nextTick(() => {});
  },
  computed: {
    badge() {
      return this.alerts.length;
    },
  },
  methods: {
    close(index) {
      this.alerts = this.alerts.slice(index, 0);
    },
    clearAll() {
      this.menu = false;
    },
  },
};
</script>