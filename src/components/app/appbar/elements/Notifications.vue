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
            v-for="(i, x) in notifications"
            :key="i.id"
            :type="i.type"
            class="mb-1"
            dense
            text
            outlined
          >
            <v-row align="center">
              <v-col class="grow pa-0">
                <div class="caption">{{ i.text }}</div>
              </v-col>
              <v-col class="shrink pa-0">
                <v-btn
                  @click="close(x)"
                  :color="i.type"
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

          <div v-if="notifications.length == 0" class="text-center py-2">
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
  }),
  mounted() {
    this.$nextTick(() => {});
  },
  computed: {
    notifications: {
      get() {
        return this.$store.state.notifications;
      },
      set(value) {
        this.$store.commit("updateState", {
          key: "notifications",
          value: _.cloneDeep(value),
        });
      },
    },
    badge() {
      return this.notifications.length;
    },
  },
  methods: {
    close(index) {
      this.notifications.splice(index, 1);
    },
    clearAll() {
      this.notifications = [];
    },
  },
};
</script>