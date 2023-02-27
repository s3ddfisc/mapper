<template>
  <v-app scrollable>
    <v-app-bar title="MAPPER" />
    <Navigation />
    <ContentFrame />
    <UseCaseForm v-model="configStore.useCaseForm" />
  </v-app>
</template>

<script lang="ts">
  import Navigation from './components/Navigation.vue'
  import ContentFrame from './components/ContentFrame.vue'
  import UseCaseForm from './components/UseCaseForm.vue'
  import { mapStores } from 'pinia'
  import { useConfig } from './dataStore/config'

  export default {
    name: 'App',
    components: {
      ContentFrame,
      Navigation,
      UseCaseForm,
    },
    computed: {
      ...mapStores(useConfig),
    },
  }
</script>

<style>
.custom-tooltip {
  background-color: azure !important;
  opacity: 0.95 !important;
}
</style>
