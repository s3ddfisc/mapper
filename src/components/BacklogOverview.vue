<script lang ="ts">
  import { mapStores } from 'pinia'
  import { useUseCase } from '../dataStore/useCase'
  import { useProcess } from '../dataStore/process'
  import Plotly from 'plotly.js-dist'

  export default {
    name: 'BacklogOverview',
    data: () => ({
      layout: {
        showlegend: true,
        title: 'Value Cases in the Backlog',
        height: 600,
        width: 600,
        xaxis: {
          title: 'Strategic Goals',
          range: [0.6, 5.4],
        },
        yaxis: {
          title: 'Value Potential',
          range: [0.6, 5.4],
        },
      },
      cases: [
        {
          name: 'Non-validated',
          x: [],
          y: [],
          mode: 'markers',
          text: [],
          marker: {
            color: 'rgb(14, 186, 216)',
            size: [],
            sizeref: 0.1,
          },
        },
        {
          name: 'Validated',
          x: [],
          y: [],
          mode: 'markers',
          text: [],
          marker: {
            color: 'rgb(0, 88, 9)',
            size: [],
            sizeref: 0.1,
          },
        },
      ],
    }),
    computed: {
      ...mapStores(useUseCase, useProcess),
    },
    mounted () {
      this.useCaseStore.useCases.forEach(useCase => {
        if (useCase.bucketID === 0) {
          let validated = 1
          useCase.state === 0 ? validated = 0 : validated = 1
          this.cases[validated].x.push(useCase.items.filter(item => item.label === 'Strategic goals')[0].score)
          this.cases[validated].y.push(useCase.items.filter(item => item.label === 'Value potential')[0].score)
          this.cases[validated].marker.size.push(useCase.items.filter(item => item.label === 'Risk minimization')[0].score)
          console.log(useCase.processId)
          this.cases[validated].text.push(this.processStore.getLabelById(useCase.processId) + '</br>' + useCase.label)
        }
      })
      Plotly.newPlot('backlogOverview', this.cases, this.layout)
    },
  }
</script>

<template>
  <div id='backlogOverview'></div>
</template>
