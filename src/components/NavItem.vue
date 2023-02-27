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
  >
    <v-tooltip open-delay=1000 content-class="custom-tooltip" activator="parent" location="bottom">
      <span style="white-space: pre;" v-html="navitem.description" />
    </v-tooltip>
  </v-list-item>
</template>
