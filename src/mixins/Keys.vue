<script>
import StringCrypto from "string-crypto";
import Vue from 'vue'

export default {
  data: () => ({
    domain: "https://mediachips.app/wp-json/license/v1/",
    apiKey: "r86ACHydAz4HuKMYR9S6xv5ymKHFaa5dK5FuExDZ9u",
    secret: "This is the longest password ever!",
    secretOptions: {
      salt: "f23tlo23fvy9cjnv90j2fxkzasf398hgbjhsavz",
      iterations: 10,
      digest: "sha512",
    },
  }),
  computed: {
    registration: {
      get() {
        if (this.$store.state.settings.registration.length)
          return JSON.parse(
            this.decrypt(this.$store.state.settings.registration)
          );
        else return "";
      },
      set(value) {
        value = this.crypt(value);
        this.setOption(value, "registration");
      },
    },
    appSets: {
      get() {
        return this.$store.state.settings;
      },
      set(value) {
        this.$store.state.settings = value;
      },
    },
    reg() {
      if (!this.registration) return false;
      let today = new Date();
      today = today.toISOString().substring(0, 10);
      if (today > this.registration.license_expiry) return false;
      let arr = [
        this.registration.fingerprint_1,
        this.registration.fingerprint_2,
        this.registration.fingerprint_3,
      ];
      return arr.includes(this.$store.state.machineId);
    },
  },
  methods: {
    async setOption(value, option) {
      this.appSets[option] = value;
      await Vue.prototype.$setOption(option, value);
    },
    crypt(string) {
      const { encryptString } = new StringCrypto(this.secretOptions);
      return encryptString(string, this.secret);
    },
    decrypt(string) {
      const { decryptString } = new StringCrypto(this.secretOptions);
      return decryptString(string, this.secret);
    },
  },
};
</script>