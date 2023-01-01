import { defineStore } from 'pinia'
import AHP from 'ahp'

export const useGlobal = defineStore('global', {
 
  state: () => {
    return {
      categories: [
        { label: 'category 1', id: 0, weight: 1/3, items: {item1: {label: 'item1', weight: 1}, item2: {label: 'item2', weight: 1}, item3: {label: 'item3', weight: 1}} },
        { label: 'category 2', id: 0, weight: 1/3, items: {item1: {label: 'item1', weight: 1}, item2: {label: 'item2', weight: 1}, item3: {label: 'item3', weight: 1}} },
        { label: 'category 3', id: 0, weight: 1/3, items: {item1: {label: 'item1', weight: 1}, item2: {label: 'item2', weight: 1}, item3: {label: 'item3', weight: 1}} }],
    }
  },

  actions: {
    updateWeights (...args) {
      const ahpContext = new AHP()
      ahpContext.addCriteria(this.categories.map(category => category.label))
      ahpContext.rankCriteria(args[0])
      let critWeightVector = AHP.calculateMatrixConsistency(ahpContext.criteriaRank).weightedVector
      for (let i = 0; i < this.categories.length; i++) {
        this.categories[i].weight = critWeightVector[i]
      }
    }
  }
})