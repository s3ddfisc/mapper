<script lang="ts">
  import { mapStores } from 'pinia'
  import { useConfig } from '../dataStore/config'
  import { useStrategic } from '../dataStore/strategic'

  export default {
    name: 'StrategicGoals',
    computed: {
      ...mapStores(useStrategic, useConfig),
    },
  }
</script>

<template>
  <div>
    <v-container align="start">
      <v-btn prepend-icon="mdi-plus-box" variant="outlined" @click="strategicStore.addGoal"> Add Strategic Goal</v-btn>
    </v-container>
    <v-container v-for="(value, index) in strategicStore.categories[0].items" :key="index">
      <v-row justify="space-between" style="height: 55px">
          <v-col align="start">
            <v-text-field
                v-model="value.label"
                density="compact"
                clearable
              />
          </v-col>
          <v-col align ="start">
            <v-text-field
              v-model.number="value.weight"
              type="number"
              style="width: 75px"
              density="compact"
              @click="configStore.updateScores()"
            />
          </v-col>
          <v-col align="end">
            <v-btn append-icon="mdi-trash-can" variant="outlined" color="red" @click="strategicStore.deleteGoal(index)" />
          </v-col>
      </v-row>
    </v-container>
  </div>
</template>
