import { createApp } from 'vue'
import App from './App.vue'
import './firebase' 
import store from './store'

createApp(App).use(store).mount('#app')
