<script lang="ts">
  import { mapStores } from 'pinia'
  import { useConfig } from '../dataStore/config'
  import { useStrategic } from '../dataStore/strategic'

  export default {
    name: 'ProcessRepository',
    computed: {
      ...mapStores(useStrategic, useConfig),
    },
  }
</script>

<template>
  <v-card>
    <v-card-title>Available Resources</v-card-title>
    <v-card-text>
      <v-row>
        <v-col><b>Resource type</b></v-col>
        <v-col><b>Total (in FTE)</b></v-col>
        <v-col><b>Available (in FTE)</b></v-col>
      </v-row>
      <v-row v-for="(type, index) in this.strategicStore.resources" :key="index">
        <v-col>
          <b>{{ type.label }}</b>
          <v-tooltip open-delay=1000 content-class="custom-tooltip" activator="parent" location="top">
            <span style="white-space: pre;" v-html="type.description" />
          </v-tooltip>
        </v-col>
        <v-col>
          <v-text-field
            v-model.number=type.fteTotal
            type="number"
            step="0.1"
            style="width: 75px"
            density="compact"
            @click="configStore.setAvailableResources()"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model.number=type.fteAvailable
            type="number"
            step="0.1"
            style="width: 90px"
            disabled
            density="compact"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
