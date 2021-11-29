<template>
  <TableMetaInMediaTypes/>  
</template>


<script>
import TableMetaInMediaTypes from '@/components/settings/TableMetaInMediaTypes.vue'

export default {
  name: 'Settings',
  components: {
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