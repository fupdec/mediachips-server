<template>
  <div>
    <v-bottom-sheet
      v-if="$vuetify.breakpoint.xs"
      v-model="menu.show"
      content-class="bottom-menu-mobile"
      width="500"
    >
      <v-card max-height="80vh" class="menu">
        <v-list dense class="px-2">
          <div v-for="(item, i) in menu.content" :key="i">
            <v-list-item
              v-if="item.type == 'item'"
              @mouseup="activate(item.action)"
              :disabled="item.disabled"
              class="pr-1"
              link
            >
              <v-list-item-icon>
                <v-icon :color="item.color"> mdi-{{ item.icon }} </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title v-html="item.name" />
              </v-list-item-content>
            </v-list-item>

            <v-divider v-else-if="item.type == 'divider'" class="ma-1" />

            <ContextMenuNested v-else-if="item.type == 'menu'" :item="item" />
          </div>
        </v-list>
      </v-card>
    </v-bottom-sheet>

    <v-menu
      v-else
      v-model="menu.show"
      :open-on-click="false"
      :close-on-content-click="false"
      :position-x="menu.x"
      :position-y="menu.y"
      :transition="false"
      z-index="1000"
      min-width="150"
      leave-absolute
      absolute
      offset-y
    >
      <v-list dense class="context-menu">
        <div class="wrapper">
          <div v-for="(item, i) in menu.content" :key="i">
            <v-list-item
              v-if="item.type == 'item'"
              @mouseover="hideChildMenu"
              @mouseup="activate(item.action)"
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
              <div class="px-3" />
            </v-list-item>

            <v-divider v-else-if="item.type == 'divider'" class="ma-1" />

            <ContextMenuNested
              v-else-if="item.type == 'menu'"
              @hide="hideChildMenu"
              :ref="'child' + i"
              :item="item"
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
  name: "ContextMenu",
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
    hideChildMenu() {
      return
      for (let ref in this.$refs) this.$refs[ref][0].hide();
      this.menu.child = false;
    },
  },
};
</script>