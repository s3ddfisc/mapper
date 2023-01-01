<script lang="ts">
  import { mapStores } from 'pinia'
  import { useGlobal } from '../dataStore/global'

  export default {
    name: 'Categories',
    data () {
      return {
        activePanel: [],
      }
    },
    computed: {
      ...mapStores(useGlobal),
    },
  }
</script>

<template>
  <v-expansion-panels v-model="activePanel">
      <v-expansion-panel v-for="category of globalStore.categories" :key="category.id">
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
        <v-expansion-panel-text>
          <br />
          <v-row>
            <v-col cols="4"><b>Label</b></v-col>
            <v-col cols="4"><b>Item weight</b></v-col>
          </v-row>
          <v-row v-for="item of category.items" :key="item.label" justify="start">
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
      </v-expansion-panel>
    </v-expansion-panels>
</template>
