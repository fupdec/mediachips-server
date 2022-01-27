<template>
  <div>
    <!-- Video meta -->
    <v-chip v-if="type == 'video'" label outlined>
      <v-icon left>mdi-monitor-screenshot</v-icon>
      {{ metadata.resolution }}
    </v-chip>
    <v-chip v-if="type == 'video'" label outlined>
      <v-icon left>mdi-harddisk</v-icon>
      {{ metadata.filesize }}
    </v-chip>
    <v-chip v-if="type == 'video'" label outlined>
      <v-icon left>mdi-file-video-outline</v-icon>
      {{ metadata.fileExtension }}
    </v-chip>

    <v-chip
      v-for="i in items"
      :key="i.itemId + Date.now()"
      @mouseover.stop="hoverImage($event, i['item.metaId'], i.itemId)"
      @mouseleave.stop="$store.state.hover.show = false"
      :color="i['item.color']"
      :text-color="getTextColor(i['item.color'])"
    >
      <v-icon class="mr-1">mdi-{{ i.meta.icon }}</v-icon>
      {{ i["item.name"] }}
    </v-chip>

    <v-chip
      v-for="(v, i) in values"
      :key="i"
      label
      outlined
      :title="v.meta.name"
    >
      <v-icon class="mr-1">mdi-{{ v.meta.icon }}</v-icon>
      {{ v.value }}
    </v-chip>

    <!-- Parse meta -->
    <!-- <div v-for="(m,i) in metaAssignedToVideos" :key="i">
        <div v-if="visibility[m.id]&&checkShowEmptyValue(m)" class="meta-in-card">
          <v-chip-group v-if="m.type=='complex'" column>
            <v-icon :title="getMeta(m.id).settings.name">mdi-{{getMeta(m.id).settings.icon}}</v-icon>
            <v-chip v-for="mc in video[m.id]" :key="mc" 
              :color="getColor(m.id,mc)" 
              :label="getMeta(m.id).settings.chipLabel"
              :outlined="getMeta(m.id).settings.chipOutlined"
              :title="`Open page with ${getMeta(m.id).settings.nameSingular.toLowerCase()}`"
              @click="openMetaCardPage(m.id,mc)"
              @click.middle="openMetaInNewTab(mc)"
              @mouseover.stop="showImage($event,mc,'meta',m.id)" 
              @mouseleave.stop="$store.state.hoveredImage=false"> 
                {{ getCard(mc).meta.name }} </v-chip>
          </v-chip-group>
          <div v-else-if="m.type=='simple'" class="simple-meta">
            <v-icon :title="getMeta(m.id).settings.name">mdi-{{getMeta(m.id).settings.icon}}</v-icon>
            <span v-if="getMeta(m.id).type=='array'">{{getArrayValuesForCard(m.id, 'video')}}</span>
            <span v-else-if="getMeta(m.id).type=='rating'">      
              <v-rating :value="video[m.id]" @input="changeMetaRating($event, m.id)" :length="getMeta(m.id).settings.ratingMax" hover 
                :full-icon="`mdi-${getMeta(m.id).settings.ratingIcon}`" :empty-icon="`mdi-${getMeta(m.id).settings.ratingIconEmpty||getMeta(m.id).settings.ratingIcon}`" 
                :color="getMeta(m.id).settings.ratingColor" background-color="grey" class="meta-rating" clearable
                :half-increments="getMeta(m.id).settings.ratingHalf" :half-icon="`mdi-${getMeta(m.id).settings.ratingIconHalf||getMeta(m.id).settings.ratingIcon}`"/>
            </span>
            <span v-else-if="getMeta(m.id).type=='boolean'">{{video[m.id]?'Yes':'No'}}</span>
            <span v-else>{{video[m.id]}}</span>
          </div>
        </div>
      </div> -->
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "NestedItems",
  props: {
    items: Array,
    values: Array,
    metadata: Object,
    type: String,
  },
  methods: {
    getTextColor(color) {
      if (!color) return "";
      let value = Vue.prototype.$checkColorForDarkText(color);
      if (value) return "white";
      else return "black";
    },
    hoverImage(event, metaId, itemId) {
      Vue.prototype.$showHoverImage(event, metaId, itemId);
    },
  },
};
</script>