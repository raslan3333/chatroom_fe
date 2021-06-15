import { createApp } from 'vue'
import './index.css'
import router from "./router"
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'
import App from './App.vue'

axios.defaults.baseURL = 'http://localhost:9090'
createApp(App).use(router,VueAxios, axios).use(store).mount('#app')


