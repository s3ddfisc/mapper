<script lang="ts">
  import GlobalCategories from './GlobalCategories.vue'
  import StrategicGoals from './StrategicGoals.vue'
  import RiskManagement from './RiskManagement.vue'

  export default {
    name: 'StrategicInput',
    data: () => ({
      tab: null,
    }),
    components: {
      GlobalCategories,
      StrategicGoals,
      RiskManagement,
    },
  }
</script>

<template>
  <v-card>
    <v-tabs
      v-model="tab"
      bg-color="primary"
      >
      <v-tab value="globalcategories">Global Categories</v-tab>
      <v-tab value="strategicgoals">Strategic Goals</v-tab>
      <v-tab value="riskmanagement">Risk Management</v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="globalcategories">
          <GlobalCategories />
        </v-window-item>
        <v-window-item value="strategicgoals">
          <StrategicGoals />
        </v-window-item>
        <v-window-item value="riskmanagement">
          <RiskManagement />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>
