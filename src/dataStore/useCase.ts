import { defineStore } from 'pinia'
import AHP from 'ahp'
// import { useProcess } from './process'

interface Item {
  label: string
  weight: number
  score?: number
}

interface Category {
  id: number
  label: string
  weight: number
  score: number
  items?: Array<Item>
  categories?: Array<Category>
}

interface CategoryPair {
  layer: string
  category1: Category
  category2: Category
  importance: number
}

interface UseCase {
  id: number,
  label: string,
  processId: number,
  bucketID: number,
  bucketscores: Array<number>,
  categories: Array<Category>,
}

type PairWeighting = [string, string, number]

export const useUseCase = defineStore('useCase', {
  state: () => {
    return {
      useCaseIdCounter: 0,
      useCases: [] as UseCase[],
      resourceDemand: [],
      categoryPairs: [] as CategoryPair[],
      pairWeighting: [] as PairWeighting[],
      useCaseData: <UseCase>{},
      categories: [{
        label: 'Strategic importance',
        id: 0,
        weight: 1 / 3,
        items: [
          { label: 'Goal1', weight: 1 },
          { label: 'Goal2', weight: 1 },
          { label: 'Goal3', weight: 1 },
        ] as Item[],
      },
      {
        label: 'Risk minimization',
        id: 1,
        weight: 1 / 3,
        categories: [{
          label: 'Challenges and issues',
          id: 0,
          weight: 1 / 4,
          items: [
            { label: 'Involvement of external partners', weight: 1 },
            { label: 'Deviations / process variants', weight: 1 },
            { label: 'Processual weaknesses', weight: 1 },
          ] as Item[],
        },
        {
          label: 'State of data',
          id: 1,
          weight: 1 / 4,
          items: [
            { label: 'Availability of data', weight: 1 },
            { label: 'Data quality', weight: 1 },
          ] as Item[],
        },
        {
          label: 'Organizational support',
          id: 2,
          weight: 1 / 4,
          items: [
            { label: 'Management support', weight: 1 },
            { label: 'Department support', weight: 1 },
            { label: 'Employee support', weight: 1 },
          ] as Item[],
        },
        {
          label: 'Skills and capabilities',
          id: 3,
          weight: 1 / 4,
          items: [
            { label: 'Technological skills', weight: 1 },
            { label: 'analytical skills', weight: 1 },
            { label: 'Process expertise', weight: 1 },
          ] as Item[],
        }] as Category[],
      },
      {
        label: 'Value potential',
        id: 2,
        weight: 1 / 3,
        items: [
          { label: 'Time', weight: 1 },
          { label: 'Cost', weight: 1 },
          { label: 'Quality', weight: 1 },
          { label: 'Flexibility', weight: 1 },
        ] as Item[],
      }] as Category[],
    }
  },

  getters: {
    getGoals (state) {
      return state.categories[0].items
    },
    getUseCaseById: state => {
      return useCaseId => state.useCases[useCaseId]
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
      return useCaseId => {
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
      }
    },
    getUseCasesInBucket: state => {
      return bucketID => state.useCases.filter(useCase => useCase.bucketID === bucketID)
    },
    getGlobalCategoryPairs: state => {
      return state.categoryPairs.filter(pair => pair.layer === 'global')
    },
    getLocalCategoryPairs: state => {
      return state.categoryPairs.filter(pair => pair.layer !== 'global')
    },
  },

  actions: {
    addUseCase () {
      this.useCaseData.id = this.useCaseIdCounter
      this.useCaseIdCounter++
      this.useCaseData.bucketID = 0
      this.useCases.push(this.useCaseData)
      this.setScores(this.useCaseData.id)
      this.clearData()
    },
    updateUseCase () {
      this.useCases[this.useCaseData.id] = this.useCaseData
      this.setScores(this.useCaseData.id)
      this.clearData()
    },
    setScores (id) {
      this.setBucket0Score(id)
      this.setBucket1Score(id)
      this.setBucket2Score(id)
      this.setBucket3Score(id)
      this.setBucket4Score(id)
    },
    setBucket0Score (id) {
      let score = 0
      this.useCases[id].categories.forEach(category => {
        category.score = 0
        let weightSum = 0
        if (category.items !== undefined) {
          for (let i = 0; i < category.items.length; i++) {
            category.score = category.score + category.items[i].weight * category.items[i].score
            weightSum = weightSum + category.items[i].weight
          }
        } else {
          category.categories.forEach(subCategory => {
            subCategory.score = 0
            let weightSum2 = 0
            for (let i = 0; i < subCategory.items.length; i++) {
              subCategory.score = subCategory.score + subCategory.items[i].weight * subCategory.items[i].score
              weightSum2 = weightSum2 + subCategory.items[i].weight
            }
            subCategory.score = subCategory.score / weightSum2
            console.log(subCategory.label + ' ' + subCategory.score)
          })
          for (let i = 0; i < category.categories.length; i++) {
            category.score = category.score + category.categories[i].weight * category.categories[i].score
            weightSum = weightSum + category.categories[i].weight
          }
        }
        category.score = category.score / weightSum
        console.log(category.label + ' ' + category.score)
        score = score + category.weight * category.score
      })
      this.useCases[id].bucketscores[0] = score
    },
    setBucket1Score (id) {
      this.useCases[id].bucketscores[1] = Math.random()
    },
    setBucket2Score (id) {
      this.useCases[id].bucketscores[2] = Math.random()
    },
    setBucket3Score (id) {
      this.useCases[id].bucketscores[3] = Math.random()
    },
    setBucket4Score (id) {
      this.useCases[id].bucketscores[4] = Math.random()
    },
    updateBucket (id, bucketID) {
      this.useCases[id].bucketID = bucketID
    },
    setUseCaseData (id) {
      this.useCaseData = this.useCases[id]
    },
    clearData () {
      const categories = JSON.parse(JSON.stringify(this.categories))
      categories.forEach(category => {
        if (!category.hasOwnProperty('categories')) {
          category.items.forEach(item => {
            item.score = 3
          })
        } else {
          category.categories.forEach(category => {
            category.items.forEach(item => {
              item.score = 3
            })
          })
        }
      })
      const useCase = {
        id: -1,
        label: '',
        processId: -1,
        bucketID: -1,
        bucketscores: [],
        categories,
      } as UseCase
      this.useCaseData = useCase
    },
    updateWeights () {
      this.updateWeightsBody('global', this.categories)
      this.categories.forEach(category => {
        if (category.categories !== undefined) {
          this.updateWeightsBody('local', category.categories)
        }
      })
      this.useCases.forEach(useCase => {
        for (let i = 0; i < useCase.categories.length; i++) {
          useCase.categories[i].weight = this.categories[i].weight
          if (useCase.categories[i].categories !== undefined) {
            for (let j = 0; j < useCase.categories[i].categories.length; j++) {
              useCase.categories[i].categories[j].weight = this.categories[i].categories[j].weight
            }
          }
        }
      })
      this.useCases.forEach(useCase => {
        this.setScores(useCase.id)
      })
    },
    updateWeightsBody (layer: string, categories: Category[]) {
      this.pairWeighting.splice(0)
      let categoryPairs: CategoryPair[]
      if (layer === 'global') {
        categoryPairs = this.getGlobalCategoryPairs
      } else {
        categoryPairs = this.getLocalCategoryPairs
      }
      categoryPairs.forEach(pair => {
        if (pair.importance === 8) {
          this.pairWeighting.push([
            pair.category1,
            pair.category2,
            1,
          ])
        } else if (pair.importance < 8) {
          this.pairWeighting.push([
            pair.category1,
            pair.category2,
            9 - pair.importance,
          ])
        } else {
          this.pairWeighting.push([
            pair.category1,
            pair.category2,
            1 / (pair.importance - 7),
          ])
        }
      })
      const ahpContext = new AHP()
      ahpContext.addCriteria(categories.map(category => category.label))
      ahpContext.rankCriteria(this.pairWeighting)
      const critWeightVector = AHP.calculateMatrixConsistency(ahpContext.criteriaRank).weightedVector
      for (let i = 0; i < categories.length; i++) {
        categories[i].weight = critWeightVector[i]
      }
      console.log(layer + ': ' + critWeightVector)
    },
    deleteGoal (index) {
      this.categories[0].items.splice(index, 1)
      this.useCases.forEach(useCase => {
        useCase.categories[0].items.splice(index, 1)
      })
    },
    addGoal () {
      this.categories[0].items.push({ label: 'new goal', weight: 1 } as Item)
      this.useCases.forEach(useCase => {
        useCase.categories[0].items.push({ label: 'new goal', weight: 1, score: 3 } as Item)
      })
    },
    setCategoryPairs () {
      if (this.categoryPairs.length === 0) {
        for (let i = 0; i < this.categories.length; i++) {
          for (let j = i + 1; j < this.categories.length; j++) {
            this.categoryPairs.push({
              layer: 'global',
              category1: this.categories[i].label,
              category2: this.categories[j].label,
              importance: 8,
            })
          }
          if (this.categories[i].categories !== undefined) {
            for (let j = 0; j < this.categories[i].categories.length; j++) {
              for (let k = j + 1; k < this.categories[i].categories.length; k++) {
                this.categoryPairs.push({
                  layer: this.categories[i].label,
                  category1: this.categories[i].categories[j].label,
                  category2: this.categories[i].categories[k].label,
                  importance: 8,
                })
              }
            }
          }
        }
      }
    },
  },
  // persist: true,
})
