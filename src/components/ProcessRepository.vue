<script lang="ts">
  import { mapStores } from 'pinia'
  import { useConfig } from '../dataStore/config'
  import { useProcess } from '../dataStore/process'

  export default {
    name: 'ProcessRepository',
    data () {
      return {
        activePanel: [],
      }
    },
    computed: {
      ...mapStores(useProcess, useConfig),
    },
    watch: {
      activePanel (newValue, oldValue) {
        if (newValue == null) {
          this.configStore.setEditableProcess(-1)
        }
      },
    },
    methods: {
      addProcess () {
        this.processStore.addProcess()
      },
      editProcess (id) {
        if (id === this.configStore.editableProcess) {
          this.configStore.setEditableProcess(-1)
        } else {
          this.configStore.setEditableProcess(id)
        }
      },
      // deletionTriggered (index) {},
    },
  }
</script>

<template>
  <v-container fluid>
    <v-app-bar>
      <v-btn prepend-icon="mdi-plus-box" variant="outlined" @click="addProcess"> Add Process</v-btn>
    </v-app-bar>
    <v-expansion-panels v-model="activePanel">
      <v-expansion-panel v-for="process of processStore.processes" :key="process.id">
        <v-expansion-panel-title>
          <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start">
              <v-text-field
                v-model="process.label"
                :disabled="process.id != configStore.editableProcess || process.id != this.activePanel"
                density="compact"
                clearable
              />
            </v-col>
            <v-col
              cols="2"
              class="d-flex justify-center"
            >
              <v-col cols="6" class="d-flex justify-center" offset="1">ID: {{ process.id }}
              </v-col>
              <!--<v-col cols="6" class="d-flex justify-start">Optional attribute
              </v-col>-->
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <br />
          <v-row justify="end">
            <v-col cols="2">
              <v-btn
                icon
                variant="outlined"
                :color="process.id != configStore.editableProcess || process.id != this.activePanel? 'primary' : 'green'"
                @click="editProcess(process.id)"
              >
                <v-icon :icon="process.id != configStore.editableProcess || process.id != this.activePanel? 'mdi-pencil' : 'mdi-check'" />
                <div v-if="process.id != configStore.editableProcess || process.id != this.activePanel">Edit</div>
                <div v-else>Save</div>
              </v-btn>
            </v-col>
            <!--<v-col cols="2">
              <v-btn
                icon
                variant="outlined"
                color="red"
                @click="deletionTriggered(process.id)"
              >
                <v-icon>mdi-trash-can</v-icon>Delete
              </v-btn>
            </v-col>-->
          </v-row>
          <br />
          <v-row
            no-gutters
          >
            <v-col cols="3">Property 1</v-col>
            <v-col cols="3">
              <v-text-field
                v-model="process.properties.property1"
                :disabled="process.id != configStore.editableProcess || process.id != this.activePanel"
                type="number"
                style="width: 75px"
                density="compact"
              />
            </v-col>
            <v-col cols="3">Property 2</v-col>
            <v-col cols="3">
              <v-text-field
                v-model="process.properties.property2"
                :disabled="process.id != configStore.editableProcess || process.id != this.activePanel"
                density="compact"
              />
            </v-col>
            <v-col cols="3">Property 3</v-col>
            <v-col cols="3">
              <v-radio-group
                v-model="process.properties.property3"
                :disabled="process.id != configStore.editableProcess || process.id != this.activePanel"
                inline
              >
                <v-radio label="True" :value=true />
                <v-radio label="False" :value=false />
              </v-radio-group>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
