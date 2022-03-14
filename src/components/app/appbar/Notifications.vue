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

    <v-card width="450">
      <v-card-actions>
        <div>Notifications</div>
        <v-spacer></v-spacer>
        <v-btn v-if="notifications.length > 0" @click="clearAll" icon x-small>
          <v-icon>mdi-notification-clear-all</v-icon>
        </v-btn>
      </v-card-actions>

      <v-divider></v-divider>

      <v-card-text class="py-2 px-1">
        <div v-if="notifications.length > 0" class="px-1 notifications-wrap">
          <v-alert
            v-for="(i, x) in notifications"
            :key="i.id"
            :type="i.type"
            class="mb-2 pa-2"
            style="word-break: break-all"
            dense
            text
            outlined
          >
            <div class="d-flex justify-space-between align-start">
              <span class="caption">{{ i.text }}</span>
              <v-icon @click="close(x)" :color="i.type" right>mdi-close</v-icon>
            </div>
          </v-alert>
        </div>

        <div v-else class="text-center py-2">
          <v-icon class="mb-2">mdi-ghost-outline</v-icon>
          <div class="caption">No new notifications</div>
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>


<script>
export default {
  name: "Notifications",
  data: () => ({
    dialog: false,
  }),
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


<style lang="scss" scoped>
.notifications-wrap {
  max-height: calc(60vh - 60px);
  overflow: auto;
  .v-alert:last-of-type {
    margin-bottom: 0 !important;
  }
}
</style>