import { createStore } from 'vuex'
import axios from "axios";
import createPersistedState from "vuex-persistedstate";
import * as Cookies from 'js-cookie'

export default createStore({
    state: {
        isLoggedIn: false,
        username: "",
        password: "",
        token: "",
        rooms: {},
        currentRoom:0,
        messages: {}
    },
    mutations: {
        setToken(state, payload){
            state.token= payload;

        },
        setRooms(state, payload){
            state.rooms= payload;
        },
        setMessages(state, payload){
            state.messages= payload;
        },
        setIsLoggedIn(state, payload){
            state.isLoggedIn= payload;
        },
         setCurrentRoom(state, payload){
             state.currentRoom= payload;
        },

    },
    actions: {
        async login(state, payload){
            state.username=payload.username,
            state.password= payload.password
            await axios.post("http://localhost:8080/login", {
                "username": state.username,
                "password": state.password
            }, {
                withCredentials: true
            }).then(value => {
                state.dispatch("setToken", value.data["Authorization"])
                state.dispatch("setRooms")
                if ( value.data["Authorization"]) state.dispatch("setIsLoggedIn", true)
            });
        },
        async setToken(state, payload){
            state.commit("setToken", payload)
        },
        async setRooms(state){
            const data = await axios.get("http://localhost:8080/getRooms",
                {
                    headers: {
                        'Authorization': state.token
                    }
                }
            )
            const r= await data.data;
            await state.commit("setRooms", r)
        },
        async setMessages(state, payload){
            await state.commit("setMessages", payload)
        },
        async setCurrentRoom(state, payload){
            await state.commit("setCurrentRoom", payload)
        },
        async setIsLoggedIn(state, payload){
            state.commit("setIsLoggedIn", payload)
        },

    },
    modules: {
    },
    getters:{
        getToken: state => state.token,
        getRooms: state => state.rooms,
        getMessages: state => state.messages,
        getCurrentRoom: state => state.currentRoom,
        getIsLoggedIn: state => state.isLoggedIn
    },
    plugins: [
        createPersistedState({
            getState: (key) => Cookies.getJSON(key),
            setState: (key, state) => Cookies.set(key, state, { expires: 1000, secure: true })
        })
    ]
})