import { defineStore } from 'pinia'

export const useUseCase = defineStore('useCase', {
 
  state: () => {
    return {
      useCases: [],
      useCaseData: {
        id: Number,
        processlabel: String,
        label: String,
        property1: Number,
        property2: String,
        property3: Boolean,
      }
    }
  },

  getters: {
    getUseCaseById: (state) => {
      return (useCaseId) => state.useCases[useCaseId]
    },
    getIdById: (state) => {
      return (useCaseId) => state.useCases[useCaseId].id
    },
    getProcesslabelById: (state) => {
      return (useCaseId) => state.useCases[useCaseId].processlabel
    },
    getLabelById: (state) => {
      return (useCaseId) => state.useCases[useCaseId].label
    },
    getBucketById: (state) => {
      return (useCaseId) => state.useCases[useCaseId].bucketID
    },
    getProperty1ById: (state) => {
      return (useCaseId) => state.useCases[useCaseId].property1
    },
    getProperty2ById: (state) => {
      return (useCaseId) => state.useCases[useCaseId].property2
    },    
    getProperty3ById: (state) => {
      return (useCaseId) => state.useCases[useCaseId].property3
    },
    getScoreById: (state) => {
      return (useCaseId) => Math.round(100 * state.useCases[useCaseId].score)
    },
    getUseCasesInBucket: (state) => {
      return (bucketID) => state.useCases.filter(useCase => useCase.bucketID == bucketID)
    },
  },

  actions: {
    addUseCase () {
      this.useCases.push( {id: this.useCases.length,
        label: this.useCaseData.label,
        processlabel: this.useCaseData.processlabel,
        bucketID: 1,
        property1: this.useCaseData.property1,
        property2: this.useCaseData.property2,
        property3: this.useCaseData.property3,
        score: Math.random()} )
      this.clearData()
    }, 
    updateUseCase () {
      this.getUseCaseById(this.useCaseData.id).processlabel = this.useCaseData.processlabel
      this.getUseCaseById(this.useCaseData.id).label = this.useCaseData.label
      this.getUseCaseById(this.useCaseData.id).property1 = this.useCaseData.property1
      this.getUseCaseById(this.useCaseData.id).property2 = this.useCaseData.property2
      this.getUseCaseById(this.useCaseData.id).property3 = this.useCaseData.property3
      this.clearData()
    },
    updateBucket (id, bucketID) {
      this.useCases[id].bucketID = bucketID
    },
    setUseCaseData(id) {
      this.useCaseData.id = this.getIdById(id)
      this.useCaseData.processlabel = this.getProcesslabelById(id)
      this.useCaseData.label = this.getLabelById(id)
      this.useCaseData.property1 = this.getProperty1ById(id)
      this.useCaseData.property2 = this.getProperty2ById(id)
      this.useCaseData.property3 = this.getProperty3ById(id)
    },
    clearData () {
      Object.keys(this.useCaseData).forEach(key => {
        this.useCaseData[key] = undefined
      })
    },
  }


})