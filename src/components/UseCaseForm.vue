<script lang="ts">
  import { useProcess } from '../dataStore/process'
  import { useUseCase } from '../dataStore/useCase'
  import { mapStores } from 'pinia'
  import { useConfig } from '../dataStore/config'

  export default {
    name: 'UseCaseForm',
    data () {
      return {
        processLabel: '',
        tickLabels: {
          1: 'Very low',
          2: 'Low',
          3: 'Medium',
          4: 'High',
          5: 'Very high',
        },
      }
    },
    computed: {
      ...mapStores(useProcess, useUseCase, useConfig),
    },
    mounted () {
      this.useCaseStore.clearData()
    },
    updated () {
      if (this.useCaseStore.useCaseData.id !== -1) {
        this.processLabel = this.processStore.getLabelById(this.useCaseStore.useCaseData.processId)
      }
    },
    watch: {
      processLabel (newValue) {
        if (newValue !== '') {
          this.useCaseStore.useCaseData.processId = this.processStore.getIdByLabel(newValue)
        }
      },
    },
    methods: {
      addUseCase () {
        this.configStore.setUseCaseForm(false)
        this.useCaseStore.addUseCase()
        this.processLabel = ''
      },
      updateUseCase () {
        this.configStore.setUseCaseForm(false)
        this.configStore.setUseCaseEditMode(false)
        this.useCaseStore.updateUseCase()
        this.processLabel = ''
      },
      closeUseCaseForm () {
        this.configStore.setUseCaseForm(false)
        this.useCaseStore.clearData()
        this.configStore.setUseCaseEditMode(false)
        this.processLabel = ''
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
          <v-sheet height="150">
            <v-autocomplete
              v-model="this.processLabel"
              label="Business Process"
              :items="processStore.getProcesslabels"
              required
              density="comfortable"
            />
            <v-expansion-panels v-if="useCaseStore.useCaseData.processId != -1">
              <v-expansion-panel>
                <v-expansion-panel-title>Process Properties</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row
                    v-for="(property, index) in processStore.getPropsById(useCaseStore.useCaseData.processId)"
                    :key="index"
                  >
                    <v-col>{{ property.label }}</v-col>
                    <v-col>{{ property.value }}</v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-sheet>
          <v-text-field v-model="useCaseStore.useCaseData.label" label="Use Case" density="comfortable" clearable />
          <v-expansion-panels>
              <v-expansion-panel v-for="(category, index) in useCaseStore.useCaseData.categories" :key="index">
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
                      <v-slider
                        v-model="item.score"
                        :ticks="tickLabels"
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
                    <v-expansion-panel v-for="subcategory of category.categories" :key="subcategory.id">
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
                            <v-slider
                              v-model="item.score"
                              :ticks="tickLabels"
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
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn v-if="!configStore.useCaseEditMode" text @click="addUseCase">
          Add
        </v-btn>
        <v-btn v-else text @click="updateUseCase">
          Save
        </v-btn>
        <v-btn color="grey darken-1" text @click="closeUseCaseForm">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
