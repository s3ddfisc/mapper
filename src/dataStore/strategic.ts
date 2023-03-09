import { defineStore } from 'pinia'
import { useConfig } from './config'
import { Attribute, useUseCase } from './useCase'

interface Item {
  label: string
  description?: string
  weight?: number
}

interface Category {
  label: string
  description: string
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
      resources: [
        {
          label: 'Technical',
          fteTotal: 1,
          fteAvailable: 1,
          description: 'E.g., data engineers or data scientists dedicated to the process mining team',
        },
        {
          label: 'Analytical',
          fteTotal: 1,
          fteAvailable: 1,
          description: 'E.g., data or process analysts dedicated to the process mining team',
        },
      ],
      categories: [
        {
          label: 'Strategic goals',
          description: 'Importance of the strategic relevance of each process for the value case assessment.\n' +
            'The goal is to find out which processes have the greatest impact on the strategic goals of an organization.\n' +
            'It makes sense to select those processes that most directly relate to the strategic goals of an organization.',
          weight: 1 / 3,
          items: [
            { label: 'Goal1', weight: 1 },
            { label: 'Goal2', weight: 1 },
            { label: 'Goal3', weight: 1 },
          ] as Item[],
        } as Category,
        {
          label: 'Risk minimization',
          description: 'The importance of considerable value case risks for the value case assessment.For each process, \n' +
            'it should be determined how susceptible it is to BPM initiatives to consider obstacles for achieving results from \n' +
            'process mining value cases. It makes sense to focus on those processes where it is reasonable to achieve benefits.',
          weight: 1 / 3,
          riskFactor: 1,
          categories: [{
            label: 'Challenges and issues',
            description: 'Refer to circumstances of the current process execution and obstacles that may result from PM adoption.',
            weight: 1 / 4,
            items: [
              {
                label: 'Involvement of external partners',
                weight: 1,
                description: 'Depicts how external partners/organizations are involved in the execution, analysis, \n' +
                'and optimization of the process and which dependencies (e.g., data provision) exist',
              },
              {
                label: 'Deviations / process variants',
                weight: 1,
                description: 'Shows deviants from the standard process and thus, process variants, which have to be \n' +
                'considered during the execution, analysis, and optimization of the process',
              },
              {
                label: 'Processual weaknesses',
                weight: 1,
                description: 'Describes weaknesses and problems that currently arise during the process execution',
              },
            ] as Item[],
          },
          {
            label: 'State of data',
            description: 'PM requires event log data from existing systems with sufficient data quality',
            weight: 1 / 4,
            items: [
              {
                label: 'Availability of data',
                weight: 1,
                description: 'Contains information about the (meta-)data that can be provided for PM analysis',
              },
              {
                label: 'Data quality',
                weight: 1,
                description: 'Describes data quality and thereby indicates how someone can use the provided data for PM analysis',
              },
            ] as Item[],
          },
          {
            label: 'Organizational support',
            description: 'Refers to the support of stakeholders at different levels relevant to the process mining initiatives.',
            weight: 1 / 4,
            items: [
              {
                label: 'Management support',
                weight: 1,
                description: 'Shows the extent to which top management in general and middle management \n' +
                'from all business units involved in the process support PM adoption',
              },
              {
                label: 'Department support',
                weight: 1,
                description: 'Shows the extent to which employee organizations support PM adoption',
              },
              {
                label: 'Employee support',
                weight: 1,
                description: 'Shows the extent to which employees support PM adoption and commit towards continuous PM application',
              },
            ] as Item[],
          },
          {
            label: 'Skills and capabilities',
            description: 'Employee skills are necessary for a successful PM adoption.',
            weight: 1 / 4,
            items: [
              {
                label: 'Technological skills',
                weight: 1,
                description: 'Summarizes employees’ skills to provide data and to connect IS for applying PM',
              },
              {
                label: 'analytical skills',
                weight: 1,
                description: 'Summarizes employees’ skills to conduct meaningful analysis with the help of PM \n' +
                'that result in the revelation of valuable insights and the development of actions for process optimization',
              },
              {
                label: 'Process expertise',
                weight: 1,
                description: 'Summarizes employees’ knowledge and expertise about the evaluated process',
              },
            ] as Item[],
          }] as Category[],
        } as Category,
        {
          label: 'Value potential',
          description: 'The importance of potential to improve the overall process performance.\n' +
            'It makes sense to determine which processes are the ones that may profit the most from process mining value cases.',
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
    getDescriptionByLabel: state => {
      return label => {
        let value = ''
        state.categories[1].categories?.forEach(category => {
          if (category.label === label) {
            value = category.description
          }
          category.items?.forEach(item => {
            if (item.label === label) {
              value = item.description
            }
          })
        })
        return value
      }
    },
    getResourceByLabel: state => {
      return label => state.resources.filter(type => type.label === label)[0]
    },
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
      useUseCase().deleteGoal(this.categories[0].items[index].label)
      useConfig().categoryTemplate[0].items?.splice(index, 1)
      this.categories[0].items.splice(index, 1)
      useConfig().updateScores()
    },
    addGoal () {
      this.categories[0].items.push({ label: 'new goal', weight: 1 } as Item)
      useUseCase().useCases.forEach(useCase => {
        useCase.items.push({ label: 'new goal', score: 3 } as Attribute)
      })
      useConfig().categoryTemplate[0].items?.push({ label: 'new goal', score: 3 } as Item)
      useConfig().updateScores()
    },
  },
  persist: true,
})
