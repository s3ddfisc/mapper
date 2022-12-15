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

// Plugins
import { registerPlugins } from '@/plugins'
import vuetify from './plugins/vuetify'

const pinia = createPinia()
const app = createApp(App)

registerPlugins(app)

app.use(vuetify)
app.use(pinia)
app.mount('#app')
