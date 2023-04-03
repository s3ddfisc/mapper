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
        return this.processStore.selectedProcesses.includes(this.processStore.getLabelById(this.useCaseStore.getProcessIdById(this.id)))
      },
    },
    methods: {
      edit () {
        this.configStore.setUseCaseForm(this.id)
      },
    },
  }
</script>

<template>
  <v-card v-if="this.inFilter" hover rounded min-width="100" @click="edit">
    <v-card-title>{{ useCaseStore.getLabelById(id) }}</v-card-title>
    <v-card-subtitle>{{ this.processStore.getLabelById(this.useCaseStore.getProcessIdById(this.id)) + ' / ID: ' +
      useCaseStore.getIdById(id)
    }}</v-card-subtitle><br />
    <v-row>
      <v-col align="end">
        <v-progress-circular
          color="blue"
          :width=5
          :model-value="this.useCaseStore.getItemScoreByIdLabel(this.id, 'Strategic goals') * 25 - 25"
        >
          S
        </v-progress-circular>
      </v-col>
      <v-col align="center">
        <v-progress-circular
        color="red"
        :width=5
        :model-value="this.useCaseStore.getItemScoreByIdLabel(this.id, 'Risk minimization') * 25 - 25"
      >
          R
        </v-progress-circular>
      </v-col>
      <v-col align="start">
        <v-progress-circular
          color="green"
          :width=5
          :model-value="this.useCaseStore.getItemScoreByIdLabel(this.id, 'Value potential') * 25 - 25"
        >
          V
        </v-progress-circular>
      </v-col>
    </v-row><br />
    <v-progress-linear
      :model-value="useCaseStore.getScoreById(id)"
      color="secondary"
      bg-color="primary"
      height="20"
    >
      <strong>{{ useCaseStore.getScoreById(id) }}</strong>
    </v-progress-linear>
  </v-card>
</template>
