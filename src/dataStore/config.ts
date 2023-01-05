import { defineStore } from 'pinia'

export const useConfig = defineStore('config', {
  state: () => {
    return {
      activeTab: 'UseCaseManager',
      useCaseEditMode: false,
      useCaseForm: false,
      editableProcess: 1,
    }
  },

  actions: {
    setActiveTab (tab) {
      this.activeTab = tab
    },
    setUseCaseEditMode () {
      this.useCaseEditMode = !this.useCaseEditMode
    },
    setUseCaseForm (isActive) {
      this.useCaseForm = isActive
    },
    setEditableProcess (id) {
      this.editableProcess = id
    },
  },
})
