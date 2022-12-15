<script lang="ts">
  import StrategicInput from './StrategicInput.vue'
  import ProcessRepository from './ProcessRepository.vue'
  import UseCaseManager from './UseCaseManager.vue'
  import SuccessMonitor from './SuccessMonitor.vue'
  import { mapStores } from 'pinia'
  import { useConfig } from '../dataStore/config'

  export default {
    name: 'ContentFrame',
    components: {
      StrategicInput,
      ProcessRepository,
      UseCaseManager,
      SuccessMonitor,
    },
    computed: {
      ...mapStores(useConfig),
    },
  }
</script>

<template>
  <v-main>
    <v-window>
      <v-windowitem><component :is="configStore.activeTab" /></v-windowitem>
    </v-window>
  </v-main>
</template>
