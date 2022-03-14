<template>
  <div class="mx-4">
    <v-divider class="mt-4 mb-2" />
    <div class="subtitle-2 text-right mb-4">Login</div>

    <v-checkbox
      v-model="sets.passwordProtection"
      @change="setOption($event, 'passwordProtection')"
      false-value="0"
      true-value="1"
      class="mt-0"
    >
      <template v-slot:label>
        <div class="d-flex flex-column ml-2">
          <div class="text--primary">Password protection</div>
          <div class="subtitle-2 mt-1">
            Require a password when entering the application
          </div>
        </div>
      </template>
    </v-checkbox>

    <v-row v-if="sets.passwordProtection == '1'">
      <v-col cols="12" sm="6">
        <v-text-field
          :value="password"
          @change="setOption(password, 'passwordHint')"
          @click:append="showPassword = !showPassword"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :disabled="sets.passwordProtection == '0'"
          label="Password"
          outlined
          rounded
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          :value="hint"
          @change="setOption(hint, 'passwordHint')"
          :disabled="sets.passwordProtection == '0'"
          label="Hint"
          outlined
          rounded
          hide-details
        />
      </v-col>
    </v-row>
  </div>
</template>


<script>
import Vue from "vue";

export default {
  name: "SettingsLogin",
  components: {},
  data: () => ({
    password: "",
    hint: "",
    showPassword: false,
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
    async setOption(value, option) {
      this.sets[option] = value;
      await Vue.prototype.$setOption(option, value);
    },
  },
};
</script>