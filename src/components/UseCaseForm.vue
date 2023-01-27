<script lang="ts">
  import { useProcess } from '../dataStore/process'
  import { useUseCase } from '../dataStore/useCase'
  import { mapStores } from 'pinia'
  import { useConfig } from '../dataStore/config'
  import { useStrategic } from '../dataStore/strategic'

  export default {
    name: 'UseCaseForm',
    data () {
      return {
        tickLabelsLowHigh: {
          1: 'Very low',
          2: 'Low',
          3: 'Medium',
          4: 'High',
          5: 'Very high',
        },
        tickLabelsHighLow: {
          1: 'Very high',
          2: 'high',
          3: 'Medium',
          4: 'Low',
          5: 'Very low',
        },
        tickLabelsImpact: {
          1: 'Very negative',
          2: 'Negative',
          3: 'Neutral',
          4: 'Positive',
          5: 'Very positive',
        },
        tickLabelsState: {
          0: 'I0',
          1: 'I1',
          2: 'I2',
          3: 'A3',
          4: 'V4',
        },
      }
    },
    computed: {
      ...mapStores(useProcess, useUseCase, useConfig, useStrategic),
    },
    methods: {
      setUseCase () {
        this.configStore.setUseCase()
      },
      closeUseCaseForm () {
        this.configStore.resetCache()
      },
      color (score) {
        let r = 255
        let g = 255
        if (score > 3) {
          r = 255 - 255 * (score - 3) / 2
        }
        if (score < 3) {
          g = 255 - 255 * (3 - score) / 2
        }
        return 'rgb(' + r + ',' + g + ',0)'
      },
    },
  }
</script>

<template>
  <v-dialog persistent max-width="800px">
    <v-card min-width="100px">
      <v-card-title v-if="!configStore.useCaseEditMode">
        Add Use Case
      </v-card-title>
      <v-card-title v-else>
        Edit Use Case
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-sheet>
            <v-autocomplete
              v-model="this.configStore.useCaseFormCache.processLabel"
              label="Business Process"
              :items="processStore.getProcesslabels"
              required
              density="comfortable"
            />
            <v-text-field v-model="configStore.useCaseFormCache.label" label="Use Case" density="comfortable" clearable />
            <v-slider
              v-model="this.configStore.useCaseFormCache.useCaseState"
              :ticks="tickLabelsState"
              :max="4"
              step="1"
              show-ticks="always"
              tick-size="4"
            ></v-slider>
            <v-expansion-panels>
              <v-expansion-panel v-for="(category, index) in configStore.useCaseFormCache.categories" :key="index">
                <v-expansion-panel-title>{{ category.label }}</v-expansion-panel-title>
                <v-expansion-panel-text v-if="category.items != undefined">
                  <v-card
                    v-for="(item, index) in category.items"
                    :key="index"
                  >
                    <v-card-title>
                      {{ item.label }}
                    </v-card-title>
                    <v-card-text>
                      <v-slider v-if="category.label != 'Value potential'"
                        v-model="item.score"
                        :ticks="tickLabelsLowHigh"
                        :color="this.color(item.score)"
                        :min="1"
                        :max="5"
                        step="1"
                        show-ticks="always"
                        tick-size="4"
                      />
                      <v-slider v-else
                        v-model="item.score"
                        :ticks="tickLabelsImpact"
                        :color="this.color(item.score)"
                        :min="1"
                        :max="5"
                        step="1"
                        show-ticks="always"
                        tick-size="4"
                      />
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-text>
                <v-expansion-panel-text v-else>
                  <v-expansion-panels>
                    <v-expansion-panel v-for="(subcategory, index) in category.categories" :key="index">
                      <v-expansion-panel-title>{{ subcategory.label }}</v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-card
                            v-for="(item, index) in subcategory.items"
                            :key="index"
                          >
                          <v-card-title>
                            {{ item.label }}
                          </v-card-title>
                          <v-card-text>
                            <v-slider v-if="subcategory.label != 'Challenges and issues'"
                              v-model="item.score"
                              :ticks="tickLabelsLowHigh"
                              :color="this.color(item.score)"
                              :min="1"
                              :max="5"
                              step="1"
                              show-ticks="always"
                              tick-size="4"
                            />
                            <v-slider v-else
                              v-model="item.score"
                              :ticks="tickLabelsHighLow"
                              :color="this.color(item.score)"
                              :min="1"
                              :max="5"
                              step="1"
                              show-ticks="always"
                              tick-size="4"
                            />
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-sheet>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn v-if="!configStore.useCaseEditMode" text @click="setUseCase">
          Add
        </v-btn>
        <v-btn v-else text @click="setUseCase">
          Save
        </v-btn>
        <v-btn color="grey darken-1" text @click="closeUseCaseForm">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
