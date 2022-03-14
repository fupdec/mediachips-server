<template>
  <v-menu offset-y nudge-bottom="10">
    <template #activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-badge :content="badge" :value="badge" offset-x="44" offset-y="25">
            <v-btn v-on="{ ...onMenu, ...onTooltip }" icon>
              <v-icon>mdi-cogs</v-icon>
            </v-btn>
          </v-badge>
        </template>
        <span>Tasks</span>
      </v-tooltip>
    </template>

    <v-card width="450">
      <v-card-actions> Tasks </v-card-actions>

      <v-divider></v-divider>

      <v-list v-if="tasks.length > 0" class="tasks-list" dense>
        <v-list-item
          v-for="task in tasks"
          :key="task.id"
          @click="open(task.click)"
        >
          <v-list-item-avatar color="grey">
            <v-icon dark>mdi-{{ task.icon }}</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-html="task.text" />
            <v-list-item-subtitle v-text="task.subtitle" />
          </v-list-item-content>

          <v-list-item-action>
            <v-progress-circular
              :value="task.progress"
              :rotate="-90"
              color="primary"
              size="36"
              width="3"
            >
              <v-btn @click="remove(task.action, task.id)" color="error" icon>
                <v-icon>mdi-close-octagon</v-icon>
              </v-btn>
            </v-progress-circular>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-card-text v-else class="text-center">
        <v-icon class="mb-2">mdi-ghost-outline</v-icon>
        <div class="caption">No tasks in progress</div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>


<script>
export default {
  name: "Tasks",
  computed: {
    badge() {
      return this.tasks.length;
    },
    tasks: {
      get() {
        return this.$store.state.Tasks.list;
      },
      set(val) {
        this.$store.state.Tasks.list = val;
      },
    },
  },
  methods: {
    open(action) {
      if (action) action();
    },
    remove(action, id) {
      if (action) action();
      this.$store.dispatch("removeTask", id);
    },
  },
};
</script>


<style lang="scss" scoped>
.tasks-list {
  max-height: calc(60vh - 60px);
  overflow: auto;
}
</style>