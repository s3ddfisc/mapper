<script lang="ts">
  import { mapStores } from 'pinia'
  import { useUseCase } from '../dataStore/useCase'
  import Plotly from 'plotly.js-dist'

  export default {
    name: 'MonetaryBenefits',
    data: () => ({
      return: [
        {
          x: [],
          y: [],
          name: 'Realized Monetary Value',
          type: 'scatter',
        },
      ],
      layout: {},
    }),
    computed: {
      ...mapStores(useUseCase),
    },
    mounted () {
      const d = new Date()
      const month = d.getMonth() + 1
      console.log(month)
      const year = d.getFullYear()
      for (let p = 0; p < 60; p++) {
        let pmonth = month + p
        const pyear = year - 1 + Math.floor((pmonth - 0.01) / 12)
        if (pmonth > 12) {
          pmonth = pmonth - Math.floor((pmonth - 0.01) / 12) * 12
        }
        this.return[0].x.push(pmonth + '/' + pyear)
        let value = 0
        this.useCaseStore.useCases.filter(useCase => useCase.bucketID === 4).filter(useCase => useCase.monetary).forEach(useCase => {
          const d2 = new Date(useCase.endDate.slice(0, 4), useCase.endDate.slice(5, 7) - 1, useCase.endDate.slice(8, 10))
          if (d2.getFullYear() * 12 + d2.getMonth() <= pyear * 12 + pmonth) {
            if (!useCase.valueRecurring) {
              value = value + useCase.monetaryValue
            } else {
              value = value + useCase.monetaryValue * (pyear * 12 + pmonth - d2.getFullYear() * 12 - d2.getMonth())
            }
          }
        })
        this.return[0].y.push(value)
      }
      Plotly.newPlot('monetaryBenefits', this.return, this.layout)
    },
  }
</script>

<template>
  <div id="monetaryBenefits"></div>
</template>
