<script lang="ts">
  import { mapStores } from 'pinia'
  import { useConfig } from '../dataStore/config'
  import { useProcess } from '../dataStore/process'

  export default {
    name: 'ProcessRepository',
    data () {
      return {
        activePanel: [],
      }
    },
    computed: {
      ...mapStores(useProcess, useConfig),
    },
    methods: {
      addProcess () {
        this.processStore.addProcess()
      },
      // deletionTriggered (index) {},
    },
  }
</script>

<template>
  <v-container fluid>
    <v-app-bar>
      <v-btn prepend-icon="mdi-plus-box" variant="outlined" @click="addProcess"> Add Process</v-btn>
    </v-app-bar>
    <v-expansion-panels v-model="activePanel">
      <v-expansion-panel v-for="process of processStore.processes" :key="process.id">
        <v-expansion-panel-title>
          <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start">
              <v-text-field
                v-model="process.label"
                density="compact"
                clearable
              />
            </v-col>
            <v-col
              cols="2"
              class="d-flex justify-center"
            >
              <v-col cols="6" class="d-flex justify-center" offset="1">ID: {{ process.id }}
              </v-col>
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-checkbox v-model="process.coreDevelopmentCompleted" @change="processStore.updateCoreDevelopment(process.id)">
            <template v-slot:label>
              <div>The core development of the process is completed</div>
              <v-tooltip open-delay=1000 content-class="custom-tooltip" activator="parent" location="bottom">
                A core process mining application is available for the respective
                business process usable to analyze the as-is state of process KPIs.
              </v-tooltip>
            </template>
          </v-checkbox>
          <v-expand-y-transition>
            <v-card v-if="!process.coreDevelopmentCompleted">
              <v-card-title>
                Resource Demand for Core Development
                <v-tooltip open-delay=1000 content-class="custom-tooltip" activator="parent" location="bottom left">
                  Required resources to set up a core process mining application for the respective
                  business process usable to analyze the as-is state of process KPIs.
                </v-tooltip>
              </v-card-title>
              <v-card-text>
                <v-row no-gutters>
                  <v-col>
                    Duration (in weeks)
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model.number="process.duration"
                      type="number"
                      style="width: 75px"
                      density="compact"
                    />
                  </v-col>
                </v-row>
                <v-row v-for="(value, index) in process.resourceDemandCore" :key="index" no-gutters>
                  <v-col>
                    {{ value.label }}
                    <v-tooltip
                      v-if="value.label==='Technical'"
                      open-delay=1000
                      content-class="custom-tooltip"
                      activator="parent"
                      location="top left"
                    >
                      E.g., data engineers or data scientists required for the core development.
                    </v-tooltip>
                    <v-tooltip
                      v-if="value.label==='Analytical'"
                      open-delay=1000
                      content-class="custom-tooltip"
                      activator="parent"
                      location="top left"
                    >
                      E.g., data or process analysts required for the core development.
                    </v-tooltip>
                    <v-tooltip
                      v-if="value.label==='Processual'"
                      open-delay=1000
                      content-class="custom-tooltip"
                      activator="parent"
                      location="top left"
                    >
                      E.g., process experts from the operational team required for the core development.
                    </v-tooltip>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model.number="value.fte"
                      type="number"
                      step="0.1"
                      style="width: 75px"
                      density="compact"
                      @click="configStore.setAvailableResources()"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-expand-y-transition>
          <v-card>
            <v-card-title>Available Resources</v-card-title>
            <v-card-text>
              <v-row no-gutters>
                <v-col>
                  {{ process.resources.label }}
                  <v-tooltip
                    open-delay=1000
                    content-class="custom-tooltip"
                    activator="parent"
                    location="top left"
                  >
                    E.g., process experts from the operational team available for process mining operations
                    for the specific business process.
                  </v-tooltip>
                </v-col>
                <v-col>Total (in FTE)
                  <v-text-field
                    v-model.number="process.resources.fteTotal"
                    type="number"
                    step="0.1"
                    style="width: 75px"
                    density="compact"
                    @click="configStore.setAvailableResources()"
                  />
                </v-col>
                <v-col>Available (in FTE)
                  <v-text-field
                    v-model.number="process.resources.fteAvailable"
                    type="number"
                    step="0.1"
                    disabled
                    style="width: 90px"
                    density="compact"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card>
            <v-card-title>Process goals</v-card-title>
            <v-card-text>
              <v-row v-for="(value, index) in process.valueWeights" :key="index" no-gutters>
                <v-col>
                  {{ value.label }}
                </v-col>
                <v-tooltip
                  v-if="value.label==='Time'"
                  open-delay=1000
                  content-class="custom-tooltip"
                  activator="parent"
                  location="top left"
                >
                  The need for cycle time improvement, e.g., the time to handle one process instance from start to end.
                </v-tooltip>
                <v-tooltip
                  v-if="value.label==='Cost'"
                  open-delay=1000
                  content-class="custom-tooltip"
                  activator="parent"
                  location="top left"
                >
                  The need for financial improvement, e.g., cost reduction, turnover increase, yield increase, or revenue increase.
                </v-tooltip>
                <v-tooltip
                  v-if="value.label==='Quality'"
                  open-delay=1000
                  content-class="custom-tooltip"
                  activator="parent"
                  location="top left"
                >
                  <p>The need for internal (process participant's perspective) or external (client's perspective) quality improvement,</p>
                  <p>e.g., the client's satisfaction as often managed via service level agreements (external) or
                    the level of control (internal).</p>
                </v-tooltip>
                <v-tooltip
                  v-if="value.label==='Flexibility'"
                  open-delay=1000
                  content-class="custom-tooltip"
                  activator="parent"
                  location="top left"
                >
                  <p>The need for flexibility improvement (the ability to react to changes),</p>
                  <p>e.g., the ability of resources to execute different tasks, to handle various cases and
                    changing workloads, to change the structure and allocation rules,</p>
                  <p>or the organization’s ability to change the structure and responsiveness of the business process
                    to wishes of the market and business partners.</p>
                </v-tooltip>
                <v-col>
                  <v-text-field
                    v-model.number="value.weight"
                    type="number"
                    style="width: 75px"
                    density="compact"
                    @click="configStore.updateScores()"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
