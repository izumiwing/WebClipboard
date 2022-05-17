<template>
    <div class="layer">
      <div class="tips">
        <h1>WeBoard</h1>
        <p>是否常常因为自己设备之间兼容不能的问题感到烦躁？使用WeBoard就能解决这个问题！它是由Web + Clipboard 二词构成，你可以直接输入你的密码生成一个共享剪辑板<br> 它的工作原理十分简单，你输入的东西将由你的浏览器递至后台的一个变量，一旦变量发生改变，它将广播给所有使用同一个密码的剪辑板。这个过程我们并不会实际储存你的数据，事实上会话结束后，我们后端将自动删除这个变量，以至可以承载更多用户，当然你也可以自己部署一个。你可以在相应的位置输入随便一个密码，之后点击"连接"按钮。在下方复制和粘贴的图标可以随意使用，然后尝试使用2台设备对剪辑板进行更改，你会发现剪辑板的内容永远是同步的（不排除网络原因）
        
        <br><br>（点击或触摸高亮处关闭）</p>
      </div>
    </div>
</template>

<script>

export default {
  name: 'WeBoardSetup',
  components: {
  },
  mounted(){

  }
}
</script>

<style scoped>
html,body{
  width:100%;
  height:100%;
  margin:0;
  padding:0;
}
.layer{
    position:fixed;
    width:100%;
    height:100%;
    background-color:rgba(0,0,0,0.3);
    z-index:999;
    display:flex;
    align-items:center;
    justify-content:center;
}
.tips{
  width:80%;
  height:80%;
  background-color:#FFF;
  overflow-y:scroll;
}
p{
  padding:8px;
  word-wrap:break-word;
  text-align:left;
}
</style>
