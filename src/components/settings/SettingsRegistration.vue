<template>
  <div class="mx-4">
    <div class="subtitle-2 text-right mb-4">
      <v-chip :color="reg ? 'success' : 'error'" outlined label>
        <span>Application {{ reg ? "" : "not " }} registered</span>
      </v-chip>
    </div>

    <div
      v-if="regInfo.license_code"
      class="d-flex justify-space-between flex-wrap mb-4"
    >
      <div>
        Activation key:
        <b class="user-select">{{ regInfo.license_code || "??" }}</b>
      </div>
      <div>
        Expiration date: <b>{{ regInfo.license_expiry || "??" }}</b>
      </div>
    </div>

    <div class="mb-4">
      <v-btn @click="openDialog" color="primary" rounded depressed>
        <v-icon left>mdi-key</v-icon> Enter activation key
      </v-btn>
    </div>

    <div v-if="reg" class="mb-4">
      <v-btn
        @click="dialogDeactivateConfirm = true"
        color="error"
        rounded
        depressed
        dark
      >
        <v-icon left>mdi-cancel</v-icon>
        <span v-text="`Deactivate key on this device`" />
      </v-btn>
    </div>

    <div v-if="regInfo.license_type !== 'Lifetime'" class="mb-4">
      <v-btn
        @click="openLink('https://mediachips.app/')"
        color="primary"
        rounded
        depressed
      >
        <v-icon left>mdi-cart</v-icon> Buy activation key for life
      </v-btn>
    </div>

    <div v-if="regInfo.license_type !== 'Month'" class="mb-4">
      <v-btn
        @click="openLink('https://patreon.com/mediachips')"
        color="#ff424d"
        rounded
        depressed
        dark
      >
        <v-icon left>mdi-patreon</v-icon>
        {{
          regInfo.license_type !== "Lifetime"
            ? "Subscribe monthly"
            : "Support development"
        }}
      </v-btn>
    </div>

    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      width="800"
      overlay-opacity="0.8"
    >
      <v-stepper v-model="step">
        <v-stepper-header style="height: 50px">
          <v-stepper-step :complete="step > 1" step="1" class="py-0">
            Entering key
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step > 2" step="2" class="py-0">
            Key status
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3" class="py-0"> Registration </v-stepper-step>
        </v-stepper-header>

        <v-divider></v-divider>

        <v-stepper-items>
          <v-stepper-content step="1" class="pa-0">
            <v-card :loading="isQueryRun">
              <v-card-text class="text-center pt-6">
                <v-form
                  v-model="valid"
                  @submit.prevent
                  ref="form"
                  class="d-flex"
                >
                  <v-text-field
                    v-model="licenseKey"
                    @keyup.enter="checkLicenseKey"
                    :rules="[(value) => !!value || 'Key is required']"
                    hint="XXXXXX-XXXXXX-XXXXXX-XXXXXX"
                    label="Activation key"
                    outlined
                    rounded
                    autofocus
                  />
                </v-form>

                <v-alert
                  type="error"
                  :value="checkingStatus.length != 0"
                  text
                  dense
                >
                  {{ checkingStatus }}
                </v-alert>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="dialog = false" class="ma-2 pr-4" text rounded>
                  <v-icon left>mdi-close</v-icon> Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  @click="checkLicenseKey"
                  :disabled="isQueryRun"
                  color="primary"
                  class="ma-2"
                  rounded
                  depressed
                >
                  <v-icon left>mdi-key-variant</v-icon> Check Key Status
                  <v-icon large right>mdi-chevron-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-content step="2" class="pa-0">
            <v-card :loading="isQueryRun">
              <v-card-text class="text-center body-1 pt-8">
                <div class="mb-2">
                  Key: <b>{{ licenseKey }}</b>
                </div>
                <div class="mb-2">
                  Remaining number of devices for registration:
                  <b>{{ numberOfActivations }}</b>
                </div>
                <div>
                  Key expiration date: <b>{{ licenseExpiryDate }}</b>
                </div>
                <v-divider
                  v-if="numberOfActivations == 0 || isKeyExpired"
                  class="my-4"
                />
                <div v-if="numberOfActivations == 0">
                  The number of activations has been exceeded.
                </div>
                <div v-if="isKeyExpired">This key has expired.</div>
                <div v-if="numberOfActivations == 0 || isKeyExpired">
                  Please enter another key for continue.
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="closeDialog" class="ma-2 pr-4" text rounded>
                  <v-icon left>mdi-close</v-icon> Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="step = 1" class="ma-2 pr-4" text rounded>
                  <v-icon large left>mdi-chevron-left</v-icon>
                  <span v-html="`Back to entering key`" />
                </v-btn>
                <v-btn
                  @click="register"
                  color="primary"
                  class="ma-2"
                  :disabled="
                    numberOfActivations == 0 || isQueryRun || isKeyExpired
                  "
                  rounded
                  depressed
                >
                  <v-icon left>mdi-key-variant</v-icon> Register app
                  <v-icon large right>mdi-chevron-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-content step="3" class="pa-0">
            <v-card :loading="isQueryRun" class="pt-4">
              <v-card-text class="text-center body-1">
                <b v-if="reg" class="green--text">Congratulations!</b>
                <b v-else class="red--text">
                  Failed to register the application
                </b>
                <div>{{ registrationStatus }}</div>
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn
                  @click="closeDialog"
                  color="success"
                  block
                  rounded
                  depressed
                >
                  OK
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-dialog>

    <DialogConfirm
      v-if="dialogDeactivateConfirm"
      @close="dialogDeactivateConfirm = false"
      @confirm="deactivateKey"
      :dialog="dialogDeactivateConfirm"
      text="Deactivate the key for this device?"
    />
  </div>
