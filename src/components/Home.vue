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
    <aside id="sidebar" class="flex-none bg-white p-4 ml-2 shadow-sm rounded-lg w-1/5 max-w-sm">
      <section class="">Room1</section>
    </aside>
    <div id="sidebar" class="flex-grow bg-white p-2 ml-2 shadow-sm rounded-lg max-w-3xl">
      <section class="flex h-full flex-col">
        <div class="flex-grow bg-blueGray-100 rounded-md mb-3 p-3">
          msgs
        </div>
        <div class="flex w-full bg-blueGray-200 h-10 rounded-md">
          <input type="text" class="bg-blueGray-200 rounded-md outline-none px-4 flex-grow h-full">
          <button class="ml-1 px-5 outline-none">send</button>
        </div>
      </section>
    </div>

  </div>
</div>

</template>

<script setup>
import { defineProps, reactive } from 'vue'

defineProps({
  msg: String
})

const state = reactive({ count: 0 })
</script>

<style scoped>

</style>
