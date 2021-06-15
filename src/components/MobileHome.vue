<template>
<div class="container h-screen grid grid-flow-col grid-cols-1 grid-rows-6 bg-blueGray-100">
  <div class="row-span-1">
    <div class="flex p-1 items-center justify-between h-14 bg-white shadow-md">
      <div class="flex text-rose-600">
        <div class="flex font-semibold font-mono items-center w-1/6">
          ChatStreet
        </div>
      </div>
      <div class="flex font-mono font-semibold text-white h-full bg-rose-500 w-20 rounded-md justify-center items-center" @click="logout">
        logout
      </div>
    </div>
          <div class="h-0.5 bg-rose-600 mb-0.5"></div>

    <DropDown class="w-full"/>
  </div>


    <div class="bg-white h-full flex flex-col row-span-5 p-1 shadow-sm rounded-lg">
      <section class="flex flex-grow bg-blueGray-100 overflow-scroll flex-col">
        <div class="mb-3 p-3 ">
          <div v-for="message in messages">
            <div  class="w-full p-2 bg-white rounded-xl cursor-pointer grid grid-cols-12 pl-1 mb-2">
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
      <div class="flex w-5/4 bg-blueGray-200 m-2 rounded-md">
        <input @keyup.enter="send" type="text" v-model="msg"
               class="bg-blueGray-200 h-12 rounded-md outline-none px-3 flex-grow ">
        <button class="ml-1 px-5 outline-none" @click="send">send</button>
      </div>
    </div>

  </div>
</template>

<script>
import DropDown from './DropDown.vue'
import '../sockjs.min.js';
import Stomp from "webstomp-client";
import axios from "axios";
import {mapGetters, mapActions} from 'vuex'


export default  {
  name: "MobileHome",
  components: {
    DropDown
  },
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
    },
    async select(id){
      const data =await axios.get("/getMessages/"+id,
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
      await axios.post("/logout" )
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
      await axios.get("/users",
          {
            headers: {
              'Authorization': this.$store.getters.getToken
            }
          }
      ).then(value => this.userId=value.data.id)
      this.socket =  SockJS(axios.defaults.baseURL+'/ws-endpoint');
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