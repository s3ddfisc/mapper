<script lang="ts">
  import { mapStores } from 'pinia'
  import { useUseCase } from '../dataStore/useCase'

  export default {
    name: 'StrategicGoals',
    computed: {
      ...mapStores(useUseCase),
    },
  }
</script>

<template>
  <div>
    <v-container align="start">
      <v-btn prepend-icon="mdi-plus-box" variant="outlined" @click="useCaseStore.addGoal"> Add Strategic Goal</v-btn>
    </v-container>
    <v-container v-for="(value, index) in useCaseStore.categories[0].items" :key="index">
      <v-row justify="space-between" style="height: 55px">
          <v-col align="start">
            <v-text-field
                v-model="value.label"
                density="compact"
                clearable
              />
          </v-col>
          <v-col align="end">
            <v-btn append-icon="mdi-trash-can" variant="outlined" color="red" @click="useCaseStore.deleteGoal(index)" />
          </v-col>
      </v-row>
    </v-container>
  </div>
</template>
