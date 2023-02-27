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
          0: 'S0',
          1: 'S1',
          2: 'S2',
          3: 'S3',
          4: 'S4',
        },
        tickLabelStateDescriptions: [
          'Initiated',
          'Estimated',
          'As-is measureable',
          'To-be measureable',
          'Value measurable',
        ],
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
        Add Value Case
      </v-card-title>
      <v-card-title v-else>
        Edit Value Case
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
            <v-text-field v-model="configStore.useCaseFormCache.label" label="Value Case Label" density="comfortable" clearable>
              <v-tooltip
                open-delay=1000
                content-class="custom-tooltip"
                activator="parent"
                location="top left"
              >
                Define a label for the value case.
              </v-tooltip>
            </v-text-field>
            <v-card>
              <v-card-title>
                Value Case State
                <v-tooltip
                  open-delay=1000
                  content-class="custom-tooltip"
                  activator="parent"
                  location="top left"
                >
                  Tracking of the progress of the value case.
                </v-tooltip>
              </v-card-title>
              <br>
              <v-card-text>
                <v-slider
                  v-model="this.configStore.useCaseFormCache.useCaseState"
                  :ticks="tickLabelsState"
                  :max="4"
                  step="1"
                  :readonly="this.configStore.useCaseFormCache.id ? false :
                  this.useCaseStore.getBucketById(this.configStore.useCaseFormCache.id) === 0 ? false : true"
                  show-ticks="always"
                  tick-size="4"
                  thumb-label
                  @click="configStore.validateState()"
                >
                  <template v-slot:thumb-label="{ modelValue }">
                    {{ tickLabelStateDescriptions[modelValue] }}
                  </template>
                </v-slider>
              </v-card-text>
            </v-card>
            <v-card>
              <v-card-title>
                Required Resources (excl. Core Development)
                <v-tooltip
                  open-delay=1000
                  content-class="custom-tooltip"
                  activator="parent"
                  location="top left"
                >
                  Required resources for the value case specific extension of the core application
                </v-tooltip>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col><b>Duration (in weeks)</b></v-col>
                  <v-col>
                    <v-text-field
                      v-model.number="this.configStore.useCaseFormCache.duration"
                      type="number"
                      step="1"
                      style="width: 75px"
                      density="compact"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col><b>Resource type</b></v-col>
                  <v-col><b>Required (in FTE)</b></v-col>
                </v-row>
                <v-row v-for="(type, index) in this.configStore.useCaseFormCache.resourceDemand" :key="index">
                  <v-col>
                    <b>{{ type.label }}</b>
                    <v-tooltip
                      open-delay=1000
                      content-class="custom-tooltip"
                      activator="parent"
                      location="top left"
                    >
                      <span
                        v-if="type.label !== 'Processual'"
                        style="white-space: pre;"
                        v-html="this.strategicStore.getResourceByLabel(type.label).description"
                      />
                      <div v-else>
                        <p>E.g., process experts from the operational team of specific business process.</p>
                      </div>
                    </v-tooltip>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model.number=type.fte
                      type="number"
                      step="0.1"
                      style="width: 75px"
                      density="compact"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-card>
              <v-card-title>Value Case Assessment
                <v-tooltip
                  open-delay=1000
                  content-class="custom-tooltip"
                  activator="parent"
                  location="top left"
                >
                  Assess the value case against predefined dimensions and criteria.
                </v-tooltip>
              </v-card-title>
                <v-card-text>
                  <v-expansion-panels>
                    <v-expansion-panel v-for="(category, index) in configStore.useCaseFormCache.categories" :key="index">
                      <v-expansion-panel-title>
                        {{ category.label }}
                        <v-tooltip
                          open-delay=1000
                          content-class="custom-tooltip"
                          activator="parent"
                          location="top left"
                        >
                          <p v-if="category.label==='Strategic goals'">
                            Assess the alignment of the value case to predefined strategic goals.
                          </p>
                          <p v-if="category.label==='Risk minimization'">
                            Assess the criticality of different obstacles relevant to the value case.
                          </p>
                          <p v-if="category.label==='Value potential'">
                            Assess the improvement potential for the business process with implementing the value case.
                          </p>
                        </v-tooltip>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text v-if="category.items != undefined">
                        <v-card
                          v-for="(item, index) in category.items"
                          :key="index"
                        >
                          <v-card-title>
                            {{ item.label }}
                            <v-tooltip
                              open-delay=1000
                              content-class="custom-tooltip"
                              activator="parent"
                              location="top left"
                            >
                              <div v-if="item.label==='Time'">
                                The potential for cycle time improvement, e.g., the time to handle one process instance from start to end.
                              </div>
                              <div v-if="item.label==='Cost'">
                                The potential for financial improvement, e.g., cost reduction, turnover increase, yield increase,
                                or revenue increase.
                              </div>
                              <div v-if="item.label==='Quality'">
                                <p>The potential for internal (process participant's perspective) or external (client's perspective)
                                  quality improvement,</p>
                                <p>e.g., the client's satisfaction as often managed via service level agreements (external) or
                                  the level of control (internal).</p>
                                </div>
                              <div v-if="item.label==='Flexibility'">
                                <p>The potential for flexibility improvement (the ability to react to changes),</p>
                                <p>e.g., the ability of resources to execute different tasks, to handle various cases and
                                  changing workloads, to change the structure and allocation rules,</p>
                                <p>or the organization’s ability to change the structure and responsiveness of the business process
                                  to wishes of the market and business partners.</p>
                              </div>
                            </v-tooltip>
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
                          <v-expansion-panel
                            v-for="(subcategory, index) in category.categories"
                            :key="index"
                          >
                            <v-expansion-panel-title>
                              {{ subcategory.label }}
                              <v-tooltip
                                open-delay=1000
                                content-class="custom-tooltip"
                                activator="parent"
                                location="top left"
                              >
                                <span
                                  style="white-space: pre;"
                                  v-html="strategicStore.getDescriptionByLabel(subcategory.label)"
                                />
                              </v-tooltip>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                              <v-card
                                  v-for="(item, index) in subcategory.items"
                                  :key="index"
                                >
                                <v-card-title>
                                  {{ item.label }}
                                  <v-tooltip
                                    open-delay=1000
                                    content-class="custom-tooltip"
                                    activator="parent"
                                    location="top left"
                                  >
                                    <span style="white-space: pre;" v-html="strategicStore.getDescriptionByLabel(item.label)" />
                                  </v-tooltip>
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
                </v-card-text>
            </v-card>
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
