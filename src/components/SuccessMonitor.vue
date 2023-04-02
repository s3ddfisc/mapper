<script lang="ts">
  import ResourceUtilization from './ResourceUtilization.vue'
  import MonetaryBenefits from './MonetaryBenefits.vue'
  import ValueCaseOverview from './ValueCaseOverview.vue'

  export default {
    name: 'SuccessMonitor',
    data: () => ({
      tab: null,
    }),
    components: {
      ResourceUtilization,
      MonetaryBenefits,
      ValueCaseOverview,
    },
  }
</script>

<template>
  <v-card>
    <v-tabs
      v-model="tab"
      bg-color="primary"
      >
      <v-tab value="monetaryBenefits">
        Monetary Benefits
        <v-tooltip open-delay=1000 content-class="custom-tooltip" activator="parent" location="bottom">
          Overview of the monetary benefits over time.
        </v-tooltip>
      </v-tab>
      <v-tab value="resourceUtilization">
        Resource Utilization
        <v-tooltip open-delay=1000 content-class="custom-tooltip" activator="parent" location="bottom">
          Overview of the current resource utilization.
        </v-tooltip>
      </v-tab>
      <v-tab value="valueCaseOverview">
        Value Case Overview
        <v-tooltip open-delay=1000 content-class="custom-tooltip" activator="parent" location="bottom">
          Overview of the current status of value cases.
        </v-tooltip>
      </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="monetaryBenefits">
        <MonetaryBenefits />
      </v-window-item>
      <v-window-item value="resourceUtilization">
        <ResourceUtilization />
      </v-window-item>
      <v-window-item value="valueCaseOverview">
        <ValueCaseOverview />
      </v-window-item>
    </v-window>
  </v-card>
</template>
