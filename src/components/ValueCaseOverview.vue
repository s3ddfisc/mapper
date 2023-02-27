<script lang ="ts">
  import { mapStores } from 'pinia'
  import { useUseCase } from '../dataStore/useCase'
  import { Bubble } from 'vue-chartjs'
  import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js'

  ChartJS.register(LinearScale, PointElement, Tooltip, Legend)

  export default {
    name: 'ValueCaseOverview',
    components: { Bubble },
    data () {
      return {
        loaded: false,
        chartData: {
          datasets: [],
        },
        chartOptions: {
          plugins: {
            legend: {
              display: false,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              min: 1,
              max: 50,
            },
            y: {
              min: 1,
              max: 50,
            },
          },
        },
      }
    },
    computed: {
      ...mapStores(useUseCase),
    },
    async mounted () {
      this.loaded = false
      this.useCaseStore.getUseCasesInBucket(0).forEach(useCase => {
        this.chartData.datasets.push(
          {
            label: useCase.label,
            backgroundColor: '#7C8CF8',
            data: [{
              x: 10 * this.useCaseStore.getItemScoreByIdLabel(useCase.id, 'Value potential'),
              y: 10 * this.useCaseStore.getItemScoreByIdLabel(useCase.id, 'Strategic goals'),
              r: 10 * this.useCaseStore.getItemScoreByIdLabel(useCase.id, 'Risk minimization'),
            }],
          }
        )
      })
      this.loaded = true
    },
  }
</script>

<template>
  <v-card>
    <Bubble
      v-if="loaded"
      :options="chartOptions"
      :data="chartData"
    />
  </v-card>
</template>
