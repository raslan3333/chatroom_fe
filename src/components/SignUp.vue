<template>


  <form @submit.prevent="signup">
    <div class="flex flex-col ">
      <div class="h-screen flex justify-center items-center bg-blueGray-100">
        <div class="bg-white w-96 rounded-md shadow-sm p-3">
          <div class="flex flex-col place-content-between">
            <h2 class="flex justify-center items-center m-2 text-xl font-semibold">Login</h2>
            <div class="bg-red-100 border border-red-400 text-red-700 px-1 py-1 rounded relative" role="alert">
              <strong class="font-bold">Holy smokes!</strong>
              <span class=" sm:inline">Something seriously bad happened</span>
              <span class="absolute top-0 bottom-0 right-0 px-4 py-3"></span>
            </div>
            <div class="flex flex-col">
              <div>
                <label>
                  Username
                </label>
                <input v-model="username" type="text" name="username"
                       class="w-full h-10 border border-2 bg-gray-50-50 mt-1 outline-none rounded-md pl-3 mb-2"/>
              </div>
              <div>
                <label>
                  Password
                </label>
                <input v-model="password" type="password" name="password"
                       class="w-full h-10 border border-2 bg-gray-50-50 mt-1 outline-none rounded-md pl-3 mb-2"/>
              </div>
              <div>
                <label>
                  Confirm Password
                </label>
                <input type="password" name="confirm"
                       class="w-full h-10 border border-2 bg-gray-50-50 mt-1 outline-none rounded-md pl-3 mb-2"/>
              </div>
            </div>
            <button type="submit" class=" w-full h-10 shadow-sm bg-red-200 rounded-md cursor-pointer
                        flex pl-3 items-center justify-center mb-2 font-semibold"
            >SIGN UP
            </button>
            <button @click="login" class=" w-full h-10 shadow-sm bg-emerald-200 rounded-md cursor-pointer
                        flex pl-3 items-center justify-center mb-2 font-semibold"
            >login
            </button>
          </div>
        </div>


      </div>

    </div>
  </form>
</template>

<script>

import axios from 'axios';

export default {
  name: "SignUp",
  data() {
    return {
      username: "",
      password:"",
      token: "token"
    }
  },
  methods: {
    login(){
      this.$router.push("/login")
    },
    async signup() {
      await axios.post("http://localhost:8080/users/signup", {
        "username": this.username,
        "password": this.password
      }, {
        withCredentials: true
      }).then(value => console.log(value.data))
      await axios.post("http://localhost:8080/login", {
        "username": this.username,
        "password": this.password
      }, {
        withCredentials: true,
      }).then(value => {
        console.log(value.data)
        this.token= value.data["Authorization"]
        if (this.token !== ""){
          this.$store.dispatch("setToken", this.token)
          this.$store.dispatch("setIsLoggedIn", true)
          this.$router.push("/")
        }
      })

    }
  },

}
</script>

<style scoped>

</style>

