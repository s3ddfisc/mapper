<script lang="ts">
  import { mapStores } from 'pinia'
  import { useGlobal } from '../dataStore/global'
  import { toRaw } from 'vue'

  export default {
    name: 'Weighting',
    data () {
      return {
        tickLabels: {
          0: 'absolutely dominating',
          4: 'significantly higher',
          8: 'equal',
          12: 'significantly higher',
          16: 'absolutely dominating',
        },
        categoryPairs: [],
        pairWeighting: [],
      }
    },
    watch: {
      categoryPairs: {
        handler () {
          this.pairWeighting.splice(0)
          this.categoryPairs.forEach(pair => {
            if (pair.importance === 8) {
              this.pairWeighting.push([
                pair.category1,
                pair.category2,
                1,
              ])
            } else if (pair.importance < 8) {
              this.pairWeighting.push([
                pair.category1,
                pair.category2,
                9 - pair.importance,
              ])
            } else {
              this.pairWeighting.push([
                pair.category1,
                pair.category2,
                1 / (pair.importance - 7),
              ])
            }
          })
          this.globalStore.updateWeights(toRaw(this.pairWeighting))
        },
        deep: true,
      },
    },
    mounted () {
      for (let i = 0; i < this.globalStore.categories.length; i++) {
        for (let j = i + 1; j < this.globalStore.categories.length; j++) {
          this.categoryPairs.push({
            category1: this.globalStore.categories[i].label,
            category2: this.globalStore.categories[j].label,
            importance: 8,
          })
        }
      }
    },
    computed: {
      ...mapStores(useGlobal),
    },
  }
</script>

<template>
  <v-card>
    <div class="text-caption">Assess the relative importance of each category pair</div>
    <div v-for="(value, index) in categoryPairs" :key="index">
      <v-slider
        v-model="value.importance"
        :ticks="tickLabels"
        :max="16"
        step="1"
        show-ticks="always"
        tick-size="4"
        >
        <template v-slot:prepend>
          <label>{{value.category1}}</label>
        </template>
        <template v-slot:append>
          <label>{{value.category2}}</label>
        </template>
      </v-slider>
    </div>
  </v-card>
</template>
