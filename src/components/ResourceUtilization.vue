<script lang="ts">
  import { mapStores } from 'pinia'
  import { useStrategic } from '../dataStore/strategic'
  import { useProcess } from '../dataStore/process'
  import Plotly from 'plotly.js-dist'

  export default {
    name: 'ValueCaseOverview',
    data: () => ({
      types: [
        {
          x: [],
          y: [],
          name: 'FTE Used',
          type: 'bar',
          orientation: 'h',
        },
        {
          x: [],
          y: [],
          name: 'FTE Available',
          type: 'bar',
          orientation: 'h',
        },
      ],
      layout: {
        barmode: 'stack',
      },
    }),
    computed: {
      ...mapStores(useStrategic, useProcess),
    },
    mounted () {
      this.processStore.processes.slice().reverse().forEach(process => {
        this.types[0].x.push(process.resources.fteTotal - process.resources.fteAvailable)
        this.types[1].x.push(process.resources.fteAvailable)
        this.types[0].y.push(process.label)
        this.types[1].y.push(process.label)
      })
      this.strategicStore.resources.forEach(type => {
        this.types[0].x.push(type.fteTotal - type.fteAvailable)
        this.types[1].x.push(type.fteAvailable)
        this.types[0].y.push(type.label)
        this.types[1].y.push(type.label)
      })
      Plotly.newPlot('resourceUtilization', this.types, this.layout)
    },
  }
</script>

<template>
  <div id="resourceUtilization"></div>
</template>
