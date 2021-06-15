import { createRouter, createWebHistory } from 'vue-router'
import Home from '/src/components/Home.vue'
import Login from '/src/components/Login.vue'
import SignUp from "/src/components/SignUp.vue";
import store from "./store.js"

const routes = [


    {
        path: '/',
        name: 'Home',
        component: Home,
        beforeEnter: (to, from, next) => {
            if (store.getters.getIsLoggedIn) {
                console.log("hello")
                console.log(store.getters.getRooms)
                console.log("hello")
                next()
            } else {
                next("/login")
            }
        }
    },
    {
        path: '/error',
        name: 'Error',
        component: Error,
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp,
        beforeEnter: (to, from, next) => {
            if (!store.getters.getIsLoggedIn) {
                next()
            } else {
                next("/")
            }
        }
    },
    {
    path: '/login',
    name: 'Login',
    component: Login,
        beforeEnter: (to, from, next) => {
            if (!store.getters.getIsLoggedIn) {
                next()
            } else {
                next("/")
            }
        }
    },
    {
    path: '/:pathMatch(.*)*',
    component: Home,
    beforeEnter: (to, from, next) => {
            if (store.getters.getIsLoggedIn) {
                next()
            } else {
                next("/login")
            }
        }
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})
export default router