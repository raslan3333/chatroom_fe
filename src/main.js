import { createApp } from 'vue'
import './index.css'
import router from "./router"
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'
import App from './App.vue'

createApp(App).use(router,VueAxios, axios).use(store).mount('#app')




