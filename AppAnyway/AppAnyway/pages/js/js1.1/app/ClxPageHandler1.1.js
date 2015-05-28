/**
 * 全局配置
 */
var GlobalIdentify={
	id:0,
	getId:function(){
		return ++this.id;
	}
};

(function(){
	var AWModal = function(){}
	
	/**
	 * extend object
	 * @return extended object
	 */
	AWModal.prototype.extend=function(){
		var me = this,
			len = arguments.length,
			obj = {};
		
		if(len > 0){
			for(var i=0;i<len;i++){
				if(arguments[i] !== undefined && arguments[i] !== null){
					for(var o in arguments[i]){
						obj[o] = arguments[i][o];
					}
				}
			}
		}
		return obj;
	}

	
	/**
	 * 判断对象是不是空对象{}
	 * @param obj  需要判断的对象
	 * @return true/false
	 */
	AWModal.prototype.isEmpty = function(obj){
		if(obj === undefined || obj === null || typeof obj !== 'object')
			return true;
		var i=0;
		for(var o in obj)
			i++;
			
		if(i===0)
			return true;
		return false;
	}
	
	/**
	 * 判断是否为空字符串
	 * @param {} str
	 * @returns {} 
	 */
	AWModal.prototype.isEmptyStr = function(str){
		if(str === null || str === undefined || str === ""){
			return true;
		}else{
			return false;
		}
	}
	/**
	 * 获取dom by id
	 * @param domid
	 * @returns
	 */
	AWModal.prototype.getDomById = function(domid){
		return document.getElementById(domid);
	}
	
	/**
	 * 获取dom by class
	 * @param {} className
	 * @returns {} 
	 */
	AWModal.prototype.getDomByClass = function(className){
		var eles = document.getElementsByClassName(className);
		var eleArr = new Array();
		for(var i=0,len=eles.length;i<len;i++){
			eleArr.push(eles[i]);
		}
		return eleArr;
	}

	
	/**
	 * ajax getjson
	 * @param {Object} param
	 * {
	 * 	url:***				//获取数据url
	 * 	params:{},			//请求时传递的参数
	 *  callback:function(),//回调函数
	 *  timeout:***			//超时
	 *  async:  true/false  //是否异步
	 * }
	 */
	AWModal.prototype.getJSON = function(param){
		var me = this;
		if(param === undefined || param === null || 
		   param.url===undefined || param.url===null){
			return 3;			
		}
		if(param.callback !== undefined){
			var fun = param.callback; 
			param.callback = function(r){
				var o = eval('(' + r + ')');
				fun(o);
			}
		}
		me.get(param);
	}
	
	/**
	 * ajax getjson
	 * @param {Object} param
	 * {
	 * 	url:***				//获取数据url
	 * 	params:{},			//请求时传递的参数
	 *  callback:function(),//回调函数
	 *  timeout:***			//超时
	 *  async:  true/false  //是否异步
	 * }
	 */
	AWModal.prototype.get = function(param){
		if(param === undefined || param === null || 
		   param.url===undefined || param.url===null){
			return 3;			
		}
		if(param.async === undefined)
			param.async = true;
		
		var url = param.url;
		
		var sendData = null;
		if(param.params !== undefined && typeof param.params === 'object'){
			var a = [];
			for(var o in param.params){
				a.push(encodeURIComponent(o) + '=' + encodeURIComponent(param.params[o]));
			}
			sendData = a.join('&');
		}
		
		if(sendData !== null){
			if(url.indexOf('?') != -1)
				url += '&' + sendData;
			else
				url += '?' + sendData;
		}
		var xhr = new XMLHttpRequest();
		xhr.open("GET",url,param.async);
		xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
		
		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)){
				if(param.callback !== undefined && typeof param.callback === 'function'){
					try{
						param.callback(xhr.responseText);
					}catch(e){
						console.log(e);
					}
				}
			}	
		}
		xhr.send(null);
	}
	
	window.AW = new AWModal();
}());
