<template class="">
  <div class="h-screen flex flex-col bg-blueGray-100 overflow-clip">
    <div class="">
      <div class="bg-white shadow-md h-12">
        <div class="container mx-auto ">
          <div class="flex text-rose-600">
            <div class="flex h-12 font-semibold font-mono items-center ml-5 w-1/6">
              ChatStreet
            </div>
            <div class="flex-grow h-12 flex justify-center items-center">
            </div>
            <div  class="flex text-white cursor-pointer h-12 justify-center items-center font-semibold font-mono mr-5 w-1/6">
              <div class="flex bg-rose-500 h-4/5 w-40 rounded-md justify-center items-center" @click="logout">
                logout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="h-0.5 bg-rose-600"></div>
    <div class="flex h-5/6 container mx-auto m-2">
      <!--SideBar-->
      <aside id="sidebar" class="bg-white p-2 ml-2 shadow-sm rounded-lg w-1/5 max-w-sm ">
        <section class="h-1/2 overflow-scroll" >
          <div :class="room.style" class="w-11/12 h-10 shadow-sm
      rounded-md cursor-pointer flex pl-3 items-center mb-2" @click="select(room.id)" v-for="room in rooms" :key="room.id">{{room.roomName}}</div>
        </section>

        <hr class="mt-10">
        <input @keyup.enter="addRoom" v-model="newRoom" class="w-full h-10 border border-2 bg-gray-50 mt-3 outline-none rounded-md flex pl-3 items-center mb-2"/>
        <button @click="addRoom"  class="w-full text-blueGray-900 font-semibold h-10 shadow-sm bg-blueGray-300 rounded-md cursor-pointer flex pl-3 items-center justify-center mb-2">New Room</button>
      </aside>
      <div class="flex-grow  bg-white p-2 ml-2 shadow-sm rounded-lg max-w-3xl ">
        <section class="flex flex-grow-0 h-5/6 bg-blueGray-100 overflow-scroll flex-col">
          <div class="mb-3 p-3 ">
            <div v-for="message in messages">
                <div  class="w-full p-2 bg-white rounded-xl cursor-pointer grid grid-cols-12 pl-1  mb-2">
                  <div class="h-8 flex items-center justify-center mr-4 col-start-auto col-span-2 px-9 border border-blueGray-300 text-blueGray-900 rounded-full">
                    {{message.userEntity.username}}
                  </div>
                  <div class="col-start-3 col-span-10">
                    {{message.content}}
                  </div>

                </div>
            </div>
          </div>
        </section>
        <div class="flex w-5/4 bg-blueGray-200 h-10 m-4 rounded-md">
          <input @keyup.enter="send" type="text" v-model="msg"
                 class="bg-blueGray-200 rounded-md outline-none px-4 flex-grow h-full">
          <button class="ml-1 px-5 outline-none" @click="send">send</button>
        </div>
      </div>
    </div>

  </div>

</template>

<script>

import '../sockjs.min.js';
import Stomp from "webstomp-client";
import axios from "axios";
import {mapGetters, mapActions} from 'vuex'

export default  {
  name: "Home",

  data (){
    return {
      user: "",
      test: "test",
      stompClient: null,
      socket: null,
      msg: "",
      connected: false,
      newRoom:"",
      roomStyle:[],
      messages:{},
      rooms: {},
      roomId: 0,
      userId: 0,
    }
  },
  methods: {
    ...mapActions(['setRooms', "setMessages"]),
    async addRoom(){
      await axios.post('http://localhost:8080/newroom',{
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
    },
    async select(id){

      const data =await axios.get("http://localhost:8080/getMessages/"+id,
          {
            headers: {
              Authorization: this.$store.getters.getToken
            }
          }
      ).then(value => value.data)
      this.messages = await data
      await this.setMessages(this.messages)
      this.getRooms.map(value => {
        value.style= "bg-blueGray-100"
        if (value.id === id){
          this.roomId= id
          value.style = "bg-blueGray-700 text-white";
          value.selected= true;
        }
      })
    },
    getAllRooms(){
      this.getRooms.map(value => {
        value.style= "bg-blueGray-100";
        value.selected= false;
      })
      this.rooms= this.getRooms
    },
    async logout(){
      await axios.post("http://localhost:8080/logout" )
      await this.$store.dispatch("setIsLoggedIn", false)
      await this.$store.dispatch("setToken", "")
      await this.$router.push("/login")

    },

    send(){
      if (this.stompClient&& this.stompClient.connected && this.msg) {
        const message = {
          content: this.msg,
          roomId: this.roomId,
          userId: this.userId,

        };
        this.stompClient.send("/app/chatroom", JSON.stringify(message), {});
        this.msg="";
      }
    },
    async connect() {
      await this.setRooms()
      await this.getAllRooms();
      await axios.get("http://localhost:8080/users",
          {
            headers: {
              'Authorization': this.$store.getters.getToken
            }
          }
      ).then(value => this.userId=value.data.id)
      this.socket =  SockJS('http://localhost:8080/ws-endpoint');
       this.stompClient = Stomp.over(this.socket);
       this.stompClient.connect(
          {},
          frame => {
            this.connected = true;
            this.stompClient.subscribe("/topic/messages", tick => {
               this.messages.push(JSON.parse(tick.body));
            });
          },
          error => {
            console.log(error);
            this.connected = false;
          }
      );
    }
  },
  computed: {
    ...mapGetters(['getRooms', 'getToken', 'getMessages']),
  },
   created() {
  },
  mounted() {
    this.messages = this.getMessages
    this.connect();
  }
}



</script>

<style scoped>

</style>
