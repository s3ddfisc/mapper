import { defineStore } from 'pinia'

export const useProcess = defineStore('process', {

  state: () => {
    return {
      processes: [
        { label: 'process 1', id: 0, properties: {property1: 10, property2: 'Test', property3: true} },
        { label: 'process 2', id: 1, properties: {property1: 11, property2: 'Test', property3: false} },
        { label: 'process 3', id: 2, properties: {property1: 12, property2: 'Test', property3: true} }],
      processData: {
        id: Number,
        label: String,
        properties: {
          property1: Number,
          property2: String,
          property3: Boolean,
        }
      },
      selectedProcesses: []
    }
  },

  getters: {
    getProcesslabels(state) {
      return state.processes.map(process => process.label)
    },
    getPropsByLabel(state) {
      return (label) => (Object.assign(state.processes.filter(process => process.label === label))[0].properties)
    }
  },

  actions: {
    addProcess () {
      this.processes.push( {
        label: 'new process',
        id: this.processes.length,
        properties: {
          property1: 10,
          property2: 'Test',
          property3: true} } )
    }
  },
})