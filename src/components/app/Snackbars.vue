<template>
  <div class="snackbars">
    <transition-group name="snackbars" tag="div">
      <v-card
        v-for="(i, x) in notifications"
        :key="i.id"
        class="snack"
        elevation="5"
      >
        <v-alert v-show="i.show" :type="i.type" class="body-2" dense text>
          <div class="d-flex justify-space-between align-start">
            <span>{{ i.text }}</span>
            <v-icon @click="close(x)" :color="i.type" right>mdi-close</v-icon>
          </div>
        </v-alert>
      </v-card>
    </transition-group>
  </div>
</template>


<script>
export default {
  name: "Snackbars",
  data: () => ({}),
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
  },
  methods: {
    close(index) {
      this.notifications.splice(index, 1);
    },
  },
};
</script>


<style lang="scss" scoped>
.snackbars {
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: end;
  align-content: end;
  justify-content: start;
  position: fixed;
  top: 65px;
  right: 15px;
  width: 100%;
  height: calc(100vh - 65px);
  z-index: 5;
  .v-alert {
    pointer-events: all;
  }
  .snack {
    transition: all 0.5s;
    word-break: break-all;
    max-width: 350px;
  }
  &-item {
    display: inline-block;
    margin-right: 10px;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}
@media (max-width: 480px) {
  .snackbars {
    .snack {
      max-width: 250px;
    }
  }
}
</style>