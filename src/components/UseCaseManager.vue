<script lang="ts">
  import { mapStores } from 'pinia'
  import { useConfig } from '../dataStore/config'
  import { useProcess } from '../dataStore/process'
  import { useUseCase } from '../dataStore/useCase'
  import UseCaseCard from './UseCaseCard.vue'

  export default {
    name: 'UseCaseManager',
    components: {
      UseCaseCard,
    },
    data: () => ({
      buckets: [
        { id: 0, title: 'Build Backlog', targets: ['Build & Insight'], targetable: false, targeted: false },
        { id: 1, title: 'Build & Insight', targets: ['Build Backlog', 'Action Backlog'], targetable: false, targeted: false },
        { id: 2, title: 'Action Backlog', targets: ['Build Backlog', 'Action'], targetable: false, targeted: false },
        { id: 3, title: 'Action', targets: ['Build Backlog', 'Action Backlog', 'Monitor'], targetable: false, targeted: false },
        { id: 4, title: 'Monitor', targets: ['Build Backlog', 'Action Backlog'], targetable: false, targeted: false },
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
    },
    methods: {
      addUseCase () {
        this.configStore.setUseCaseForm(true)
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
      <v-btn prepend-icon="mdi-plus-box" variant="outlined" @click="addUseCase"> Add Use Case</v-btn>
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
      <v-col v-for="bucket in buckets" :key="bucket.id">
        <v-card
          class="bucket"
          :class="{ targetable: bucket.targetable, targeted: bucket.targeted }"
          variant="tonal"
          :title="bucket.title"
          @drop="onDrop($event, bucket.id)"
          @dragover="allowDrop($event, bucket.id)"
          @dragenter.prevent
          @dragleave="noDrop"
        >
          <v-card-text>
            <UseCaseCard
              v-for="(useCase, index) in useCaseStore.getUseCasesInBucket(bucket.id).sort(
                (a, b) => (a.bucketscores[bucket.id] < b.bucketscores[bucket.id]) ? 1 : -1)"
              :id="useCase.id"
              :key="index"
              draggable="true"
              class="card"
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
