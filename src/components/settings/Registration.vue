<template>
  <v-card outlined class="mb-6 pa-4 mx-2">
    <div class="headline text-h5 text-center pb-4">Registration</div>

    <v-row>
      <v-col cols="12" sm="6" align="center">
        <v-btn @click="openDialog" color="primary" rounded depressed>
          <v-icon left>mdi-key-variant</v-icon> Register with a license key
        </v-btn>
      </v-col>

      <v-col cols="12" sm="6" align="center">
        <v-btn
          v-if="regInfo.license_type !== 'Lifetime'"
          @click="openLink('https://mediachips.app/')"
          color="primary"
          class="mb-2"
          rounded
          depressed
        >
          <v-icon left>mdi-cart</v-icon> Buy lifetime license key
        </v-btn>

        <v-btn
          v-if="regInfo.license_type !== 'Month'"
          @click="openLink('https://patreon.com/mediachips')"
          color="#ff424d"
          rounded
          depressed
        >
          <v-icon left>mdi-patreon</v-icon>
          {{
            regInfo.license_type !== "Lifetime"
              ? "Subscribe monthly"
              : "Support development"
          }}
        </v-btn>
      </v-col>
    </v-row>

    <div v-if="regInfo" class="d-flex justify-space-between flex-wrap mt-4">
      <div class="">
        <div>
          License key:
          <span class="user-select">{{ regInfo.license_code || "??" }}</span>
        </div>
        <div>Expiration date: {{ regInfo.license_expiry || "??" }}</div>
      </div>

      <span class="d-flex flex-column align-center">
        <v-chip
          :color="reg ? 'success' : 'error'"
          class="text-uppercase"
          outlined
          label
        >
          <span>Application {{ reg ? "registered" : "not registered" }}</span>
        </v-chip>

        <v-btn
          v-if="reg"
          @click="deactivateKey"
          color="error"
          class="mt-2"
          small
          rounded
          depressed
          dark
        >
          <v-icon left>mdi-cancel</v-icon> Deactivate key
        </v-btn>
      </span>
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
                  ref="license"
                  class="d-flex"
                >
                  <v-text-field
                    v-model="licenseKey"
                    @keyup.enter="checkLicenseKey"
                    :rules="[(value) => !!value || 'Key is required']"
                    hint="XXXXXX-XXXXXX-XXXXXX-XXXXXX"
                    label="License key"
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
                <div>
                  Key: <b>{{ licenseKey }}</b>
                </div>
                <div>
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
                  <span v-html="`Back to entering key`"/>
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
            <v-card :loading="isQueryRun">
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
  </v-card>
</template>


<script>
const axios = require("axios");
// const shell = require("electron").shell; // TODO check it

export default {
  name: "Registration",
  mounted() {
    if (this.regInfo.length == 0) this.regInfo = JSON.stringify(this.cleanObj);
  },
  data: () => ({
    dialog: false,
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
    },
    checkLicenseKey() {
      this.$refs.license.validate();
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