</template>


<script>
const axios = require("axios");
// const shell = require("electron").shell; // TODO check it

export default {
  name: "SettingsRegistration",
  components: {
    DialogConfirm: () => import("@/components/dialogs/DialogConfirm.vue"),
  },
  mounted() {
    if (this.regInfo.length == 0) this.regInfo = JSON.stringify(this.cleanObj);
  },
  data: () => ({
    dialog: false,
    dialogDeactivateConfirm: false,
    step: 1,
    licenseKey: "",
    valid: false,
    isQueryRun: false,
    numberOfActivations: null,
    licenseExpiryDate: "",
    isKeyExpired: false,
    checkingStatus: "",
    registrationStatus: "",
    cleanObj: {
      license_code: "",
      license_created: "",
      license_expiry: "",
      license_type: "",
      client_email: "",
      client_name: "",
      fingerprint_1: "",
      fingerprint_2: "",
      fingerprint_3: "",
    },
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
    r() {
      return this.$store.state.Reg;
    },
    reg() {
      return this.$store.getters.reg;
    },
    regInfo: {
      get() {
        return this.$store.getters.regInfo;
      },
      set(value) {
        this.$store.dispatch("updateRegInfo", value);
      },
    },
  },
  methods: {
    openDialog() {
      this.step = 1;
      this.licenseKey = this.regInfo.license_code || "";
      this.dialog = true;
      this.checkingStatus = "";
    },
    closeDialog() {
      this.dialog = false;
      this.checkingStatus = "";
      setTimeout(() => {
        this.step = 1;
      }, 1000);
    },
    openLink(link) {
      // shell.openExternal(link);
      window.open(link, "_newtab");
    },
    checkLicenseKey() {
      this.$refs.form.validate();
      if (!this.valid) return;
      this.isQueryRun = true;
      let query =
        this.r.domain +
        "check?api_key=" +
        this.r.apiKey +
        "&license_code=" +
        this.licenseKey;
      axios
        .get(query)
        .then((res) => {
          this.isQueryRun = false;
          if (res.status === 200) {
            if (res.data) {
              let fingerprints = [
                res.data.fingerprint_1,
                res.data.fingerprint_2,
                res.data.fingerprint_3,
              ];
              let numberOfActivations = 0;
              for (let i = 0; i < fingerprints.length; i++) {
                if (!fingerprints[i].length) ++numberOfActivations;
              }
              let today = new Date();
              today = today.toISOString().substring(0, 10);
              this.isKeyExpired = today > res.data.license_expiry;
              if (fingerprints.includes(this.r.machineId))
                ++numberOfActivations; // if this device already activated
              this.licenseExpiryDate = res.data.license_expiry;
              this.numberOfActivations = numberOfActivations;
              this.step = 2;
              this.checkingStatus = "";
            } else {
              this.checkingStatus = `Key "${this.licenseKey}" not found`;
            }
          } else {
            this.$store.commit("setNotification", {
              type: "error",
              text: `An internet connection error occurred while checking key`,
            });
          }
        })
        .catch((error) => {
          this.isQueryRun = false;
          this.$store.commit("setNotification", {
            type: "error",
            text: error.res.data.message,
          });
        });
    },
    register() {
      this.isQueryRun = true;
      let query =
        this.r.domain +
        "activate?api_key=" +
        this.r.apiKey +
        "&license_code=" +
        this.licenseKey +
        "&fingerprint=" +
        this.r.machineId;
      axios
        .get(query)
        .then((res) => {
          if (res.status === 200) {
            this.registrationStatus = res.data.message;
            this.regInfo = JSON.stringify(res.data.license);
            this.step = 3;
          } else {
            this.$store.commit("setNotification", {
              type: "error",
              text: `An internet connection error occurred while checking for updates`,
            });
          }
          this.isQueryRun = false;
        })
        .catch((error) => {
          this.isQueryRun = false;
          this.$store.commit("setNotification", {
            type: "error",
            text: error.res.data.message,
          });
        });
    },
    deactivateKey() {
      this.dialogDeactivateConfirm = false;
      let query =
        this.r.domain +
        "deactivate?api_key=" +
        this.r.apiKey +
        "&license_code=" +
        this.regInfo.license_code +
        "&fingerprint=" +
        this.r.machineId;
      axios
        .get(query)
        .then((res) => {
          if (res.status === 200) {
            this.regInfo = JSON.stringify(this.cleanObj);
            this.$store.commit("setNotification", {
              type: "info",
              text: res.data.message,
            });
            this.licenseKey = "";
          } else {
            this.$store.commit("setNotification", {
              type: "error",
              text: `An internet connection error occurred while checking for updates`,
            });
          }
        })
        .catch((error) => {
          this.$store.commit("setNotification", {
            type: "error",
            text: error.res.data.message,
          });
        });
    },
  },
};
</script>