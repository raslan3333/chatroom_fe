<template>
  <form @submit.prevent="signIn">
    <div class="h-screen flex justify-center items-center bg-blueGray-100">
      <div class=" bg-white h-96 w-96 rounded-md shadow-sm p-3">
        <div class="flex flex-col place-content-between h-full h-4/5 ">
          <h2 class="flex justify-center items-center m-2 text-xl font-semibold">Login</h2>
          <div class="flex flex-col ">
            <input  v-model="data.username" type="text" name="username" class="w-full h-10 border border-2 bg-gray-50-50 mt-3 outline-none rounded-md pl-3 mb-2"/>
            <input v-model="data.password" type="password" name="password" class="w-full h-10 border border-2 bg-gray-50-50 mt-3 outline-none rounded-md pl-3 mb-2"/>
          </div>
          <button type="submit" class=" w-full h-10 shadow-sm bg-emerald-200 rounded-md cursor-pointer
                        flex pl-3 items-center justify-center mb-2 font-semibold"
          >LOGIN
          </button>
          <button @click="signUp"  class=" w-full h-10 shadow-sm bg-red-200 rounded-md cursor-pointer
                        flex pl-3 items-center justify-center mb-2 font-semibold"
          >SIGN UP
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>

import axios from 'axios';
import {mapActions, mapGetters} from "vuex/dist/vuex.mjs";



export default {
  name: "Login",
  data() {
    return{
      data:{username: "", password: ""},
      token: "",

    }
  },
  methods: {
    ...mapActions([
      'setRooms',
      'login'
    ]),
     async signIn(){
      await this.login(this.data);
      if (this.$store.getters.getIsLoggedIn) await this.$router.push("/")
    },
     signUp(){
        this.$router.push("/signup")
    }
  },
  computed:{
    ...mapGetters(["getRooms"]),
  }


}
</script>

<style scoped>

</style>