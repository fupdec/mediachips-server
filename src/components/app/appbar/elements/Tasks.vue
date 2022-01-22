<template>
  <v-menu offset-y nudge-bottom="10" :close-on-content-click="false">
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

    <v-card width="300">
      <v-card-actions>
        <div class="caption">Tasks</div>
      </v-card-actions>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item-group>
          <v-list-item
            v-for="(task, i) in tasks"
            :key="task.id"
            @click="stop(i)"
          >
            <v-list-item-content>
              <v-list-item-title>
                <v-icon left>mdi-{{ task.icon }}</v-icon>
                {{ task.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <div v-if="tasks.length == 0" class="text-center py-2">
            <v-icon class="mb-2">mdi-ghost-outline</v-icon>
            <div class="caption">No tasks in progress</div>
          </div>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-menu>
</template>


<script>
import vuescroll from "vuescroll";

export default {
  name: "Tasks",
  components: {
    vuescroll,
  },
  data: () => ({}),
  mounted() {
    this.$nextTick(() => {});
  },
  computed: {
    badge() {
      return this.$store.state.tasks.length;
    },
    tasks: {
      get() {
        return this.$store.state.tasks;
      },
      set(val) {
        this.$store.commit("updateState", {
          key: "tasks",
          value: val,
        });
      },
    },
  },
  methods: {
    stop(index) {},
  },
};
</script>