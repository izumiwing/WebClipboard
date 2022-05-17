var express = require('express');
var router = express.Router();
var expressWs = require('express-ws');

expressWs(router)

//wsIdTransfer_struc = {
//	'USER CUSTOMIZED SHARED KEY':{
//		content:'WILL AUTOMATIC BROADCASTED IN MEMBERS ARRAY BELOW',
//		members:[
//			{
//				wsid:'wsIdHash 1',
//				ws:'[WebSocket Object]'
//			}
//	},
//}

wsIdTransfer = {
	'sharedsecret1':{
		content:'',
		members:[]
	},
}

//wsIdHash_struc = {
//	'RANDOM HASH 1':'USER CUSTOMIZED SHARED KEY',
//	'RANDOM HASH 2':''
//}

wsIdHash = {
	'testuri1':'',
	'testuri2':''
}

wsValidSession = {}

wsMsgOk = JSON.stringify({wsStatus:'OK'})
wsMsgSecretInvalid = JSON.stringify({wsStatus:'ERR',wsHint:'Your secret is not valid! Please use another one.'})
wsMsgSocketUsed = JSON.stringify({wsStatus:'ERR',wsHint:'Socket already in use please refresh this page.'})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/get', function(req, res, next) {
	uuid = getValidId()
	wsIdHash[uuid] = undefined
	
	wsuri = 'ws://localhost:3000/clip/ws/{0}'.format(uuid)
	//wsuri = 'wss://cp.yui-h.com/clip/ws/{0}'.format(uuid)
	
	console.log('GENERATED A new Socket URI' + wsuri + '.')
	res.end(JSON.stringify( {weboarduri:wsuri ,wsid:'{0}'.format(uuid)}) )
});

router.post('/set', function(req, res, next) {
  wsss = 'key_' + String(req.body.wsss)
  
  	if(typeof(wsValidSession[req.body.wsId]) != 'undefined'){
		res.end(wsMsgSocketUsed)
		return;
	}
	
	if (wsss.length < 65531 && wsss.length >4) {
		if(typeof(wsIdTransfer[wsss]) == 'undefined'){
			wsIdTransfer[wsss] = {
				content:'',
				members:[]
			}
		}
		console.log('RELATIONSHIP :' + req.body.wsId + ' - ' + wsss + ' created.')
		wsIdHash[req.body.wsId] = wsss
		wsValidSession[req.body.wsId] = true
		res.end(wsMsgOk)
	}else{
		res.end(wsMsgSecretInvalid)
	}

});

router.ws('/ws/:wsId', function(ws, req){
	
	try{
		wsid = String(req.params.wsId)
		
	if(typeof(wsIdHash[wsid]) == 'undefined'){
		console.log('Illegal WebSocket : variable wsss is not given.')
		ws.close()
		return;
	}

	if(!wsValidSession[wsid]){
		console.log('Illegal WebSocket : socket already used.')
		ws.close()
		return;
	}
	
	console.log('SOCKET :{0} is activated.'.format(req.params.wsId))
	wsValidSession[wsid] = false
	
	wsIdTransfer[wsIdHash[req.params.wsId]].members.push({wsid:req.params.wsId,ws:ws})
	ws.send(wsIdTransfer[wsIdHash[req.params.wsId]].content)
	
	ws.on('message',(msg)=>{
		obj = eval( '(' +msg + ')' )
		//console.log(obj)
		wsIdTransfer[wsIdHash[obj.wsid]].content = obj.clipText
		wsIdTransfer[wsIdHash[obj.wsid]].members.forEach((wsObj,index) => {
			if(typeof(wsObj) != 'undefined'){
				if(wsObj.wsid != obj.wsid){
					if(wsObj.ws._readyState != 3){
						wsObj.ws.send(wsIdTransfer[wsIdHash[obj.wsid]].content)
					}else{
						wsIdTransfer[wsIdHash[obj.wsid]].members.splice(index,1)
					}
				}
			}
		})
		//console.log(wsIdTransfer[wsIdHash[obj.wsid]])
	})
	
	}catch(err){console.log(err)}
});

String.prototype.format = function () {
  if (arguments.length == 0){
      return this;
  }

  for (var result = this, i = 0; i < arguments.length; i++){
      result = result.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
      return result;
  }
};

function getUuidCode(){
	var len=32;
	var radix=16;
	var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var uuid=[],i;
	radix=radix||chars.length;
	if(len){
		for(i=0;i<len;i++)
		uuid[i]=chars[0|Math.random()*radix];
	}else{
		var r;
		uuid[8]=uuid[13]=uuid[18]=uuid[23]='-';
		uuid[14]='4';
		for(i=0;i<36;i++){
			if(!uuid[i]){
				r=0|Math.random()*16;
				uuid[i]=chars[(i==19)?(r&0x3)|0x8:r];
			}
		}
	}
	return uuid.join('');
}

function getValidId(){
	return 'token_' + getUuidCode();
}

module.exports = router;
