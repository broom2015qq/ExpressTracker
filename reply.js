var CorpID = require('./config').CorpID;
var Secret = require('./config').Secret;
var Agentid = require('./config').Agentid;
var getToken = require('./token').getToken;
var getUserInfo = require('./user').getUserInfo;

var request = require('request');

function reply(msg){			
	getToken(CorpID, Secret).then(function(res){
    	var token = res.access_token;
    		request('https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token='+token+'&userid='+msg.res_ID, function(err, res, data){
    		if (err) {
				console.log(err);
			}
          	var name = JSON.parse(data).name;
          	var tele = JSON.parse(data).mobile;
          	console.log(data);
        //发送消息给求取者
    		request({url:'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token='+token,
    		method: 'POST',
    		json:true,	 
 		body: {
 			"touser": msg.req_ID, 
    		"msgtype": "text", 
    		"agentid": Agentid,
    		"text": {	
         		"content":name+"接受了你的的请求,即将把快递送到你手上~\n"+"ta的联系方式为"+tele
    			}	
    		}}, function(err,httpResponse,body){
    		if (err) {
    			return console.error('Send failed:', err);
 			}
  			console.log('Server responded with:', body);
  		});
    	
    	//发送消息给帮取者	
    		request({url:'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token='+token,
    		method: 'POST',
    		json:true,	     		
    		body: {
    		"touser": msg.res_ID, 
    		"msgtype": "text", 
    		"agentid": Agentid,
    		"text": {	
         		"content":"你接受了"+msg.nickname+"的请求,快帮ta把快递安全送到吧~\n"+"快递信息:"+msg.usrname+" "+msg.address+" "+msg.company
    			}	
    		}}, function(err,httpResponse,body){
    		if (err) {
    			return console.error('Send failed:', err);
 			}
  			console.log('Server responded with:', body);
  		});
    		 
    		});
    	});
}

module.exports = {
  	reply: reply
};


