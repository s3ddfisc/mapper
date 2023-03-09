<template>
  <v-navigation-drawer expand-on-hover rail>
    <v-list mandatory nav>
      <NavItem v-for="navitem in navitems" :key="navitem.id" :navitem="navitem" @toggle="selectTab" />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
  import { mapStores } from 'pinia'
  import NavItem from './NavItem.vue'
  import { useConfig } from '../dataStore/config'

  export default {
    name: 'Navigation',
    components: {
      NavItem,
    },
    data: () => ({
      navitems: [
        {
          id: 1,
          icon: 'mdi-map-marker-radius',
          title: 'Strategic Input',
          value: 'StrategicInput',
          description:
            'Define the strategic input relevant for the value case assessment, \n' +
            'i.e., resources, category weighting, and strategic goals.',
        },
        {
          id: 2,
          icon: 'mdi-folder',
          title: 'Process Repository',
          value: 'ProcessRepository',
          description: 'Add processes that are in focus of your process mining operations.\n' +
            'Define process-specific goals and resources.',
        },
        {
          id: 3,
          icon: 'mdi-view-dashboard',
          title: 'Value Case Manager',
          value: 'UseCaseManager',
          description: 'Define the value case portfolio to be implemented.\n' +
            'Track the progress of the value case portfolio.',
          active: true,
        },
        {
          id: 4,
          icon: 'mdi-star-circle',
          title: 'Success Monitor',
          value: 'SuccessMonitor',
          description: 'Track the value creation enabled by process mining operations.',
        },
      ],
    }),
    computed: {
      ...mapStores(useConfig),
    },
    methods: {
      selectTab (el) {
        this.navitems.forEach(function (navitem) {
          navitem.active = false
        })
        el.active = true
        if (el.value === 'UseCaseManager') {
          this.configStore.calculateOptimalPortfolio()
        }
        this.configStore.setEditableProcess(-1)
        this.configStore.setActiveTab(el.value)
      },
    },
  }
</script>
