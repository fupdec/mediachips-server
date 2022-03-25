<template>
  <v-dialog :value="login" @input="close" width="500" overlay-opacity="1" persistent>
    <v-card>
      <DialogHeader @close="close" header="Welcome!" :buttons="buttons" />

      <v-card-text>
        <v-text-field
          v-model="password"
          @click:append="showPassword = !showPassword"
          @keyup.enter="logIn"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          :hint="sets.passwordHint"
          label="Password"
          class="mt-6"
          outlined
          rounded
        />

        <v-alert type="warning" text dense class="caption mt-4">
          Password required to enter the application
        </v-alert>

        <v-alert
          v-model="error"
          type="error"
          icon="mdi-alert"
          class="caption"
          text
          dense
        >
          Wrong password
        </v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


<script>
import DialogHeader from "@/components/elements/DialogHeader.vue";

export default {
  name: "DialogLogin",
  props: {
    login: Boolean,
  },
  components: {
    DialogHeader,
  },
  mounted() {
    this.initButtons();
  },
  data: () => ({
    password: "",
    showPassword: false,
    error: false,
    buttons: [],
  }),
  computed: {
    sets: {
      get() {
        return this.$store.state.settings;
      },
      set(value) {
        this.$store.state.settings = value;
      },
    },
  },
  methods: {
    initButtons() {
      this.buttons.push(
        {
          icon: "close",
          text: "Exit",
          outlined: true,
          function: () => {
            this.close();
          },
        },
        {
          icon: "login",
          text: "Log in",
          color: "success",
          outlined: false,
          function: () => {
            this.logIn();
          },
        }
      );
    },
    logIn() {
      this.error = this.sets.phrase !== this.password;
      if (!this.error) this.$emit("success");
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>