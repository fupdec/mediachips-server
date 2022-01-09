<template>
  <v-card outlined x-large class="filter-row pa-2">
    <v-autocomplete
      @input="setBy($event)"
      :value="filter.by"
      :items="listBy"
      label="By"
      outlined
      dense
      class="by"
      hide-selected
      :disabled="filter.lock"
      hide-details
      item-value="by"
    >
      <template v-slot:selection="data">
        <v-icon>mdi-{{ data.item.icon }}</v-icon>
        <span class="mx-2">{{ data.item.name }}</span>
      </template>
      <template v-slot:item="data">
        <div class="list-item">
          <v-icon left>mdi-{{ data.item.icon }}</v-icon>
          <span>{{ data.item.name }}</span>
        </div>
      </template>
    </v-autocomplete>

    <v-autocomplete
      @input="setCond($event)"
      :value="filter.cond"
      :items="listCond"
      :prepend-icon="`mdi-${iconCond}`"
      :disabled="filter.lock"
      label="Condition"
      class="cond"
      item-value="by"
      outlined
      dense
      hide-details
      hide-selected
    >
      <template v-slot:selection="data">
        <v-icon>mdi-{{ data.item.icon }}</v-icon>
        <span class="mx-2">{{ data.item.name }}</span>
      </template>
      <template v-slot:item="data">
        <div class="list-item">
          <v-icon left>mdi-{{ data.item.icon }}</v-icon>
          <span>{{ data.item.name }}</span>
        </div>
      </template>
    </v-autocomplete>

    <v-text-field
      v-if="filter.type === 'string' || filter.type === null"
      @input="setVal($event, i)"
      :value="filter.val"
      :disabled="
        filter.lock || filter.cond == 'empty' || filter.cond == 'not empty'
      "
      label="Value"
      outlined
      dense
      class="val"
      :hint="getHint(filter.by)"
      hide-details
    />

    <v-text-field
      v-if="filter.type === 'number'"
      label="Value"
      outlined
      dense
      class="val"
      @input="setVal($event, i)"
      :value="filter.val"
      type="number"
      :disabled="
        filter.lock || filter.cond == 'empty' || filter.cond == 'not empty'
      "
      :hint="getHintNumber(filter.by, filter.val)"
      persistent-hint
    />

    <v-text-field
      v-if="filter.type === 'date'"
      :disabled="
        filter.lock || filter.cond == 'empty' || filter.cond == 'not empty'
      "
      :value="filter.val"
      @click="(datePicker = true), (datePickerIndex = i)"
      label="Date"
      outlined
      dense
      readonly
      class="val"
      :hint="getHint(filter.by)"
      persistent-hint
    />
    <v-dialog v-model="datePicker" width="300px">
      <v-date-picker
        v-if="filter.type === 'date'"
        @change="setVal($event, datePickerIndex), (datePicker = false)"
        :max="new Date().toISOString().substr(0, 10)"
        min="1950-01-01"
        :value="filters[datePickerIndex].val"
        no-title
        color="primary"
        full-width
      />
    </v-dialog>

    <v-select
      v-if="filter.type === 'array'"
      @input="setVal($event, i)"
      :value="filter.val"
      class="val"
      :items="getItems(filter.by)"
      label="Values"
      item-text="name"
      item-value="id"
      :disabled="
        filter.lock || filter.cond == 'empty' || filter.cond == 'not empty'
      "
      outlined
      dense
      multiple
      :hint="getHint(filter.by)"
      persistent-hint
    />

    <v-autocomplete
      v-if="filter.type === 'select'"
      :items="getCards(filter.by)"
      @input="setVal($event, i)"
      :value="filter.val"
      outlined
      multiple
      hide-selected
      dense
      :ref="filter.by"
      label="Values"
      item-value="id"
      class="val hidden-close"
      :menu-props="{ contentClass: 'list-with-preview' }"
      :disabled="
        filter.lock || filter.cond == 'empty' || filter.cond == 'not empty'
      "
      :filter="filterCards"
      :hint="getHint(filter.by)"
      persistent-hint
    >
      <template v-slot:selection="data">
        <v-chip
          v-bind="data.attrs"
          close
          class="my-1 px-2"
          small
          @click="data.select"
          :input-value="data.selected"
          @click:close="removeItem(data.item.id, i)"
          :color="getColor(filter.by, data.item.id)"
          :label="getMeta(filter.by).settings.chipLabel"
          :outlined="getMeta(filter.by).settings.chipOutlined"
          @mouseover.stop="showImage($event, data.item.id, 'meta', filter.by)"
          @mouseleave.stop="$store.state.hoveredImage = false"
        >
          <span>{{ data.item.meta.name }}</span>
        </v-chip>
      </template>
      <template v-slot:item="data">
        <div
          class="list-item"
          @mouseover.stop="showImage($event, data.item.id, 'meta', filter.by)"
          @mouseleave.stop="$store.state.hoveredImage = false"
        >
          <span v-if="getMeta(filter.by).settings.favorite">
            <v-icon
              :color="data.item.meta.favorite ? 'pink' : ''"
              left
              size="14"
              >mdi-heart</v-icon
            >
          </span>
          <span v-if="getMeta(filter.by).settings.color">
            <v-icon :color="data.item.meta.color || ''" left small>
              mdi-{{ getMeta(filter.by).settings.icon }}</v-icon
            >
          </span>
          <span>{{ data.item.meta.name }}</span>
          <span v-if="getMeta(filter.by).settings.synonyms" class="aliases">
            {{
              data.item.meta.synonyms === undefined
                ? ""
                : data.item.meta.synonyms.join(", ").slice(0, 50)
            }}
          </span>
        </div>
      </template>
    </v-autocomplete>

    <v-card-actions class="pa-0">
      <v-btn
        @click="duplicate"
        title="Duplicate filter"
        class="ma-1"
        color="green"
        outlined
        icon
        fab
        x-small
        :disabled="filter.type == 'boolean'"
      >
        <v-icon>mdi-content-duplicate</v-icon>
      </v-btn>

      <v-btn
        @click="remove"
        :disabled="filter.lock"
        class="ma-1"
        color="red"
        outlined
        icon
        fab
        x-small
        title="Remove filter"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
export default {
  props: {
    filter: Object,
  },
  mounted() {
    this.$nextTick(function () {});
  },
  data: () => ({
    listBy: [],
    datePicker: false,
  }),
  computed: {
    listCond() {
      return [];
    },
    iconCond() {
      return "shape";
    },
  },
  methods: {
    setCond() {},
    duplicate() {
      this.$emit("duplicate");
    },
    getHint() {},
    remove() {
      this.$emit("remove");
    },
  },
};
</script>