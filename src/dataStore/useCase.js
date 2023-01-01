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
      return (useCaseId) => {
        if (state.useCases[useCaseId].bucketID == 1) {
          return Math.round(100 * state.useCases[useCaseId].bucket1score)
        } else if (state.useCases[useCaseId].bucketID == 2) {
          return Math.round(100 * state.useCases[useCaseId].bucket2score)
        } else if (state.useCases[useCaseId].bucketID == 3) {
          return Math.round(100 * state.useCases[useCaseId].bucket3score)
        } else if (state.useCases[useCaseId].bucketID == 4) {
          return Math.round(100 * state.useCases[useCaseId].bucket4score)
        } else if (state.useCases[useCaseId].bucketID == 5) {
          return Math.round(100 * state.useCases[useCaseId].bucket5score)
        } else if (state.useCases[useCaseId].bucketID == 6) {
          return Math.round(100 * state.useCases[useCaseId].bucket6score)
        }
        
      }
    },
    getUseCasesInBucket: (state) => {
      return (bucketID) => state.useCases.filter(useCase => useCase.bucketID == bucketID)
    },
  },

  actions: {
    addUseCase () {
      this.useCaseData.id = this.useCases.length,
      this.useCases.push( {
        id: this.useCaseData.id,
        label: this.useCaseData.label,
        processlabel: this.useCaseData.processlabel,
        bucketID: 1,
        property1: this.useCaseData.property1,
        property2: this.useCaseData.property2,
        property3: this.useCaseData.property3,
        bucket1score: 0,
        bucket2score: 0,
        bucket3score: 0,
        bucket4score: 0,
        bucket5score: 0,
        bucket6score: 0} )
      this.setScores(this.useCaseData.id),
      this.clearData()
    }, 
    updateUseCase () {
      this.getUseCaseById(this.useCaseData.id).processlabel = this.useCaseData.processlabel
      this.getUseCaseById(this.useCaseData.id).label = this.useCaseData.label
      this.getUseCaseById(this.useCaseData.id).property1 = this.useCaseData.property1
      this.getUseCaseById(this.useCaseData.id).property2 = this.useCaseData.property2
      this.getUseCaseById(this.useCaseData.id).property3 = this.useCaseData.property3
      this.setScores(this.useCaseData.id)
      this.clearData()
    },
    setScores(id) {
      this.setBucket1Score(id),
      this.setBucket2Score(id),
      this.setBucket3Score(id),
      this.setBucket4Score(id),
      this.setBucket5Score(id),
      this.setBucket6Score(id)
    },
    setBucket1Score(id) {
      this.useCases[id].bucket1score = Math.random()
    },    
    setBucket2Score(id) {
      this.useCases[id].bucket2score = Math.random()
    },    
    setBucket3Score(id) {
      this.useCases[id].bucket3score = Math.random()
    },    
    setBucket4Score(id) {
      this.useCases[id].bucket4score = Math.random()
    },    
    setBucket5Score(id) {
      this.useCases[id].bucket5score = Math.random()
    },    
    setBucket6Score(id) {
      this.useCases[id].bucket6score = Math.random()
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