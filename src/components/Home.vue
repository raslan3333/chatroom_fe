<template >
<div class="h-screen flex flex-col bg-blueGray-100">
  <div class=" bg-rose-400 shadow-md h-12">
    <div class="container mx-auto ">
      <div class=" flex text-black">
        <div class="flex h-12 font-semibold font-mono items-center ml-5 w-1/6">
          Chat <span class="text-white">Street</span>
        </div>
        <div class="flex-grow h-12 flex justify-center items-center">

        </div>
        <div class="flex h-12 justify-end items-center font-semibold font-mono mr-5 w-1/6">
          Login
        </div>
      </div>

    </div>
  </div>
  <div class="flex flex-grow container mx-auto m-2">
    <SideBar />
    <div class="flex-grow bg-white p-2 ml-2 shadow-sm rounded-lg max-w-3xl">
      <section class="flex h-full flex-col">
        <div class="flex-grow bg-blueGray-100 rounded-md mb-3 p-3">
          <div>{{m}}</div>
          <div v-for="message in messages">
            <div class="w-full h-10 bg-white rounded-sm cursor-pointer flex pl-3 items-center mb-2">{{message}}</div>
          </div>
        </div>
        <div class="flex w-full bg-blueGray-200 h-10 rounded-md">
          <input @keyup.enter="send" type="text" v-model="msg" class="bg-blueGray-200 rounded-md outline-none px-4 flex-grow h-full">
          <button class="ml-1 px-5 outline-none" @click="send" >send</button>
        </div>
      </section>
    </div>

  </div>
</div>

</template>

<script >
import SideBar from './SideBar.vue';
import '../sockjs.min.js';
import Stomp from "webstomp-client";



export default  {
  name: "Home",
  components: {
    SideBar,
  },
  data (){
    return {
      stompClient: null,
      socket: null,
      messages: [],
      msg: "",
      connected: false,
    }
  },
  methods: {
    send(){
      if (this.stompClient&& this.stompClient.connected && this.msg) {
        const message = { content: this.msg };

        this.stompClient.send("/app/chatroom", JSON.stringify(message), {});
        this.msg="";
      }
    },
    connect() {
       this.socket =  SockJS('http://localhost:8080/ws-endpoint');
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect(
          {},
          frame => {
            this.connected = true;
            console.log(frame);
            this.stompClient.subscribe("/topic/messages", tick => {
              console.log(tick);
              this.messages.push(JSON.parse(tick.body).content);
            });
          },
          error => {
            console.log(error);
            this.connected = false;
          }
      );
    }

  },
  mounted() {
    this.connect();
  }
}


</script>

<style scoped>

</style>
