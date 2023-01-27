<script lang="ts">
  import { mapStores } from 'pinia'
  import { useConfig } from '../dataStore/config'
  import { useProcess } from '../dataStore/process'

  export default {
    name: 'ProcessRepository',
    data () {
      return {
        activePanel: [],
      }
    },
    computed: {
      ...mapStores(useProcess, useConfig),
    },
    methods: {
      addProcess () {
        this.processStore.addProcess()
      },
      // deletionTriggered (index) {},
    },
  }
</script>

<template>
  <v-container fluid>
    <v-app-bar>
      <v-btn prepend-icon="mdi-plus-box" variant="outlined" @click="addProcess"> Add Process</v-btn>
    </v-app-bar>
    <v-expansion-panels v-model="activePanel">
      <v-expansion-panel v-for="process of processStore.processes" :key="process.id">
        <v-expansion-panel-title>
          <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start">
              <v-text-field
                v-model="process.label"
                density="compact"
                clearable
              />
            </v-col>
            <v-col
              cols="2"
              class="d-flex justify-center"
            >
              <v-col cols="6" class="d-flex justify-center" offset="1">ID: {{ process.id }}
              </v-col>
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <br />
          <v-row v-for="(value, index) in process.valueWeights" :key="index" no-gutters>
            <v-col>
              {{ value.label }}
            </v-col>
            <v-col>
              <v-text-field
                v-model.number="value.weight"
                type="number"
                style="width: 75px"
                density="compact"
                @click="configStore.updateScores()"
              />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
