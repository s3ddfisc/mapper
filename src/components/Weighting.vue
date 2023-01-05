<script lang="ts">
  import { mapStores } from 'pinia'
  import { useUseCase } from '../dataStore/useCase'

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
    created () {
      this.useCaseStore.setCategoryPairs()
    },
    computed: {
      ...mapStores(useUseCase),
    },
    methods: {
      updateWeights () {
        this.useCaseStore.updateWeights()
      },
    },
  }
</script>

<template>
  <v-card>
    <v-card-title>
      Assess the relative importance of each category pair
    </v-card-title>
    <v-card-text>
      <v-card>
        <v-card-title>Global Categories</v-card-title>
        <v-card-text>
          <div v-for="(value, index) in useCaseStore.getGlobalCategoryPairs" :key="index">
            <v-row>
              <v-col>
                <label>{{value.category1}}</label>
              </v-col>
              <v-col cols="9">
                <v-slider
                  v-model="value.importance"
                  :ticks="tickLabels"
                  :max="16"
                  step="1"
                  show-ticks="always"
                  tick-size="4"
                  @click="updateWeights"
                />
              </v-col>
              <v-col>
                <label>{{value.category2}}</label>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-title>Risk reduction</v-card-title>
        <v-card-text>
          <div v-for="(value, index) in useCaseStore.getLocalCategoryPairs" :key="index">
            <v-row>
              <v-col>
                <label>{{value.category1}}</label>
              </v-col>
              <v-col cols="9">
                <v-slider
                  v-model="value.importance"
                  :ticks="tickLabels"
                  :max="16"
                  step="1"
                  show-ticks="always"
                  tick-size="4"
                  @click="updateWeights"
                />
              </v-col>
              <v-col>
                <label>{{value.category2}}</label>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>
