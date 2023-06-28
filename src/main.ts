import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registerStore } from './stores'

const app = createApp(App)

app.use(registerStore)
app.use(router)

app.mount('#app')
