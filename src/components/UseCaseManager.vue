<script lang="ts">
  import { mapStores } from 'pinia'
  import { useConfig } from '../dataStore/config'
  import { useProcess } from '../dataStore/process'
  import { useUseCase } from '../dataStore/useCase'
  import ValueCaseOverview from './ValueCaseOverview.vue'
  import UseCaseCard from './UseCaseCard.vue'

  export default {
    name: 'UseCaseManager',
    components: {
      UseCaseCard,
      ValueCaseOverview,
    },
    data: () => ({
      buckets: [
        {
          id: 0,
          title: 'Backlog',
          description: 'Contains all value cases to be implemented.\n' +
            'The proposed portfolio (green cards) contains value cases with the maximum value potential.',
          targets: ['Core Development', 'Insight', 'Discarded'],
          targetable: false,
          targeted: false,
        },
        {
          id: 1,
          title: 'Core Development',
          description: 'Contains value cases for that the core process mining application is currently in development.',
          targets: ['Backlog', 'Insight', 'Discarded'],
          targetable: false,
          targeted: false,
        },
        {
          id: 2,
          title: 'Insight',
          description: 'Contains value cases for that the core process mining application currently gets extended to analyze \n' +
            'the value case status and its improvement potentials. Further, actionable get derived.',
          targets: ['Backlog', 'Action', 'Discarded'],
          targetable: false,
          targeted: false,
        },
        {
          id: 3,
          title: 'Action',
          description: 'Contains value cases for that the identified actions get implemented and therefore the business process improved.',
          targets: ['Backlog', 'Insight', 'Value', 'Discarded'],
          targetable: false,
          targeted: false,
        },
        {
          id: 4,
          title: 'Value',
          description: 'Contains value cases that are completed and therefore realize reoccuring value.',
          targets: [],
          targetable: false,
          targeted: false,
        },
        {
          id: 5,
          title: 'Discarded',
          description: 'Contains value cases that have been discarded at some point.',
          targets: [],
          targetable: false,
          targeted: false,
        },
      ],
    }),
    computed: {
      ...mapStores(useUseCase, useConfig, useProcess),
      allProcessesSelected () {
        return this.processStore.selectedProcesses.length === this.processStore.getProcesslabels.length
      },
      someProcessesSelected () {
        return this.processStore.selectedProcesses.length > 0
      },
    },
    mounted () {
      this.processStore.selectedProcesses = this.processStore.getProcesslabels
      this.configStore.calculateOptimalPortfolio()
    },
    methods: {
      addUseCase () {
        this.configStore.setUseCaseForm()
      },
      startDrag (event, useCase) {
        this.buckets.forEach(bucket1 => {
          if (bucket1.id === useCase.bucketID) {
            bucket1.targets.forEach(target => {
              this.buckets.forEach(bucket2 => {
                if (bucket2.title === target) {
                  bucket2.targetable = true
                }
              })
            })
          }
        })
        event.dataTransfer.setData('useCaseID', useCase.id)
      },
      allowDrop (event, bucketID) {
        if (this.buckets[bucketID].targetable) {
          event.preventDefault()
          this.buckets[bucketID].targeted = true
        }
      },
      endDrag () {
        this.buckets.forEach(bucket => {
          bucket.targetable = false
        })
      },
      noDrop () {
        this.buckets.forEach(bucket => {
          bucket.targeted = false
        })
      },
      onDrop (event, bucketID) {
        this.useCaseStore.updateBucket(event.dataTransfer.getData('useCaseID'), bucketID)
        if (bucketID === 2) {
          this.processStore.getProcessById(this.useCaseStore
            .getProcessIdById(event.dataTransfer.getData('useCaseID')))[0].coreDevelopmentCompleted = true
          this.processStore.updateCoreDevelopment(this.useCaseStore.getProcessIdById(event.dataTransfer.getData('useCaseID')))
        }
        this.configStore.calculateOptimalPortfolio()
        this.buckets[bucketID].targeted = false
      },
      selectAll () {
        if (this.allProcessesSelected) {
          this.processStore.selectedProcesses = []
        } else {
          this.processStore.selectedProcesses = this.processStore.getProcesslabels
        }
      },
    },
  }
