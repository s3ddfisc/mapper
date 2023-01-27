import { defineStore } from 'pinia'
import { useConfig } from '../dataStore/config'

export interface Attribute {
  label: string
  score: number
}

export interface UseCase {
  id: number,
  label: string,
  processId: number,
  bucketID: number,
  state: number,
  bucketscores: Array<number>,
  items: Array<Attribute>,
}

export const useUseCase = defineStore('useCase', {
  state: () => {
    return {
      useCaseIdCounter: 0,
      useCases: [] as UseCase[],
      resourceDemand: [],
    }
  },

  getters: {
    getUseCaseById: state => {
      return useCaseId => state.useCases[useCaseId]
    },
    getStateById: state => {
      return useCaseId => state.useCases[useCaseId].state
    },
    getItemScoreByIdLabel (state) {
      return (id, label) => {
        return state.useCases[id].items.filter(item => item.label === label)[0].score
      }
    },
    getIdById: state => {
      return useCaseId => state.useCases[useCaseId].id
    },
    getProcessIdById: state => {
      return useCaseId => state.useCases[useCaseId].processId
    },
    getLabelById: state => {
      return useCaseId => state.useCases[useCaseId].label
    },
    getBucketById: state => {
      return useCaseId => state.useCases[useCaseId].bucketID
    },
    getScoreById: state => {
      return useCaseId => Math.round(100 * state.useCases[useCaseId].bucketscores[0]) / 100
      /* {
        if (state.useCases[useCaseId].bucketID === 0) {
          return Math.round(100 * state.useCases[useCaseId].bucketscores[0]) / 100
        } else if (state.useCases[useCaseId].bucketID === 1) {
          return Math.round(100 * state.useCases[useCaseId].bucketscores[1])
        } else if (state.useCases[useCaseId].bucketID === 2) {
          return Math.round(100 * state.useCases[useCaseId].bucketscores[2])
        } else if (state.useCases[useCaseId].bucketID === 3) {
          return Math.round(100 * state.useCases[useCaseId].bucketscores[3])
        } else if (state.useCases[useCaseId].bucketID === 4) {
          return Math.round(100 * state.useCases[useCaseId].bucketscores[4])
        }
      } */
    },
    getUseCasesInBucket: state => {
      return bucketID => state.useCases.filter(useCase => useCase.bucketID === bucketID)
    },
  },

  actions: {
    setUseCase (label: string, processId: number, state: number, items: Array<Attribute>, id?: number) {
      if (id === undefined) {
        this.useCases.push({
          id: this.useCaseIdCounter,
          label,
          bucketID: 0,
          state: 0,
          bucketscores: Array(5),
          processId,
          items,
        } as UseCase)
        this.setScores(this.useCaseIdCounter)
        this.useCaseIdCounter++
      } else {
        this.getUseCaseById(id).label = label
        this.getUseCaseById(id).processId = processId
        this.getUseCaseById(id).items = items
        this.getUseCaseById(id).state = state
        this.setScores(id)
      }
    },
    setScores (id) {
      this.getUseCaseById(id).bucketscores[0] = useConfig().calculateRating(this.getUseCaseById(id).items, this.getProcessIdById(id)).score
      useConfig().calculateRating(this.getUseCaseById(id).items, this.getProcessIdById(id)).subScores.forEach(obj => {
        try {
          console.log(this.getUseCaseById(id).items.filter(item => item.label === obj.label)[0].score = obj.score)
        } catch (error) {
          Array.prototype.push.apply(
            this.getUseCaseById(id).items,
            useConfig().calculateRating(this.getUseCaseById(id).items, this.getProcessIdById(id)).subScores)
        }
      })
    },
    updateBucket (id, bucketID) {
      this.useCases[id].bucketID = bucketID
    },
  },
  persist: true,
})
