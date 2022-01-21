<template>
  <v-card outlined class="mt-6 px-4 pb-6 mx-2">
    <div class="headline text-center pt-4 pb-6">Login</div>

    <v-row>
      <v-col cols="12">
        <div class="d-flex">
          <v-radio-group
            :value="sets.passwordProtection"
            @change="setOption($event, 'passwordProtection')"
            class="mt-0 pt-0"
            mandatory
            row
            hide-details
          >
            <v-radio label="Password" value="1"></v-radio>
            <v-radio label="Free" value="0"></v-radio>
          </v-radio-group>
        </div>
      </v-col>
      <v-col v-if="sets.passwordProtection == '1'" cols="12" sm="6">
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
      <v-col v-if="sets.passwordProtection == '1'" cols="12" sm="6">
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
  </v-card>
</template>


<script>
import Vue from "vue";
import _ from "lodash";

export default {
  name: "Login",
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