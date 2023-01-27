<script lang="ts">
  import { mapStores } from 'pinia'
  import { useStrategic } from '../dataStore/strategic'

  export default {
    name: 'Categories',
    data () {
      return {
        activePanel: [],
      }
    },
    computed: {
      ...mapStores(useStrategic),
    },
  }
</script>

<template>
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
        </v-expansion-panel-title>
        <v-expansion-panel-text v-if="category.items != undefined">
          <br />
          <v-row>
            <v-col cols="4"><b>Label</b></v-col>
            <v-col cols="4"><b>Item weight</b></v-col>
          </v-row>
          <v-row v-for="(item, index) in category.items" :key="index" justify="start">
            <v-col cols="4">
              {{ item.label }}
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="item.weight"
                type="number"
                style="width: 75px"
                density="compact"
              />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
        <v-expansion-panel-text v-else>
          <v-expansion-panels>
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
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <br />
                <v-row>
                  <v-col cols="4"><b>Label</b></v-col>
                  <v-col cols="4"><b>Item weight</b></v-col>
                </v-row>
                <v-row v-for="(value, index) of category2.items" :key="index" justify="start">
                  <v-col cols="4">
                    {{ value.label }}
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      v-model="value.weight"
                      type="number"
                      style="width: 75px"
                      density="compact"
                    />
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
