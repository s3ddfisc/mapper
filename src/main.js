/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Plugins
import { registerPlugins } from '@/plugins'
import vuetify from './plugins/vuetify'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

registerPlugins(app)

app.use(vuetify)
app.use(pinia)
app.mount('#app')
