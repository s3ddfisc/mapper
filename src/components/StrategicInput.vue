<script lang="ts">
  import GlobalCategories from './GlobalCategories.vue'
  import StrategicGoals from './StrategicGoals.vue'
  import RiskManagement from './RiskManagement.vue'
  import Overview from './Overview.vue'
  import Resources from './Resources.vue'

  export default {
    name: 'StrategicInput',
    data: () => ({
      tab: null,
    }),
    components: {
      Resources,
      Overview,
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
      <v-tab value="resources">
        Resources
        <v-tooltip open-delay=1000 content-class="custom-tooltip" activator="parent" location="bottom">
          Define available resources for process mining operations.
        </v-tooltip>
      </v-tab>
      <v-tab value="overview">
        Overview
        <v-tooltip open-delay=1000 content-class="custom-tooltip" activator="parent" location="bottom">
          View the dimensions and criteria with their respective weightings for the value case assessment.
        </v-tooltip>
      </v-tab>
      <v-tab value="globalcategories">
        Global Categories
        <v-tooltip open-delay=1000 content-class="custom-tooltip" activator="parent" location="bottom">
          Define the importance of the global dimensions (strategic goals, risk minimization, value potential).
        </v-tooltip>
      </v-tab>
      <v-tab value="strategicgoals">
        Strategic Goals
        <v-tooltip open-delay=1000 content-class="custom-tooltip" activator="parent" location="bottom">
          Define strategic goals for process mining operations.
        </v-tooltip>
      </v-tab>
      <v-tab value="riskmanagement">
        Risk Management
        <v-tooltip open-delay=1000 content-class="custom-tooltip" activator="parent" location="bottom">
          Define dimensions and criteria with their respective weightings for risk factors.
        </v-tooltip>
      </v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="resources">
          <Resources />
        </v-window-item>
        <v-window-item value="overview">
          <Overview />
        </v-window-item>
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
