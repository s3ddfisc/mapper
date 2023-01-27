<script lang="ts">
  import { mapStores } from 'pinia'
  import { useStrategic } from '../dataStore/strategic'

  export default {
    name: 'Weighting',
    data () {
      return {
        tickLabels: {
          0: 'absolutely dominating',
          4: 'significantly higher',
          8: 'equal',
          12: 'significantly higher',
          16: 'absolutely dominating',
        },
      }
    },
    computed: {
      ...mapStores(useStrategic),
    },
    methods: {
      updateGlobalWeights () {
        this.strategicStore.updateGlobalWeights()
      },
    },
  }
</script>

<template>
  <v-card>
    <v-card>
      <v-row v-for="(category, index) in strategicStore.categories" :key="index">
        <v-col align="center">
          <h3>{{category.label}}</h3>
        </v-col>
        <v-col align="center">
          <h3>{{'Weight: ' + Math.round(category.weight*100) / 100 }}</h3>
        </v-col>
      </v-row>
    </v-card>
    <v-card>
      <v-card-title>Assess the relative importance of each category pair</v-card-title>
      <v-card-text>
        <div v-for="(value, index) in strategicStore.getGlobalCategoryPairs" :key="index">
          <v-row>
            <v-col>
              <label>{{value.category1.label}}</label>
            </v-col>
            <v-col cols="9">
              <v-slider
                v-model="value.importance"
                :ticks="tickLabels"
                :max="16"
                step="1"
                show-ticks="always"
                tick-size="4"
                @click="updateGlobalWeights"
              />
            </v-col>
            <v-col>
              <label>{{value.category2.label}}</label>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>
