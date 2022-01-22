<template>
  <div class="mx-2">
    <table class="table-meta-in-media-types">
      <thead>
        <tr>
          <th class="diagonal">
            <div>
              <div class="bottom">Meta</div>
              <div class="top">Media</div>
            </div>
          </th>
          <th><span>Videos</span></th>
          <th><span>Pictures</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i of metaAll" :key="i.id">
          <td>
            <div class="d-flex justify-space-between align-center">
              <span>
                <v-icon left>mdi-{{ i.icon }}</v-icon>
                {{ i.name }}
              </span>
              <v-icon left :title="i.type"
                >mdi-{{ getIcon(i.type) }}</v-icon
              >
            </div>
          </td>
          <th>
            <v-icon v-if="isMetaAssigned(i.id)" color="success"
              >mdi-checkbox-marked-circle</v-icon
            >
            <v-icon v-else>mdi-minus</v-icon>
          </th>
          <th>
            <v-icon>mdi-minus</v-icon>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "TableMetaInMediaTypes",
  components: {},
  mounted() {
    this.$nextTick(() => {
      this.getMetaInMediaTypes();
    });
  },
  data: () => ({
    metaInMediaTypes: [],
    metaAll: [],
  }),
  computed: {
    apiUrl() {
      return this.$store.state.localhost;
    },
  },
  methods: {
    getMetaInMediaTypes() {
      let url = `/api/MetaInMediaType`;
      axios
        .get(this.apiUrl + url)
        .then((res) => {
          this.metaInMediaTypes = res.data.assigned;
          this.metaAll = res.data.meta;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    isMetaAssigned(metaId) {
      let assigned = this.metaInMediaTypes.map((i) => i["Meta.id"]);
      return assigned.includes(metaId);
    },
    getIcon(type) {
      if (type === "string") return "alphabetical";
      if (type === "date") return "calendar";
      if (type === "number") return "numeric";
      if (type === "array") return "code-array";
      if (type === "boolean") return "toggle-switch";
      if (type === "rating") return "star";
      if (type === "cards") return "card-bulleted";
      return "shape";
    },
  },
};
</script>


<style lang="scss" scoped>
.table-meta-in-media-types {
  border-collapse: collapse;
  thead {
    th:not(:first-child) {
      font-weight: normal;
      position: relative;
      padding: 5px;
      z-index: 1;
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--v-primary-base);
        opacity: 0.3;
        z-index: -1;
      }
    }
  }
  tr {
    position: relative;
    z-index: 1;
    &:hover {
      &::before {
        opacity: 0.3 !important;
      }
    }
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: var(--v-secondary-base);
      opacity: 0;
      z-index: -1;
    }
    &:nth-of-type(even) {
      &::before {
        opacity: 0.1;
      }
    }
  }
  td:first-child {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--v-secondary-base);
      opacity: 0.15;
      z-index: -1;
    }
  }
  td {
    width: 100%;
    padding: 5px;
  }
}
.diagonal {
  height: 50px;
  padding: 0;
  margin: 0;
  font-weight: normal;
}
.diagonal > div {
  position: relative;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}
.top {
  position: absolute;
  padding-right: 5px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: var(--v-primary-base);
    clip-path: polygon(0 0, 100% 0, 100% 100%);
    opacity: 0.3;
    z-index: -1;
  }
}
.bottom {
  position: absolute;
  padding-left: 5px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--v-secondary-base);
    clip-path: polygon(100% 100%, 0 100%, 0 0);
    opacity: 0.3;
    z-index: -1;
  }
}
</style>