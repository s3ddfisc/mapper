import { defineStore } from 'pinia'
import AHP from 'ahp'
import { Attribute, useUseCase } from './useCase'
import { useProcess } from './process'
import { useStrategic } from './strategic'
import * as _ from 'lodash'

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

interface ProcessualDemand {
  processId: number
  demand: number
}

type PairWeighting = [string, string, number]

export const useConfig = defineStore('config', {
  state: () => {
    return {
      activeTab: 'UseCaseManager',
      useCaseEditMode: false,
      useCaseForm: false,
      valueCaseOverview: false,
      useCaseFormCache: {
        id: Number,
        label: '',
        useCaseState: 0,
        processId: Number,
        processLabel: '',
        resourceDemand: [],
        duration: 0,
        startDate: null,
        endDate: null,
        monetary: false,
        monetaryValue: 0,
        volume: 3,
        valueRecurring: false,
        categories: [] as Category[],
      },
      resourceTemplate: [
        { label: 'Technical', fte: 0 },
        { label: 'Analytical', fte: 0 },
        { label: 'Processual', fte: 0 },
      ],
      categoryTemplate: [
        {
          label: 'Strategic goals',
          items: [
            { label: 'Goal1', score: 3 },
            { label: 'Goal2', score: 3 },
            { label: 'Goal3', score: 3 },
          ] as Item[],
        } as Category,
        {
          label: 'Risk minimization',
          categories: [{
            label: 'Challenges and issues',
            items: [
              { label: 'Involvement of external partners', score: 3 },
              { label: 'Deviations / process variants', score: 3 },
              { label: 'Processual weaknesses', score: 3 },
            ] as Item[],
          },
          {
            label: 'State of data',
            items: [
              { label: 'Availability of data', score: 3 },
              { label: 'Data quality', score: 3 },
            ] as Item[],
          },
          {
            label: 'Organizational support',
            items: [
              { label: 'Management support', score: 3 },
              { label: 'Department support', score: 3 },
              { label: 'Employee support', score: 3 },
            ] as Item[],
          },
          {
            label: 'Skills and capabilities',
            items: [
              { label: 'Technological skills', score: 3 },
              { label: 'analytical skills', score: 3 },
              { label: 'Process expertise', score: 3 },
            ] as Item[],
          }] as Category[],
        } as Category,
        {
          label: 'Value potential',
          items: [
            { label: 'Time', score: 3 },
            { label: 'Cost', score: 3 },
            { label: 'Quality', score: 3 },
            { label: 'Flexibility', score: 3 },
          ] as Item[],
        } as Category,
      ],
    }
  },
  actions: {
    resetCache () {
      this.useCaseEditMode = false
      this.useCaseForm = false
      this.processLabel = ''
      this.useCaseFormCache = {
        id: Number,
        label: '',
        useCaseState: 0,
        processId: Number,
        resourceDemand: [],
        duration: 0,
        startDate: null,
        endDate: null,
        monetary: false,
        monetaryValue: 0,
        volume: 3,
        valueRecurring: false,
        categories: [] as Category[],
      }
    },
    setUseCase () {
      const items = [] as Array<Attribute>
      this.useCaseFormCache.categories.forEach(category => {
        if (category.items === undefined) {
          category.categories.forEach(subcategory => {
            subcategory.items.forEach(item => {
              items.push({ label: item.label, score: item.score } as Attribute)
            })
          })
        } else {
          category.items.forEach(item => {
            items.push({ label: item.label, score: item.score } as Attribute)
          })
        }
      })
      if (this.useCaseFormCache.id >= 0) {
        useUseCase().setUseCase(
          this.useCaseFormCache.label,
          useProcess().getIdByLabel(this.useCaseFormCache.processLabel),
          this.useCaseFormCache.useCaseState,
          items,
          this.useCaseFormCache.resourceDemand,
          this.useCaseFormCache.duration,
          this.useCaseFormCache.startDate,
          this.useCaseFormCache.endDate,
          this.useCaseFormCache.monetary,
          this.useCaseFormCache.monetaryValue,
          this.useCaseFormCache.volume,
          this.useCaseFormCache.valueRecurring,
          this.useCaseFormCache.id
        )
      } else {
        useUseCase().setUseCase(
          this.useCaseFormCache.label,
          useProcess().getIdByLabel(this.useCaseFormCache.processLabel),
          this.useCaseFormCache.useCaseState,
          items,
          this.useCaseFormCache.resourceDemand,
          this.useCaseFormCache.duration,
          this.useCaseFormCache.startDate,
          this.useCaseFormCache.endDate,
          this.useCaseFormCache.monetary,
          this.useCaseFormCache.monetaryValue,
          this.useCaseFormCache.volume,
          this.useCaseFormCache.valueRecurring
        )
      }
      useConfig().calculateOptimalPortfolio()
      this.resetCache()
    },
    setActiveTab (tab) {
      this.activeTab = tab
    },
    setUseCaseForm (id?: number) {
      if (id === undefined) {
        this.useCaseFormCache.categories = _.cloneDeep(this.categoryTemplate)
        this.useCaseFormCache.resourceDemand = _.cloneDeep(this.resourceTemplate)
      } else {
        this.useCaseEditMode = true
        this.useCaseFormCache.id = id
        this.useCaseFormCache.useCaseState = useUseCase().getStateById(id)
        this.useCaseFormCache.label = useUseCase().getLabelById(id)
        this.useCaseFormCache.processId = useUseCase().getProcessIdById(id)
        this.useCaseFormCache.resourceDemand = useUseCase().getResourceDemandById(id)
        this.useCaseFormCache.duration = useUseCase().getDurationById(id)
        this.useCaseFormCache.startDate = useUseCase().getStartDateById(id)
        this.useCaseFormCache.endDate = useUseCase().getEndDateById(id)
        this.useCaseFormCache.monetary = useUseCase().getMonetaryById(id)
        this.useCaseFormCache.monetaryValue = useUseCase().getMonetaryValueById(id)
        this.useCaseFormCache.volume = useUseCase().getVolumeById(id)
        this.useCaseFormCache.valueRecurring = useUseCase().getValueRecurringById(id)
        this.useCaseFormCache.processLabel = useProcess().getLabelById(this.useCaseFormCache.processId)
        const categories = _.cloneDeep(this.categoryTemplate)
        categories.forEach(category => {
          if (category.items === undefined) {
            category.categories.forEach(subcategory => {
              subcategory.items.forEach(item2 => {
                item2.score = _.cloneDeep(useUseCase().getUseCaseById(id).items.filter(item => item.label === item2.label)[0].score)
              })
            })
          } else {
            category.items.forEach(item2 => {
              item2.score = _.cloneDeep(useUseCase().getUseCaseById(id).items.filter(item => item.label === item2.label)[0].score)
            })
          }
        })
        this.useCaseFormCache.categories = categories
      }
      this.useCaseForm = true
    },
    setEditableProcess (id) {
      this.editableProcess = id
    },
    getAHPWeights (categoryLabels, categoryPairs: CategoryPair[]) {
      const pairWeighting: PairWeighting[] = []
      categoryPairs.forEach(pair => {
        if (pair.importance === 8) {
          pairWeighting.push([
            pair.category1.label,
            pair.category2.label,
            1,
          ])
        } else if (pair.importance < 8) {
          pairWeighting.push([
            pair.category1.label,
            pair.category2.label,
            9 - pair.importance,
          ])
        } else {
          pairWeighting.push([
            pair.category1.label,
            pair.category2.label,
            1 / (pair.importance - 7),
          ])
        }
      })
      const ahpContext = new AHP()
      ahpContext.addCriteria(categoryLabels)
      ahpContext.rankCriteria(pairWeighting)
      const critWeightVector = AHP.calculateMatrixConsistency(ahpContext.criteriaRank).weightedVector
      return critWeightVector
    },
    getAttributeScore (attributes: Array<Attribute>, label: string) {
      return attributes.filter(attribute => attribute.label === label)[0].score
    },
    updateScores () {
      useUseCase().useCases.forEach(useCase => {
        useUseCase().setScores(useCase.id)
      })
    },
    calculateRating (attributes: Array<Attribute>, processId: number, volume: number) {
      let score = 0
      let weightCache = 0
      let strategicScore = 0
      useStrategic().categories[0].items?.forEach(item => {
        strategicScore = strategicScore + item.weight * this.getAttributeScore(attributes, item.label)
        weightCache = weightCache + item.weight
      })
      strategicScore = strategicScore / weightCache
      weightCache = 0
      let riskScore = 0
      useStrategic().categories[1].categories?.forEach(category => {
        let subcategoryScore = 0
        category.items?.forEach(item => {
          subcategoryScore = subcategoryScore + item.weight * this.getAttributeScore(attributes, item.label)
          weightCache = weightCache + item.weight
        })
        subcategoryScore = subcategoryScore / weightCache
        weightCache = 0
        riskScore = riskScore + subcategoryScore * category.weight
      })
      let valueScore = 0
      weightCache = 0
      useStrategic().categories[2].items?.forEach(item => {
        valueScore = valueScore + useProcess().getWeight(processId, item.label) * this.getAttributeScore(attributes, item.label)
        weightCache = weightCache + useProcess().getWeight(processId, item.label)
      })
      valueScore = valueScore / weightCache
      score = Math.pow((strategicScore * useStrategic().categories[0].weight +
        riskScore * useStrategic().categories[1].weight * useStrategic().categories[1].riskFactor +
        valueScore * useStrategic().categories[2].weight * volume / 3) / (
        useStrategic().categories[0].weight +
        useStrategic().categories[1].weight * useStrategic().categories[1].riskFactor +
        useStrategic().categories[2].weight * volume / 3), Math.log(100) / Math.log(5))
      const subScores = [
        { label: 'Strategic goals', score: strategicScore },
        { label: 'Risk minimization', score: riskScore },
        { label: 'Value potential', score: valueScore }]
      return { score, subScores }
    },
    setAvailableResources () {
      const inProgress = useUseCase().useCases.filter(useCase => useCase.bucketID > 0 && useCase.bucketID < 4)
      useStrategic().resources[0].fteAvailable = useStrategic().resources[0].fteTotal
      useStrategic().resources[1].fteAvailable = useStrategic().resources[1].fteTotal
      useProcess().processes.forEach(process => {
        process.resources.fteAvailable = process.resources.fteTotal
      })
      inProgress.forEach(useCase => {
        useStrategic().resources[0].fteAvailable = (useStrategic().resources[0].fteAvailable - useCase.resourceDemand[0].fte).toFixed(2)
        useStrategic().resources[1].fteAvailable = (useStrategic().resources[1].fteAvailable - useCase.resourceDemand[1].fte).toFixed(2)
        useProcess().getProcessById(useUseCase().getProcessIdById(useCase.id))[0].resources.fteAvailable =
          (useProcess().getProcessById(useUseCase().getProcessIdById(useCase.id))[0].resources.fteAvailable -
          useCase.resourceDemand[2].fte).toFixed(2)
      })
      useProcess().processes.forEach(process => {
        if (useUseCase().useCases.filter(useCase => useCase.bucketID === 1).map(useCase => useCase.processId).includes(process.id)) {
          useStrategic().resources[0].fteAvailable =
            (useStrategic().resources[0].fteAvailable - process.resourceDemandCore[0].fte).toFixed(2)
          useStrategic().resources[1].fteAvailable =
            (useStrategic().resources[1].fteAvailable - process.resourceDemandCore[1].fte).toFixed(2)
          process.resources.fteAvailable = (process.resources.fteAvailable - process.resourceDemandCore[2].fte).toFixed(2)
        }
      })
    },
    calculateOptimalPortfolio () {
      this.setAvailableResources()
      const backlog = useUseCase().useCases.filter(useCase => useCase.bucketID === 0 && useCase.state > 0)
      const portfolioOptions = theArray => theArray.reduce((subsets, value) => subsets.concat(
        subsets.map(set => [value, ...set])),
      [[]]
      )
      const manageableOptions = []
      portfolioOptions(backlog.map(useCase => useCase.id)).forEach(option => {
        let technicalDemand = 0
        let analyticalDemand = 0
        const processualDemands = [] as ProcessualDemand[]
        option.forEach(id => {
          if (!processualDemands.map(process => process.processId).includes(useUseCase().getProcessIdById(id))) {
            processualDemands.push({ processId: useUseCase().getProcessIdById(id), demand: 0 } as ProcessualDemand)
            if (!useProcess().getCoreStatusById(useUseCase().getUseCaseById(id).processId)) {
              technicalDemand = technicalDemand +
                useProcess().getProcessById(useUseCase().getUseCaseById(id).processId)[0].resourceDemandCore[0].fte
              analyticalDemand = analyticalDemand +
                useProcess().getProcessById(useUseCase().getUseCaseById(id).processId)[0].resourceDemandCore[1].fte
              processualDemands.filter(process => process.processId === useUseCase().getProcessIdById(id))[0]
                .demand = useProcess().getProcessById(useUseCase().getUseCaseById(id).processId)[0].resourceDemandCore[2].fte
            }
          }
          technicalDemand = technicalDemand + useUseCase().getUseCaseById(id).resourceDemand[0].fte
          analyticalDemand = analyticalDemand + useUseCase().getUseCaseById(id).resourceDemand[1].fte
          processualDemands.filter(process => process.processId === useUseCase().getProcessIdById(id))[0]
            .demand = processualDemands.filter(process => process.processId === useUseCase().getProcessIdById(id))[0]
              .demand + useUseCase().getUseCaseById(id).resourceDemand[2].fte
        })
        if (technicalDemand <= useStrategic().resources[0].fteAvailable && analyticalDemand <= useStrategic().resources[1].fteAvailable) {
          let manageable = true
          processualDemands.forEach(process => {
            if (process.demand > useProcess().getProcessById(process.processId)[0].resources.fteAvailable) {
              manageable = false
            }
          })
          if (manageable) {
            manageableOptions.push(option)
          }
        }
      })
      let favoriteOption = { option: [], portfolioScore: 0 }
      manageableOptions.forEach(option => {
        let portfolioScore = 0
        option.forEach(useCase => {
          let effort = useUseCase().getUseCaseById(useCase).resourceDemand.map(demand => demand.fte)
            .reduce(function (a, b) {
              return a + b
            }) * useUseCase().getUseCaseById(useCase).duration
          if (useProcess().getCoreStatusById(useUseCase().getUseCaseById(useCase).processId)) {
            let processCounter = 0
            option.forEach(useCase2 => {
              if (useUseCase().getProcessIdById(useCase) === useUseCase().getProcessIdById(useCase2)) {
                processCounter++
              }
            })
            effort = effort + useProcess().getProcessById(useUseCase().getProcessIdById(useCase))[0]
              .resourceDemandCore.map(demand => demand.fte).reduce(function (a, b) {
                return a + b
              }) * useProcess().getProcessById(useUseCase().getProcessIdById(useCase))[0].duration / processCounter
          }
          portfolioScore = portfolioScore + useUseCase().getScoreById(useCase) / effort
        })
        if (portfolioScore > favoriteOption.portfolioScore) {
          favoriteOption = { option, portfolioScore }
        }
      })
      useUseCase().useCases.forEach(useCase => {
        useCase.optimalPortfolio = false
      })
      favoriteOption.option.forEach(useCase => {
        useUseCase().getUseCaseById(useCase).optimalPortfolio = true
      })
    },
    validateState () {
      if (this.useCaseFormCache.useCaseState !== 0) {
        if (this.useCaseFormCache.processLabel !== '') {
          useProcess().processes.filter(process => process.label === this.useCaseFormCache.processLabel)[0].coreDevelopmentCompleted
            ? this.useCaseFormCache.useCaseState = 2 : this.useCaseFormCache.useCaseState = 1
        } else this.useCaseFormCache.useCaseState = 1
      }
    },
    implementPortfolio () {
      useUseCase().useCases.forEach(useCase => {
        if (useCase.optimalPortfolio === true) {
          useCase.optimalPortfolio = false
          useCase.state === 1 ? useCase.bucketID = 1 : useCase.bucketID = 2
        }
      })
    },
    updateGoals (id, oldValue, newValue) {
      useStrategic().categories[0].items[id].label = newValue
      this.categoryTemplate[0].items[id].label = newValue
      useUseCase().useCases.forEach(useCase => {
        useCase.items.filter(item => item.label === oldValue)[0].label = newValue
      })
    },
  },
  persist: true,
})
