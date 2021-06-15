<template>
  <div class="relative inline-block text-left">
    <div>
      <button @click="dropMenu" type="button" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="menu-button" aria-expanded="true" aria-haspopup="true">
        {{option}}
        <!-- Heroicon name: solid/chevron-down -->
        <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    <!--
      Dropdown menu, show/hide based on menu state.

      Entering: "transition ease-out duration-100"
        From: "transform opacity-0 scale-95"
        To: "transform opacity-100 scale-100"
      Leaving: "transition ease-in duration-75"
        From: "transform opacity-100 scale-100"
        To: "transform opacity-0 scale-95"
    -->
    <div :class="myclass" class="mt-2
      shadow-lg bg-white focus:outline-none"
         role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
      <div class="py-1" role="none">
        <aside id="sidebar" class="bg-white m-3 p-2  shadow-sm rounded-lg ">
          <section class=" " >
            <input v-model="newRoom" @keyup.enter="addRoom"
                   class="w-full h-10 border border-2 bg-gray-50 mt-3 outline-none rounded-md flex pl-3 items-center mb-2"/>
            <button @click="addRoom"
                    class="w-full text-blueGray-900 font-semibold h-10 shadow-sm bg-blueGray-300 rounded-md cursor-pointer
                   flex pl-3 items-center justify-center">New Room</button>
            <hr class="m-1">
            <div @click="clicked($event)" :class="room.style" class="h-10 shadow-sm
      rounded-md cursor-pointer flex pl-3 items-center mb-2"  v-for="room in rooms" :key="room.id">{{room.roomName}}</div>
          </section>
        </aside>
        <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import {mapGetters, mapActions} from 'vuex'
export default {
name: "DropDown",

  data(){
    return {
      newRoom:"",
      roomStyle:[],
      messages:[],
      rooms: [],
      roomId: 0,

    isActive: true,
    option: 'Room1',
    myclass: 'transition ease-in duration-75 transform opacity-0 scale-95'
  }
  },
  methods: {
    ...mapActions(['setRooms', "setMessages"]),
    async addRoom(){
      if (this.newRoom!==""){
        await axios.post('/newroom',{
          roomName: this.newRoom
        }, {
          headers: {
            Authorization: this.$store.getters.getToken
          }
        }).catch(error => {
          console.log(error.response)
        })
        await this.setRooms()
        await this.getAllRooms()
        this.newRoom="";
      }

    },
    getAllRooms(){
      this.getRooms.map(value => {
        value.style= "bg-blueGray-100";
        value.selected= false;
      })
      this.rooms= this.getRooms
    },
    dropMenu(){
      if (this.isActive) {
        this.myclass = "transition ease-out duration-100 transform opacity-100 scale-100"
        this.isActive= !this.isActive
      } else {
        this.myclass = "transition ease-in duration-75 transform opacity-0 scale-95"
        this.isActive= !this.isActive
      }
    },
    clicked(e){
      e.preventDefault()
      this.option = e.target.innerText;
      this.myclass+=" hidden ";
      this.dropMenu()
      console.log(e.target.innerText)
    }
  },
  computed: {
    ...mapGetters(['getRooms', 'getToken', 'getMessages']),
  },
  mounted() {
    this.getAllRooms()
  }
}
</script>

<style scoped>

</style>