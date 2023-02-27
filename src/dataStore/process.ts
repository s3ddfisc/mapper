import { defineStore } from 'pinia'
import { useUseCase } from './useCase'

interface Item {
  label: string
  weight: number
  score?: number
}

interface Process {
  label: string,
  id: number,
  resources: object
  duration: number,
  coreDevelopmentCompleted: boolean
  resourceDemandCore: Array<object>,
  valueWeights: Array<Item>
}

export const useProcess = defineStore('process', {

  state: () => {
    return {
      processIdCounter: 3,
      processes: [
        {
          label: 'process 1',
          id: 0,
          resources: { label: 'Processual', fteTotal: 1, fteAvailable: 1 },
          duration: 4,
          coreDevelopmentCompleted: false,
          resourceDemandCore: [
            { label: 'Technical', fte: 0.2 },
            { label: 'Analytical', fte: 0.2 },
            { label: 'Processual', fte: 0.2 },
          ],
          valueWeights: [
            { label: 'Time', weight: 1 },
            { label: 'Cost', weight: 1 },
            { label: 'Quality', weight: 1 },
            { label: 'Flexibility', weight: 1 },
          ] as Item[],
        },
        {
          label: 'process 2',
          id: 1,
          resources: { label: 'Processual', fteTotal: 1, fteAvailable: 1 },
          duration: 4,
          coreDevelopmentCompleted: false,
          resourceDemandCore: [
            { label: 'Technical', fte: 0.2 },
            { label: 'Analytical', fte: 0.2 },
            { label: 'Processual', fte: 0.2 },
          ],
          valueWeights: [
            { label: 'Time', weight: 1 },
            { label: 'Cost', weight: 1 },
            { label: 'Quality', weight: 1 },
            { label: 'Flexibility', weight: 1 },
          ] as Item[],
        },
        {
          label: 'process 3',
          id: 2,
          resources: { label: 'Processual', fteTotal: 1, fteAvailable: 1 },
          duration: 4,
          coreDevelopmentCompleted: false,
          resourceDemandCore: [
            { label: 'Technical', fte: 0.2 },
            { label: 'Analytical', fte: 0.2 },
            { label: 'Processual', fte: 0.2 },
          ],
          valueWeights: [
            { label: 'Time', weight: 1 },
            { label: 'Cost', weight: 1 },
            { label: 'Quality', weight: 1 },
            { label: 'Flexibility', weight: 1 },
          ] as Item[],
        },
      ] as Process[],
      selectedProcesses: [],
    }
  },

  getters: {
    getProcesslabels (state) {
      return state.processes.map(process => process.label)
    },
    getLabelById (state) {
      return id => {
        return state.processes.filter(process => process.id === id)[0].label
      }
    },
    getCoreStatusById (state) {
      return id => state.processes.filter(process => process.id === id)[0].coreDevelopmentCompleted
    },
    getProcessById (state) {
      return id => state.processes.filter(process => process.id === id)
    },
    getIdByLabel (state) {
      return label => state.processes.filter(process => process.label === label)[0].id
    },
    getProcessExistence (state) {
      return label => state.processes.map(process => process.label === label).includes(true)
    },
    getWeight (state) {
      return (processId, label) => {
        return state.processes.filter(process => process.id === processId)[0]
          .valueWeights.filter(value => value.label === label)[0].weight
      }
    },
    getResourceDemand (state) {
      return processId => state.processes.filter(process => process.id === processId)[0]
        .resourceDemandCore
    },
  },

  actions: {
    addProcess () {
      this.processes.push({
        label: 'new process',
        id: this.processes.length,
        duration: 0,
        resources: { label: 'Processual', fteTotal: 0, fteAvailable: 0 },
        coreDevelopmentCompleted: false,
        resourceDemandCore: [
          { label: 'Technical', fte: 0 },
          { label: 'Analytical', fte: 0 },
          { label: 'Processual', fte: 0 },
        ],
        valueWeights: [
          { label: 'Time', weight: 1 },
          { label: 'Cost', weight: 1 },
          { label: 'Quality', weight: 1 },
          { label: 'Flexibility', weight: 1 },
        ] as Item[],
      } as Process)
    },
    updateCoreDevelopment (id) {
      if (this.getProcessById(id)[0].coreDevelopmentCompleted) {
        useUseCase().useCases.filter(useCase => useCase.processId === id).forEach(useCase => {
          if (useCase.state === 1) useCase.state = 2
          if (useCase.bucketID === 1) useCase.bucketID = 2
        })
      } else {
        useUseCase().useCases.filter(useCase => useCase.processId === id).forEach(useCase => {
          if (useCase.state === 2) useCase.state = 1
          if (useCase.bucketID === 2) useCase.bucketID = 1
        })
      }
    },
  },
  // persist: true,
})
