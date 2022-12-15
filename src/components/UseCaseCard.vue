<script lang="ts">
  import { mapStores } from 'pinia'
  import { useConfig } from '../dataStore/config'
  import { useProcess } from '../dataStore/process'
  import { useUseCase } from '../dataStore/useCase'

  export default {
    name: 'UseCaseCard',
    props: ['id'],
    computed: {
      ...mapStores(useUseCase, useConfig, useProcess),
      inFilter () {
        return this.processStore.selectedProcesses.includes(this.useCaseStore.getProcesslabelById(this.id))
      },
    },
    methods: {
      edit () {
        this.useCaseStore.setUseCaseData(this.id)
        this.configStore.setUseCaseEditMode(true)
        this.configStore.setUseCaseForm()
      },
    },
  }
</script>

<template>
  <v-card v-if="this.inFilter" hover rounded min-width="100" @click="edit">
    <v-card-title>{{ useCaseStore.getLabelById(id) }}</v-card-title>
    <v-card-subtitle>{{ useCaseStore.getProcesslabelById(id) + ' / ID: ' +
      useCaseStore.getIdById(id)
    }}</v-card-subtitle><br />
    <v-progress-linear
      :model-value="useCaseStore.getScoreById(id)"
      color="primary"
      bg-color="primary"
      height="20"
    >
      <strong>{{ useCaseStore.getScoreById(id) }}%</strong>
    </v-progress-linear>
  </v-card>
</template>
