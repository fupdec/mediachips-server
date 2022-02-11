<script>
import StringCrypto from "string-crypto";
import Vue from "vue";

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
    reg: false,
  }),
  computed: {
    registration: {
      get() {
        let r = this.$store.state.settings.registration;
        if (r.length) return JSON.parse(this.decrypt(r));
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
    machineId() {
      return this.$store.state.machineId;
    },
  },
  methods: {
    checkReg() {
      if (this.registration.length == 0) {
        this.reg = false;
        return;
      }
      let today = new Date();
      today = today.toISOString().substring(0, 10);
      if (today > this.registration.license_expiry) {
        this.reg = false;
        return;
      }
      let arr = [
        this.registration.fingerprint_1,
        this.registration.fingerprint_2,
        this.registration.fingerprint_3,
      ];
      this.reg = arr.includes(this.machineId);
    },
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
  watch: {
    machineId(e) {
      this.checkReg();
    },
  },
};
</script>