<script lang="ts">
  import { mapStores } from 'pinia'
  import { useConfig } from '../dataStore/config'
  import { useStrategic } from '../dataStore/strategic'

  export default {
    name: 'RiskManagement',
    data () {
      return {
        activePanel: [],
        tickLabels: {
          0: 'absolutely dominating',
          4: 'significantly higher',
          8: 'equal',
          12: 'significantly higher',
          16: 'absolutely dominating',
        },
        tickLabelsRisk: {
          1: 'Very risk-averse',
          2: 'Risk-averse',
          3: 'Neutral',
          4: 'Risk-tolerant',
          5: 'Very risk-tolerant',
        },
      }
    },
    computed: {
      ...mapStores(useStrategic, useConfig),
    },
    methods: {
      updateRiskWeights () {
        this.strategicStore.updateRiskWeights()
      },
    },
  }
</script>

<template>
  <v-card>
    <v-card>
      <v-card-title>
        Define the tolerance for risky projects
        <v-tooltip open-delay=1000 content-class="custom-tooltip" activator="parent" location="left bottom">
          Rating of the general position against risky projects: The risk is dependent on the progess of a value case.
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <v-slider
          v-model="strategicStore.riskScore"
          :ticks="tickLabelsRisk"
          :max="5"
          :min="1"
          step="1"
          show-ticks="always"
          tick-size="4"
          @click="strategicStore.updateRiskFactor()"
        />
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title>Define the weight of each risk item</v-card-title>
      <v-card-text>
        <v-expansion-panels v-model="activePanel">
            <v-expansion-panel v-for="(category, index) in strategicStore.categories[1].categories" :key="index">
              <v-expansion-panel-title>
                <v-row no-gutters>
                  <v-col cols="4" class="d-flex justify-start">
                    {{ category.label }}
                  </v-col>
                </v-row>
                <v-tooltip
                  open-delay=1000
                  content-class="custom-tooltip"
                  activator="parent"
                  location="top left"
                >
                  <span style="white-space: pre;" v-html="category.description" />
                </v-tooltip>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <br />
                <v-row>
                  <v-col cols="4"><b>Label</b></v-col>
                  <v-col cols="4"><b>Item weight</b></v-col>
                </v-row>
                <v-row v-for="(item, index) in category.items" :key="index" justify="start">
                  <v-col cols="4">
                    {{ item.label }}
                    <v-tooltip open-delay=1000 content-class="custom-tooltip" activator="parent" location="top">
                      <span style="white-space: pre;" v-html="item.description" />
                    </v-tooltip>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      v-model.number="item.weight"
                      type="number"
                      style="width: 75px"
                      density="compact"
                      @click="configStore.updateScores()"
                    />
                    <v-tooltip
                      open-delay=1000
                      content-class="custom-tooltip"
                      activator="parent"
                      location="top left"
                    >
                      <span style="white-space: pre;" v-html="item.description" />
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title>Assess the relative importance of each category pair</v-card-title>
      <v-card-text>
        <div v-for="(pair, index) in strategicStore.getRiskCategoryPairs" :key="index">
          <v-row>
            <v-col>
              <label>{{pair.category1.label}}</label>
              <v-tooltip
                open-delay=1000
                content-class="custom-tooltip"
                activator="parent"
                location="top left"
              >
                <span style="white-space: pre;" v-html="pair.category1.description" />
              </v-tooltip>
            </v-col>
            <v-col cols="9">
              <v-slider
                v-model="pair.importance"
                :ticks="tickLabels"
                :max="16"
                step="1"
                show-ticks="always"
                tick-size="4"
                @click="updateRiskWeights"
              />
            </v-col>
            <v-col>
              <label>{{pair.category2.label}}</label>
              <v-tooltip
                open-delay=1000
                content-class="custom-tooltip"
                activator="parent"
                location="top left"
              >
                <span style="white-space: pre;" v-html="pair.category2.description" />
              </v-tooltip>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>
