import { createApp } from 'vue'
import App from './App.vue'
import './firebase' 
import store from './store'
import './assets/tailwind.css'

createApp(App).use(store).mount('#app')
