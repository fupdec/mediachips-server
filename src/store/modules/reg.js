import Vue from "vue";
import StringCrypto from "string-crypto";

const Reg = {
  state: () => ({
    machineId: null,
    domain: "https://mediachips.app/wp-json/license/v1/",
    apiKey: "r86ACHydAz4HuKMYR9S6xv5ymKHFaa5dK5FuExDZ9u",
    secret: "This is the longest password ever!",
    secretOptions: {
      salt: "f23tlo23fvy9cjnv90j2fxkzasf398hgbjhsavz",
      iterations: 10,
      digest: "sha512",
    },
  }),
  mutations: {},
  actions: {
    async updateRegInfo({
      state,
      rootState
    }, value) {
      const {
        encryptString
      } = new StringCrypto(state.secretOptions);
      value = encryptString(value, state.secret);
      rootState.settings.registration = value;
      await Vue.prototype.$setOption("registration", value);
    },
  },
  getters: {
    regInfo(state, getters, rootState) {
      const {
        decryptString
      } = new StringCrypto(state.secretOptions);
      let str = rootState.settings.registration;
      if (str.length) return JSON.parse(decryptString(str, state.secret));
      else return ""
    },
    reg(state, getters) {
      if (getters.regInfo.length == 0) return false

      let today = new Date();
      today = today.toISOString().substring(0, 10);
      if (today > getters.regInfo.license_expiry) return false

      let arr = [
        getters.regInfo.fingerprint_1,
        getters.regInfo.fingerprint_2,
        getters.regInfo.fingerprint_3,
      ];
      return arr.includes(state.machineId);
    }
  }
}

export default Reg