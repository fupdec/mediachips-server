<template>
  <v-dialog :value="login" @input="close" width="500" overlay-opacity="1">
    <v-card>
      <div class="d-flex justify-space-between">
        <div class="headline ma-4">Welcome!</div>
        <div
          class="
            d-flex
            flex-sm-row flex-column-reverse
            justify-end
            ma-sm-4 ma-2
          "
        >
          <v-btn @click="close" outlined>
            <v-icon left>mdi-close</v-icon> Exit
          </v-btn>
          <v-spacer class="ma-sm-2 ma-1"></v-spacer>
          <v-btn @click="logIn" color="success" depressed>
            <v-icon left>mdi-login</v-icon> Log in
          </v-btn>
        </div>
      </div>

      <v-divider></v-divider>

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
export default {
  name: "DialogLogin",
  props: {
    login: Boolean,
  },
  mounted() {},
  data: () => ({
    password: "",
    showPassword: false,
    error: false,
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