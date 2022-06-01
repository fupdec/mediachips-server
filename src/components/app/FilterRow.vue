<template>
  <v-form ref="form" v-model="valid">
    <v-card class="mb-2 pa-2" hover :disabled="filter.lock">
      <div class="d-flex align-center">
        <v-icon v-if="filter.lock" small left>mdi-lock</v-icon>
        <v-btn v-else @click="remove" color="error" class="mr-2" icon small>
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-icon left>mdi-{{ icon }}</v-icon>
        <div class="body-2">{{ title }}</div>

        <v-select
          @input="setCond($event)"
          :value="filter.cond"
          :items="getListCond(filter.type)"
          :rules="[(v) => !!v || 'Condition is required']"
          item-value="cond"
          class="filter-cond ml-4 mt-0 pt-0"
          hide-details
          dense
        >
          <template v-slot:selection="data">
            <v-icon>mdi-{{ data.item.icon }}</v-icon>
          </template>
          <template v-slot:item="data">
            <div class="list-item">
              <v-icon left>mdi-{{ data.item.icon }}</v-icon>
              <span>{{ data.item.text }}</span>
            </div>
          </template>
        </v-select>
      </div>

      <v-text-field
        v-if="filter.type === 'string' || filter.type === null"
        @input="setVal($event)"
        :value="filter.val"
        :disabled="
          filter.lock || filter.cond == 'is null' || filter.cond == 'not null'
        "
        class="mt-0 pt-0"
        hide-details
      />

      <v-text-field
        v-if="filter.type === 'number'"
        @input="setVal($event)"
        :value="filter.val"
        :disabled="
          filter.lock || filter.cond == 'is null' || filter.cond == 'not null'
        "
        type="number"
        class="mt-0 pt-0"
        hide-details
      />

      <v-text-field
        v-if="filter.type === 'date'"
        @click="pickDate"
        :value="filter.val"
        :disabled="
          filter.lock || filter.cond == 'is null' || filter.cond == 'not null'
        "
        class="mt-0 pt-0"
        readonly
        hide-details
      />

      <MetaInputArray
        v-if="filter.type === 'array' && /\d/.test(filter.param)"
        @input="setVal($event)"
        :metaId="filter.param"
        :cond="filter.cond"
        :value="filter.val"
        :disabled="
          filter.lock || filter.cond == 'is null' || filter.cond == 'not null'
        "
        dialog="filtering"
      />

      <MetaInputCountry
        v-if="filter.param === 'country'"
        @input="setVal($event)"
        :cond="filter.cond"
        :value="filter.val"
        :disabled="
          filter.lock || filter.cond == 'is null' || filter.cond == 'not null'
        "
        dialog="filtering"
      />
    </v-card>
  </v-form>
</template>


<script>
import Vue from "vue";

export default {
  name: "FilterSet",
  props: {
    filter: Object,
    index: Number,
    listBy: Array,
  },
  components: {
    MetaInputArray: () => import("@/components/meta/input/MetaInputArray.vue"),
    MetaInputCountry: () =>
      import("@/components/meta/input/MetaInputCountry.vue"),
  },
  mounted() {
    this.getParamData(this.filter.param);
  },
  data: () => ({
    icon: "shape",
    title: "",
    valid: false,
    listItems: [],
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
  },
  methods: {
    getParamData(data) {
      let param = _.find(this.listBy, (i) => i.param === data);
      if (param) {
        this.icon = param.icon;
        this.title = param.text;
      }
    },
    setCond(val) {
      this.$emit("setCond", val);
    },
    setVal(val) {
      this.$emit("setVal", val);
    },
    remove() {
      this.$emit("remove");
    },
    getListCond(type) {
      return Vue.prototype.$getListCond(type);
    },
    pickDate() {
      this.$emit("pickDate");
    },
    validate() {
      this.$refs.form.validate();
    },
  },
  watch: {
    valid(val) {
      this.$emit("valid", val);
    },
  },
};
</script>