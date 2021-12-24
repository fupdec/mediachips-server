<template>
  <v-dialog v-if="dialog" :value="dialog" @input="close" width="800" scrollable>
    <v-card>
      <div class="d-flex pa-4">
        <div class="headline">Icon selection</div>
        <v-spacer class="mx-2"></v-spacer>
        <v-btn @click="close" outlined>
          <v-icon left>mdi-close</v-icon> Cancel
        </v-btn>
      </div>
      
      <v-divider></v-divider>

      <v-card-text class="text-center px-4">
        <v-data-iterator
          :items="icons"
          :items-per-page="50"
          :search="search"
          :footer-props="{ 'items-per-page-options': [50, 100, 200] }"
        >
          <template v-slot:header>
            <v-spacer class="py-2"></v-spacer>
            <v-text-field
              v-model="search"
              clearable
              dense
              rounded
              outlined
              prepend-inner-icon="mdi-magnify"
              label="Search"
              style="max-width: 300px; width: 80%; margin: auto"
            />
          </template>

          <template v-slot:default="props">
            <div class="d-flex flex-wrap justify-center">
              <v-icon
                v-for="item in props.items"
                :key="item.id"
                @click="apply(item.name)"
                class="ma-2 pa-2"
                x-large
                :title="item.name"
                >mdi-{{ item.name }}</v-icon
              >
            </div>
          </template>
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


<script>
import icons from "@/assets/material-icons.json";

export default {
  name: "DialogIcons",
  props: {},
  components: {},
  mounted() {
    this.$nextTick(function () {
      this.dialog = true;
    });
  },
  data: () => ({
    dialog: false,
    icons: icons,
    page: 1,
    search: "",
    filter: {},
    sortBy: "Name",
    sortDesc: false,
  }),
  methods: {
    close() {
      this.$emit("close");
    },
    apply(icon) {
      this.$emit("apply", icon);
    },
  },
};
</script>