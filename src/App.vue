<template >
    <router-view class="sm:block hidden"></router-view>
<!--  <MobileHome class="sm:hidden block"/>-->
</template>

<script >
import MobileHome from './components/MobileHome.vue'
import Login from './components/Login.vue'
export default {
  name: "App",
  components: {
    MobileHome
  }
}

</script>

<style>

</style>