</script>

<template>
  <v-container fluid>
    <v-app-bar>
      <v-btn prepend-icon="mdi-plus-box" variant="outlined" @click="addUseCase"> Add Value Case</v-btn>
      <v-spacer />
      <v-select
        v-model="this.processStore.selectedProcesses"
        :items="this.processStore.getProcesslabels"
        label="Filter Processes"
        multiple
        chips
        closable-chips
        width="75px"
      >
        <template v-slot:prepend-item>
          <v-list-item
            title="Select All"
            @click="selectAll"
          >
            <template v-slot:prepend>
              <v-checkbox-btn
                :indeterminate="this.someProcessesSelected && !this.allProcessesSelected"
                :model-value="this.someProcessesSelected"
              ></v-checkbox-btn>
            </template>
          </v-list-item>
          <v-divider class="mt-2" />
        </template>
      </v-select>
    </v-app-bar>
    <v-row>
      <v-col v-for="bucket in buckets" :key="bucket.id" class="text-center">
        <v-card
          class="bucket"
          :class="{ targetable: bucket.targetable, targeted: bucket.targeted }"
          variant="tonal"
          @drop="onDrop($event, bucket.id)"
          @dragover="allowDrop($event, bucket.id)"
          @dragenter.prevent
          @dragleave="noDrop"
        >
          <v-card-title>
            {{ bucket.title }}
            <v-tooltip
              open-delay=1000
              content-class="custom-tooltip"
              activator="parent"
              location="top left"
            >
              <span style="white-space: pre;" v-html="bucket.description" />
            </v-tooltip>
          </v-card-title>
          <v-row v-if="bucket.id === 0">
            <v-col>
              <v-btn
                class ="no-text-transform pa-6 mx-2"
                block
                prepend-icon="mdi-map"
                variant="outlined"
              >
                <p class="text-wrap">Value Case Overview</p>
                <v-dialog
                  v-model="this.configStore.valueCaseOverview"
                  activator="parent"
                  width="auto"
                >
                  <ValueCaseOverview min-width="1000px" min-height="800px" />
                </v-dialog>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                class ="no-text-transform pa-6 mx-2"
                block
                prepend-icon="mdi-playlist-plus"
                variant="outlined"
                @click="this.configStore.implementPortfolio()"
                color="green"
              >
                <p class="text-wrap">Implement Portfolio Proposal</p>
                <v-tooltip
                  open-delay=1000
                  content-class="custom-tooltip"
                  activator="parent"
                  location="top left"
                >
                  Move the proposed portfolio of value cases with the best value potential (green).
                </v-tooltip>
              </v-btn>
            </v-col>
          </v-row>
          <v-card-text>
            <UseCaseCard
              v-for="(useCase, index) in useCaseStore.getUseCasesInBucket(bucket.id).sort(
                (a, b) => (a.score < b.score) ? 1 : -1)"
              :id="useCase.id"
              :key="index"
              draggable="true"
              class="card"
              :class="{ optimal: useCase.optimalPortfolio }"
              @dragstart="startDrag($event, useCase)"
              @dragend="endDrag"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.bucket {
  min-width: 200px;
  min-height: 100px;
}

.targetable {
  border-color: white;
  border-style: dashed;
  border-width: 2px;
  background-color:rgba(23, 153, 176, 0.575);
}

.optimal {
  background-color:rgba(0, 88, 9, 0.814);
}

.targeted {
  background-color:rgb(14, 186, 216);
}

.card {
  margin-bottom: 15px;
}

.card:nth-last-of-type(1) {
  margin-bottom: 0px;
}
</style>
