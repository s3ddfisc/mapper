<script lang="ts">
  import Categories from './Categories.vue'
  import Weighting from './Weighting.vue'
  import StrategicGoals from './StrategicGoals.vue'

  export default {
    name: 'StrategicInput',
    data: () => ({
      tab: null,
    }),
    components: {
      Categories,
      Weighting,
      StrategicGoals,
    },
  }
</script>

<template>
  <v-card>
    <v-tabs
      v-model="tab"
      bg-color="primary"
      >
      <v-tab value="categories">Categories</v-tab>
      <v-tab value="weighting">Weighting</v-tab>
      <v-tab value="strategicgoals">Strategic Goals</v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="categories">
          <Categories />
        </v-window-item>
        <v-window-item value="weighting">
          <Weighting />
        </v-window-item>
        <v-window-item value="strategicgoals">
          <StrategicGoals />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>
