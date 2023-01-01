<script lang="ts">
  import { useProcess } from '../dataStore/process'
  import { useUseCase } from '../dataStore/useCase'
  import { mapStores } from 'pinia'
  import { useConfig } from '../dataStore/config'

  export default {
    name: 'UseCaseForm',
    computed: {
      ...mapStores(useProcess, useUseCase, useConfig),
    },
    mounted () {
      this.useCaseStore.clearData()
    },
    methods: {
      addUseCase () {
        this.configStore.setUseCaseForm(false)
        this.useCaseStore.addUseCase()
      },
      updateUseCase () {
        this.configStore.setUseCaseForm(false)
        this.configStore.setUseCaseEditMode(false)
        this.useCaseStore.updateUseCase()
      },
      closeUseCaseForm () {
        this.configStore.setUseCaseForm(false)
        this.useCaseStore.clearData()
        this.configStore.setUseCaseEditMode(false)
      },
    },
  }
</script>

<template>
  <v-dialog persistent max-width="400">
    <v-card>
      <v-card-title>
        Add Use Case
      </v-card-title>

      <v-card-text>
        <v-form>
          <v-sheet height="150">
            <v-autocomplete
              v-model="useCaseStore.useCaseData.processlabel"
              label="Business Process"
              :items="processStore.getProcesslabels"
              required
              density="comfortable"
            />
            <v-expansion-panels v-if="useCaseStore.useCaseData.processlabel != null">
              <v-expansion-panel>
                <v-expansion-panel-title>Process Properties</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row
                    v-for="(property, index) in processStore.getPropsByLabel(useCaseStore.useCaseData.processlabel)"
                    :key="index"
                  >
                    <v-col>{{ index }}</v-col>
                    <v-col>{{ property }}</v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-sheet>
          <v-text-field v-model="useCaseStore.useCaseData.label" label="Use Case" density="comfortable" clearable />
          <v-row>
            <v-col>
              <div>Use Case Property 1</div>
            </v-col>
            <v-col>
              <v-text-field v-model="useCaseStore.useCaseData.property1" type="number" style="width: 75px" density="compact" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div>Use Case Property 2</div>
            </v-col>
            <v-col>
              <v-radio-group v-model="useCaseStore.useCaseData.property2" inline>
                <v-radio label="Low" value="low" />
                <v-radio label="Medium" value="medium" />
                <v-radio label="High" value="high" />
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div>Use Case Property 3</div>
            </v-col>
            <v-col>
              <v-radio-group v-model="useCaseStore.useCaseData.property3" inline>
                <v-radio label="True" value=true />
                <v-radio label="False" value=false />
              </v-radio-group>
            </v-col>
          </v-row>
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
