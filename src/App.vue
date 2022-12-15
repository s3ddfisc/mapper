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
    /*
    methods: {
      updateUseCase (useCaseData) {
        /*
        let processExists = false
        this.processes.forEach((key, value) => {
          if (value.label === process) {
            processExists = true
            // update values
          }
        })
        if (!processExists) {
          this.processes.push({ id: this.processes.length, label: process })
          this.processlabels.push(process)
          this.processlabels.sort((a, b) => (a < b ? -1 : 1))
        }
        this.useCases.push({
          id: this.useCases.length,
          label: useCaseData.label,
          processLabel: useCaseData.processlabel,
          bucketID: 1,
          property1: useCaseData.property1,
          property2: useCaseData.property2,
          property3: useCaseData.property3,
          score: Math.random(),
        })
        this.setUseCaseForm()
      },
      editUseCase (useCaseID) {
        this.emitter.emit('startEditMode', useCaseID)
        this.setUseCaseForm()
      }, */
  }
</script>
