<template>
  <v-container>
    <DarkMode />

    <vuescroll>
      <div style="max-height: 400px">
        <TableMetaInMediaTypes />
      </div>
    </vuescroll>
  </v-container>
</template>


<script>
import vuescroll from "vuescroll";
import DarkMode from "@/components/settings/DarkMode.vue";
import TableMetaInMediaTypes from "@/components/settings/TableMetaInMediaTypes.vue";

export default {
  name: "Settings",
  components: {
    vuescroll,
    DarkMode,
    TableMetaInMediaTypes,
  },
};
</script>