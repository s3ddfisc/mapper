import { defineStore } from 'pinia'

interface Property {
  label: string,
  value: string | number | boolean,
}

interface Process {
  label: string,
  id: number,
  properties: Array<Property>
}

export const useProcess = defineStore('process', {

  state: () => {
    return {
      processes: [
        {
          label: 'process 1',
          id: 0,
          properties: [
            { label: 'property 1', value: 10 },
            { label: 'property 2', value: 'Test' },
            { label: 'property 3', value: true },
          ] as Property[],
        },
        {
          label: 'process 2',
          id: 1,
          properties: [
            { label: 'property 1', value: 11 },
            { label: 'property 2', value: 'Test' },
            { label: 'property 3', value: false },
          ] as Property[],
        },
        {
          label: 'process 3',
          id: 2,
          properties: [
            { label: 'property 1', value: 12 },
            { label: 'property 2', value: 'Test' },
            { label: 'property 3', value: true },
          ] as Property[],
        },
      ] as Process[],
      selectedProcesses: [],
    }
  },

  getters: {
    getProcesslabels (state) {
      return state.processes.map(process => process.label)
    },
    getPropsById (state) {
      return id => Object.assign(state.processes.filter(process => process.id === id))[0].properties
    },
    getLabelById (state) {
      return id => state.processes.filter(process => process.id === id)[0].label
    },
    getIdByLabel (state) {
      return label => state.processes.filter(process => process.label === label)[0].id
    },
  },

  actions: {
    addProcess () {
      this.processes.push({
        label: 'new process',
        id: this.processes.length,
        properties: {
          property1: 10,
          property2: 'Test',
          property3: true,
        },
      })
    },
  },
  // persist: true,
})
