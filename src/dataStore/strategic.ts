import { defineStore } from 'pinia'
import { useConfig } from './config'

interface Item {
  label: string
  weight?: number
}

interface Category {
  label: string
  weight: number
  riskFactor?: number
  categories?: Array<Category>
  items?: Array<Item>
}

interface CategoryPair {
  category1: Category
  category2: Category
  importance: number
}

export const useStrategic = defineStore('strategic', {

  state: () => {
    return {
      globalCategoryPairs: [] as CategoryPair[],
      riskCategoryPairs: [] as CategoryPair[],
      riskScore: 3,
      categories: [
        {
          label: 'Strategic goals',
          weight: 1 / 3,
          items: [
            { label: 'Goal1', weight: 1 },
            { label: 'Goal2', weight: 1 },
            { label: 'Goal3', weight: 1 },
          ] as Item[],
        } as Category,
        {
          label: 'Risk minimization',
          weight: 1 / 3,
          riskFactor: 1,
          categories: [{
            label: 'Challenges and issues',
            weight: 1 / 4,
            items: [
              { label: 'Involvement of external partners', weight: 1 },
              { label: 'Deviations / process variants', weight: 1 },
              { label: 'Processual weaknesses', weight: 1 },
            ] as Item[],
          },
          {
            label: 'State of data',
            weight: 1 / 4,
            items: [
              { label: 'Availability of data', weight: 1 },
              { label: 'Data quality', weight: 1 },
            ] as Item[],
          },
          {
            label: 'Organizational support',
            weight: 1 / 4,
            items: [
              { label: 'Management support', weight: 1 },
              { label: 'Department support', weight: 1 },
              { label: 'Employee support', weight: 1 },
            ] as Item[],
          },
          {
            label: 'Skills and capabilities',
            weight: 1 / 4,
            items: [
              { label: 'Technological skills', weight: 1 },
              { label: 'analytical skills', weight: 1 },
              { label: 'Process expertise', weight: 1 },
            ] as Item[],
          }] as Category[],
        } as Category,
        {
          label: 'Value potential',
          weight: 1 / 3,
          items: [
            { label: 'Time' },
            { label: 'Cost' },
            { label: 'Quality' },
            { label: 'Flexibility' },
          ] as Item[],
        } as Category,
      ] as Category[],
    }
  },

  getters: {
    getGlobalCategoryPairs: state => {
      if (state.globalCategoryPairs.length === 0) {
        for (let i = 0; i < state.categories.length; i++) {
          for (let j = i + 1; j < state.categories.length; j++) {
            state.globalCategoryPairs.push({ category1: state.categories[i], category2: state.categories[j], importance: 8 })
          }
        }
      }
      return state.globalCategoryPairs
    },
    getRiskCategoryPairs: state => {
      if (state.riskCategoryPairs.length === 0) {
        for (let i = 0; i < state.categories[1].categories.length; i++) {
          for (let j = i + 1; j < state.categories[1].categories.length; j++) {
            state.riskCategoryPairs.push({
              category1: state.categories[1].categories[i],
              category2: state.categories[1].categories[j],
              importance: 8,
            })
          }
        }
      }
      return state.riskCategoryPairs
    },
  },

  actions: {
    updateGlobalWeights () {
      const critWeightVector = useConfig().getAHPWeights(this.categories.map(category => category.label), this.globalCategoryPairs)
      for (let i = 0; i < this.categories.length; i++) {
        this.categories[i].weight = critWeightVector[i]
      }
      useConfig().updateScores()
    },
    updateRiskWeights () {
      const critWeightVector = useConfig().getAHPWeights(this.categories[1].categories.map(category => category.label),
        this.riskCategoryPairs)
      for (let i = 0; i < this.categories[1].categories.length; i++) {
        this.categories[1].categories[i].weight = critWeightVector[i]
      }
      useConfig().updateScores()
    },
    updateRiskFactor () {
      if (this.riskScore === 1) {
        this.categories[1].riskFactor = 2
      }
      if (this.riskScore === 2) {
        this.categories[1].riskFactor = 1.5
      }
      if (this.riskScore === 3) {
        this.categories[1].riskFactor = 1
      }
      if (this.riskScore === 4) {
        this.categories[1].riskFactor = 0.75
      }
      if (this.riskScore === 5) {
        this.categories[1].riskFactor = 0.5
      }
      useConfig().updateScores()
    },
    deleteGoal (index) {
      this.categories[0].items.splice(index, 1)
    },
    addGoal () {
      this.categories[0].items.push({ label: 'new goal', weight: 1 } as Item)
      useConfig().updateScores()
    },
  },
  persist: true,
})
