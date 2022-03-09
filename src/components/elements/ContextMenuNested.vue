<template>
  <div>
    <v-list v-if="$vuetify.breakpoint.xs" class="py-0 px-0" dense rounded>
      <v-list-group :prepend-icon="'mdi-' + item.icon">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title> {{ item.name }} </v-list-item-title>
          </v-list-item-content>
        </template>

        <div v-for="(sub, i) in item.menu" :key="i" style="padding-left: 20px">
          <v-list-item
            v-if="sub.type == 'item'"
            @mouseup="activate(sub.action)"
            link
          >
            <v-list-item-icon>
              <v-icon :color="sub.color">mdi-{{ sub.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="sub.name"></v-list-item-title>
          </v-list-item>

          <ContextMenuNested
            v-else-if="sub.type == 'menu'"
            :item="sub"
            :depth="Number(depth) + 1"
          />
        </div>
      </v-list-group>
    </v-list>

    <v-menu
      v-else
      v-model="show"
      :open-on-click="false"
      :close-on-content-click="false"
      min-width="150"
      nudge-top="3"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <v-list-item
          v-on="on"
          v-bind="attrs"
          @mouseover="open"
          :disabled="item.disabled"
          class="pr-1"
          link
        >
          <v-list-item-title>
            <v-icon left size="18" :color="item.color">
              mdi-{{ item.icon }}
            </v-icon>
            {{ item.name }}
          </v-list-item-title>
          <v-icon size="22">mdi-menu-right</v-icon>
        </v-list-item>
      </template>

      <v-list class="context-menu" dense>
        <div class="wrapper">
          <div v-for="(sub, i) in item.menu" :key="i">
            <v-list-item
              v-if="sub.type == 'item'"
              @mouseover="hideChildMenu(i)"
              @mouseup="activate(sub.action)"
              class="pr-1"
              link
            >
              <v-list-item-title>
                <v-icon left size="18" :color="sub.color">
                  mdi-{{ sub.icon }}
                </v-icon>
                {{ sub.name }}
              </v-list-item-title>
              <div class="px-3" />
            </v-list-item>

            <v-divider v-else-if="sub.type == 'divider'" class="ma-1" />

            <ContextMenuNested
              v-else-if="sub.type == 'menu'"
              :ref="'child' + i"
              :item="sub"
            />
          </div>
        </div>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import ContextMenuNested from "@/components/elements/ContextMenuNested.vue";

export default {
  name: "ContextMenuNested",
  props: {
    item: Object,
  },
  components: { ContextMenuNested },
  data: () => ({
    show: false,
    timeout: null,
  }),
  computed: {
    menu: {
      get() {
        return this.$store.state.contextMenu;
      },
      set(value) {
        this.$store.state.contextMenu = value;
      },
    },
  },
  methods: {
    activate(originalFunction) {
      originalFunction();
      this.menu.show = false;
    },
    open() {
      // if (this.menu.child) this.$emit("hide");
      // else {
        clearTimeout(this.timeout);
        this.show = true;
        this.menu.child = true;
      // }
    },
    hide() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.show = false;
      }, 10);
    },
    hideChildMenu(i) {
      return;
      for (let ref in this.$refs)
        if (ref == "child" + i) this.$refs[ref][0].hide();
    },
  },
};
</script>