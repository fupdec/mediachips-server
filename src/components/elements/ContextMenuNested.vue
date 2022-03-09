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

          <ContextMenuNested v-else-if="sub.type == 'menu'" :item="sub" />
        </div>
      </v-list-group>
    </v-list>

    <v-menu v-else :value="item.show" min-width="150" nudge-top="3" offset-x>
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
            <v-icon
              left
              size="18"
              :color="item.color"
              v-html="`mdi-${item.icon}`"
            />
            <span v-html="item.name" />
          </v-list-item-title>
          <v-icon size="22">mdi-menu-right</v-icon>
        </v-list-item>
      </template>

      <v-list class="context-menu" dense>
        <div class="wrapper">
          <div v-for="(sub, i) in item.menu" :key="i">
            <v-list-item
              v-if="sub.type == 'item'"
              @mouseover="open"
              @mouseup="activate(sub.action)"
              class="pr-1"
              link
            >
              <v-list-item-title class="pr-6">
                <v-icon
                  left
                  size="18"
                  :color="sub.color"
                  v-html="`mdi-${sub.icon}`"
                />
                <span v-html="sub.name" />
              </v-list-item-title>
            </v-list-item>

            <v-divider v-else-if="sub.type == 'divider'" class="ma-1" />

            <ContextMenuNested
              v-else-if="sub.type == 'menu'"
              @showParent="showCurrent"
              :item="sub"
            />
          </div>
        </div>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import Vue from "vue";
import ContextMenuNested from "@/components/elements/ContextMenuNested.vue";

export default {
  name: "ContextMenuNested",
  props: {
    item: Object,
  },
  components: { ContextMenuNested },
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
      this.hideNested();
      this.showCurrent();
      this.$emit("showParent");
    },
    showCurrent() {
      Vue.set(this.item, "show", true);
    },
    hideNested() {
      const hideMenu = (entry) => {
        for (let i of entry) {
          Vue.set(i, "show", false);
          if (i.type == "menu") hideMenu(i.menu);
        }
      };
      hideMenu(this.menu.content);
    },
  },
};
</script>