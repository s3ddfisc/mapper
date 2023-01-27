import { defineStore } from 'pinia'

interface Item {
  label: string
  weight: number
  score?: number
}

interface Process {
  label: string,
  id: number,
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
  },

  actions: {
    addProcess () {
      this.processes.push({
        label: 'new process',
        id: this.processes.length,
        valueWeights: [
          { label: 'Time', weight: 1 },
          { label: 'Cost', weight: 1 },
          { label: 'Quality', weight: 1 },
          { label: 'Flexibility', weight: 1 },
        ] as Item[],
      } as Process)
    },
  },
  persist: true,
})
