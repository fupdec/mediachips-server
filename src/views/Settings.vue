<template>
  <v-container>
    <vuescroll>
      <div style="max-height:400px;">
        <TableMetaInMediaTypes/>
      </div>
    </vuescroll>
  </v-container>
</template>


<script>
import vuescroll from 'vuescroll'
import TableMetaInMediaTypes from '@/components/settings/TableMetaInMediaTypes.vue'

export default {
  name: 'Settings',
  components: {
    vuescroll,
    TableMetaInMediaTypes,
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  data: ()=>({
  }),
  computed: {
  },
  methods: {
  },
  watch: {
  }
}
</script>