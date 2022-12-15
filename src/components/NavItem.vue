<script lang="ts">
  export default {
    name: 'NavItem',
    props: ['navitem'],
    methods: {
      toggle () {
        this.$emit('toggle', this.navitem)
      },
    },
  }
</script>

<template>
  <v-list-item
    :prepend-icon="navitem.icon"
    :title="navitem.title"
    :value="navitem.value"
    :active="navitem.active"
    @click="toggle"
  />
</template>
