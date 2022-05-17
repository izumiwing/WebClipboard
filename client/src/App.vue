<template>
  <web-clipboard class="container" />
</template>

<script>
import WebClipboard from './components/webclipboard.vue'

export default {
  name: 'App',
  components: {
    WebClipboard
  },
  mounted(){

  }
}
</script>

<style>
html,body{
  width:100%;
  height:100%;
  margin:0;
  padding:0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width:100%;
  height:100%;
}
.container{
  width:100%;
  height:100%;
}
</style>
