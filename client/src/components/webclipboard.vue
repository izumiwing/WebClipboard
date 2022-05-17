<template>
  <div class="clipboardOuter">
    <div class="clipboard">
      <textarea class="cb_text" :readonly="wsConnected ? false : 'readonly'" v-model=clipObject.clipText @keyup="clipChange($event)"></textarea>
    </div>
    <div class="weboard">
      <div class="connect">
        <div class="connIn">
          <input class="conn" v-model=clipObject.wsss placeholder="A secret is required." />
          <div class="btn_connect">
            <a class="desc">Connect</a>
            <svg-icon class="icon_connect" type="mdi" :path="icon_conn" @click="connectWeboard(this.WeBoardUri)"></svg-icon>
          </div>
        </div>
        <div class="conn_status">{{ wsStatus }}</div>
      </div>
      <div class="icon_g">
        <div class="icon">
          <svg-icon class="icon_large" type="mdi" :path="icon_copy" @click="copyToClipboard()"></svg-icon>
        </div>
        <div class="icon">
          <svg-icon class="icon_large" type="mdi" :path="icon_paste" @click="getClipboardContents()"></svg-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiContentCopy,mdiContentPaste,mdiConnection } from '@mdi/js'

export default {
  name: 'WebClipboard',
  data(){
    return{

      WeBoardUri:'',
      websock:null,
      clipObject:{
        clipText:'WeBoard 使用说明 \n\n 此处内容将时刻与任何打开该页面并输入同一暗号的设备同步，可以在下方相应位置填入暗号后在此处做出些修改并在另台设备打开同样页面输入同样暗号看看效果。 \n\n 工具repo:https://github.com/izumiwing/WebClipboard  \n 希望这个工具能 Save your day :)',
        wsid:'',
        wsss:''
      },

      wsConnected:false,
      wsStatus:'Disconnected',

      icon_copy: mdiContentCopy,
      icon_paste: mdiContentPaste,
      icon_conn: mdiConnection,

    }
  },
  components: {
    SvgIcon
  },
  mounted(){
    axios.post('./clip/get',{})
    .then((res)=> {
      this.WeBoardUri = res.data.weboarduri
      this.clipObject.wsid = res.data.wsid
    })
    .catch((err)=> {
      console.log(err)
    })
  },
  methods:{
    getWsUri(){
      axios.post('./clip/get',{})
      .then((res)=> {
        this.wsConnected = false
        this.WeBoardUri = res.data.weboarduri
        this.clipObject.wsid = res.data.wsid
        this.connectWeboard()
      })
      .catch((err)=> {
        console.log(err)
      })
    },

    initWeboard(){
      var wsuri = this.WeBoardUri
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.onmessage;
      this.websock.onopen = this.onopen;
      this.websock.onerror = this.onerror;
      this.websock.onclose = this.onclose;
    },

    connectWeboard(){
      if(this.wsConnected){
        this.getWsUri();
        return
      }
      this.clipObject.clipText = ''
      this.statusChange('Connecting...')
      axios.post('./clip/set',{wsId: this.clipObject.wsid,wsss: this.clipObject.wsss})
      .then((res)=> {
        if(res.data.wsStatus == 'OK'){
          this.initWeboard(this.WeBoardUri)
          this.statusChange('Opening socket...')
        }else{
          this.statusChange('Error')
        }
      })
      .catch((err)=> {
        console.log(err)
      })
    },

    onopen(){
      console.log('connected to :{0}'.format(this.WeBoardUri))
      this.wsConnected = true;
    },

    onmessage(e){
      this.clipObject.clipText = e.data
      this.statusChange('Established received length:{0}'.format(e.data.length))
      //console.log('on message:' + this.clipObject.clipText)
    },

    onerror(e){
      console.log(e)
    },

    onclose(){
      this.statusChange('Disconnected')
      console.log('bye!')
    },

    clipChange(e){
      if(e.keyCode >= 16 && e.keyCode <= 20){
        return
      }else{
        this.websock.send(JSON.stringify(this.clipObject))
        this.statusChange('Message sent length:{0}'.format(this.clipObject.clipText.length))
      }
    },

    statusChange(statusStr){
      this.wsStatus = statusStr
    },

    async getClipboardContents() {
      try {
        const text = await navigator.clipboard.readText();
        if(this.wsConnected){
          this.clipObject.clipText = text
        }
        //console.log('Pasted content: ', text);
      } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
      }
    },

    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.clipObject.clipText);
        //console.log('Page URL copied to clipboard');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    },

    _debug(){
      console.log('triggered!')
    }
  }
}

String.prototype.format = function () {
  if (arguments.length == 0){
      return this;
  }

  for (var result = this, i = 0; i < arguments.length; i++){
      result = result.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
      return result;
  }
};
</script>

<style>
.clipboardOuter{

}
.clipboard{
  width:100%;
  height:70%;
  line-height:0;
  overflow:hidden;
  background-color:#F7F7F7;
}
.cb_text{
  width:96%;
  height:96%;
  outline:none;
  background-color:#F7F7F7;
  border:0;
  padding:2% 2% 0 2%;
  resize:none;
  font-size:18px;
  word-break:break-all;
  line-height:normal;
}
.weboard{
  width:100%;
  height:30%;
  background-color:#F7F7F7;
}
.icon{
  width:128px;
  margin:48px 12px 0 12px;
}
.icon_g{
  display:flex;
  flex-direction:row;
  justify-content:center;
  align-items:center;
  height:100%;
  background-color:#F7F7F7;
}
.connect{
  width:100%;
  background-color:#F7F7F7;
  border-top:1px solid #DDD;
  display:flex;
  position:absolute;
  border-bottom:1px solid #DDD;
}
.conn{
  border:none;
  width:200px;
  background-color:#F7F7F7;
  outline:none;
  text-align:left;
  padding:0 2%;
  height:48px;
  display:inline-block;
}
.icon_connect{
  width:24px;
  height:24px;
  padding:12px;
}
.conn_status{
  text-align:center;
  line-height:48px;
  height:48px;
  width:50%;
}
.icon_large{
  width:48px;
  height:48px;
  padding:32px;
  border-radius:50%;
  background-color:#FFF;
  transition:background-color 0.1s ease-in-out
}
.icon_large:hover{
  background-color:#D7D7D7;
}
.icon_large:active{
  background-color:#E7E7E7;
}
.connIn{
  display:flex;
  flex-direction:row;
  width:50%;
}
.icon_connect:hover{
  border:1px solid #F7F7F7;
  border-radius:50%;
  background-color:#FFF;
  padding:11px;
}
.desc{
  display:none;
}
.btn_connect:hover .desc{
  position:absolute;
  margin-top:-31px;
  background-color:#8785a2;
  color:#FFF;
  padding:6px 12px;
  border-radius:5px;
  display:block;
  z-index:99;
}

</style>
