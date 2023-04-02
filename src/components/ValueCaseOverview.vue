<script lang ="ts">
  import { mapStores } from 'pinia'
  import { useUseCase } from '../dataStore/useCase'
  import { useProcess } from '../dataStore/process'
  import Plotly from 'plotly.js-dist'

  export default {
    name: 'ValueCaseOverview',
    data: () => ({
      layout: {
        showlegend: true,
        title: 'Value Cases in the Backlog',
        height: 600,
        width: 600,
        margin: {
          l: 0,
          r: 0,
          b: 0,
          t: 0,
        },
      },
      cases: [
        {
          type: 'sunburst',
          ids: [],
          labels: [],
          parents: [],
          values: [],
          branchvalues: 'total',
          insidetextorientation: 'radial',
          outsidetextfont: {
            size: 20,
            color: '#377eb8',
          },
          leaf: {
            opacity: 0.7,
          },
          marker: {
            line: {
              width: 3,
            },
          },
        },
      ],
    }),
    computed: {
      ...mapStores(useUseCase, useProcess),
    },
    mounted () {
      this.processStore.processes.forEach(process => {
        this.cases[0].ids.push(process.label)
        this.cases[0].labels.push(process.label)
        this.cases[0].parents.push('')
        this.cases[0].values.push(this.useCaseStore.useCases.filter(useCase => useCase.bucketID !== 5 &&
          useCase.processId === process.id).length)
        for (let i = 0; i < 5; i++) {
          if (this.useCaseStore.useCases.filter(useCase => useCase.bucketID === i &&
            useCase.processId === process.id).length > 0) {
            let label = ''
            i === 0 ? label = 'Backlog' : i === 1 ? label = 'Core Development' : i === 2
              ? label = 'Insight' : i === 3 ? label = 'Action' : label = 'Value'
            this.cases[0].ids.push(process.label + ' - ' + label)
            this.cases[0].labels.push(label)
            this.cases[0].parents.push(process.label)
            this.cases[0].values.push(this.useCaseStore.useCases.filter(useCase => useCase.bucketID === i &&
              useCase.processId === process.id).length)
          }
        }
      })
      Plotly.newPlot('valueCaseOverview', this.cases, this.layout)
    },
  }
</script>

<template>
  <div id='valueCaseOverview'></div>
</template>
