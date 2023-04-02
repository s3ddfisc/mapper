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
  score: number,
  optimalPortfolio: boolean,
  resourceDemand: [],
  duration: number,
  startDate: Date,
  endDate: Date,
  monetary: boolean,
  monetaryValue: number,
  valueRecurring: boolean,
  items: Array<Attribute>,
}

export const useUseCase = defineStore('useCase', {
  state: () => {
    return {
      useCaseIdCounter: 0,
      useCases: [] as UseCase[],
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
      return useCaseId => Math.round(100 * state.useCases[useCaseId].score) / 100
    },
    getResourceDemandById: state => {
      return useCaseId => state.useCases[useCaseId].resourceDemand
    },
    getDurationById: state => {
      return useCaseId => state.useCases[useCaseId].duration
    },
    getStartDateById: state => {
      return useCaseId => state.useCases[useCaseId].startDate
    },
    getEndDateById: state => {
      return useCaseId => state.useCases[useCaseId].endDate
    },
    getOptimalPortfolioById: state => {
      return useCaseId => state.useCases[useCaseId].optimalPortfolio
    },
    getUseCasesInBucket: state => {
      return bucketID => state.useCases.filter(useCase => useCase.bucketID === bucketID)
    },
  },

  actions: {
    setUseCase (label: string, processId: number, state: number, items: Array<Attribute>,
      resourceDemand: [], duration, startDate, endDate, monetary, monetaryValue, valueRecurring, id?: number) {
      if (id === undefined) {
        this.useCases.push({
          id: this.useCaseIdCounter,
          label,
          bucketID: 0,
          state,
          score: 0,
          optimalPortfolio: false,
          resourceDemand,
          duration,
          startDate,
          endDate,
          monetary,
          monetaryValue,
          valueRecurring,
          processId,
          items,
        } as UseCase)
        this.useCaseIdCounter++
      } else {
        this.getUseCaseById(id).label = label
        this.getUseCaseById(id).processId = processId
        this.getUseCaseById(id).items = items
        this.getUseCaseById(id).state = state
        this.getUseCaseById(id).resourceDemand = resourceDemand
        this.getUseCaseById(id).duration = duration
        this.getUseCaseById(id).startDate = startDate
        this.getUseCaseById(id).endDate = endDate
        this.getUseCaseById(id).monetary = monetary
        this.getUseCaseById(id).monetaryValue = monetaryValue
        this.getUseCaseById(id).valueRecurring = valueRecurring
      }
      this.setScores(id || this.useCaseIdCounter - 1)
    },
    setScores (id) {
      this.getUseCaseById(id).score = useConfig().calculateRating(this.getUseCaseById(id).items, this.getProcessIdById(id)).score
      useConfig().calculateRating(this.getUseCaseById(id).items, this.getProcessIdById(id)).subScores.forEach(obj => {
        try {
          this.getUseCaseById(id).items.filter(item => item.label === obj.label)[0].score = obj.score
        } catch (error) {
          Array.prototype.push.apply(
            this.getUseCaseById(id).items,
            useConfig().calculateRating(this.getUseCaseById(id).items, this.getProcessIdById(id)).subScores)
        }
      })
    },
    updateBucket (id, bucketID) {
      this.useCases[id].bucketID = bucketID
      this.updateState(id, bucketID)
    },
    updateState (id, bucketId) {
      if (bucketId > 0 && bucketId < 5) {
        this.getUseCaseById(id).state = bucketId
      } else if (this.getUseCaseById(id).state > 2) {
        this.getUseCaseById(id).state = 2
      }
    },
    deleteGoal (label) {
      this.useCases.forEach(useCase => {
        useCase.items.splice(useCase.items.map(item => item.label).indexOf(label), 1)
      })
    },
  },
  persist: true,
})
