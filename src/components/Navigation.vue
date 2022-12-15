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
        { id: 1, icon: 'mdi-map-marker-radius', title: 'Strategic Input', value: 'StrategicInput' },
        { id: 2, icon: 'mdi-folder', title: 'Process Repository', value: 'ProcessRepository' },
        { id: 3, icon: 'mdi-view-dashboard', title: 'Use Case Manager', value: 'UseCaseManager', active: true },
        { id: 4, icon: 'mdi-star-circle', title: 'Success Monitor', value: 'SuccessMonitor' },
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
        this.configStore.setEditableProcess(-1)
        this.configStore.setActiveTab(el.value)
      },
    },
  }
</script>
