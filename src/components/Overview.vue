<script lang="ts">
  import { mapStores } from 'pinia'
  import { useStrategic } from '../dataStore/strategic'

  export default {
    name: 'Overview',
    data () {
      return {
        activePanel: [],
        activePanel2: [],
      }
    },
    computed: {
      ...mapStores(useStrategic),
    },
  }
</script>

<template>
  <v-card>
    <v-expansion-panels v-model="activePanel">
      <v-expansion-panel v-for="(category, index) in strategicStore.categories" :key="index">
        <v-expansion-panel-title>
          <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start">
              {{ category.label }}
            </v-col>
            <v-col cols="4" class="d-flex justify-start">
              {{ 'Weight: ' + Math.round(category.weight*100) / 100 }}
            </v-col>
          </v-row>
          <v-tooltip
            open-delay=1000
            content-class="custom-tooltip"
            activator="parent"
            location="top left"
          >
          <span style="white-space: pre;" v-html="category.description" />
          </v-tooltip>
        </v-expansion-panel-title>
        <v-expansion-panel-text v-if="category.items != undefined">
          <v-row v-for="(item, index) in category.items" :key="index" no-gutters>
            <v-col cols="4" class="d-flex justify-start">
              {{ item.label }}
            </v-col>
            <v-col v-if="item.weight != undefined" cols="4" class="d-flex justify-start">
              {{ 'Weight: ' + Math.round(item.weight*100) / 100 }}
            </v-col>
            <v-col v-else cols="4" class="d-flex justify-start">
              {{ 'Weight: process-dependent (see Process Repository)'}}
            </v-col>
          </v-row>
        </v-expansion-panel-text>
        <v-expansion-panel-text v-else>
          <v-expansion-panels v-model="activePanel2">
            <v-expansion-panel v-for="(category2, index) in category.categories" :key="index">
              <v-expansion-panel-title>
                <v-row no-gutters>
                  <v-col cols="4" class="d-flex justify-start">
                    {{ category2.label }}
                  </v-col>
                  <v-col cols="4" class="d-flex justify-start">
                    {{ 'Weight: ' + Math.round(category2.weight*100) / 100 }}
                  </v-col>
                </v-row>
                <v-tooltip
                  open-delay=1000
                  content-class="custom-tooltip"
                  activator="parent"
                  location="top left"
                >
                <span style="white-space: pre;" v-html="category2.description" />
                </v-tooltip>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row v-for="(item, index) in category2.items" :key="index" no-gutters>
                  <v-col cols="4" class="d-flex justify-start">
                    {{ item.label }}
                  </v-col>
                  <v-col cols="4" class="d-flex justify-start">
                    {{ 'Weight: ' + Math.round(item.weight*100) / 100 }}
                  </v-col>
                  <v-tooltip
                    open-delay=1000
                    content-class="custom-tooltip"
                    activator="parent"
                    location="top left"
                  >
                  <span style="white-space: pre;" v-html="item.description" />
                  </v-tooltip>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>
