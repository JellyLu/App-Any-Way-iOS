/**
 * 交互模块
 * @returns {} 
 */
(function(){
	var AWCore = function (){
		this.req = new AW.AWReqQueue();
		this.paramCheck = new AW.CheckParam();
	}
	/**
	 * JS端接口
	 * @param {} className
	 * @param {} method
	 * @param {} params
	 * @param {} callback
	 * @returns {} 
	 */
	AWCore.prototype.invoke = function(className,method,params,callback){
		//无四个参数，参数缺失
		if(arguments.length != 4){
			//提示错误
			AWToast.show({content:"参数缺失，参数分别为类名、方法名、参数对象、回调行数！！"});
			return false;
		}else{
			var me = this;
			if(!me.validateParam(className,method,params,callback))
				return false;
			var param = {};
			param.className = className;
			param.methodName = method;
			param.param = params;
			param.userCallback = callback;
			param.callbackMethod = "AW.executeCallback";
			param.requestId = GlobalIdentify.getId();
			me.req.addReq(param);
			me.req.activeNext();	
		}
	};
	
	/**
	 * 检测参数的合法性
	 * @param {} className
	 * @param {} methodName
	 * @param {} params
	 * @param {} callback
	 * @returns {} 
	 */
	AWCore.prototype.validateParam =  function(className,methodName,params,callback){
		var me = this;
		if(!me.paramCheck.isClassName(className)){
			AWToast.show({content:"类名错误"});
			return false;
		}
		if(!me.paramCheck.isMethodName(methodName)){
			AWToast.show({content:"方法名错误"});
			return false;
		}
		if(!me.paramCheck.isParamObj(params)){
			AWToast.show({content:"参数错误"});
			return false;
		}
		if(!me.paramCheck.isCallbackFun(callback)){
			AWToast.show({content:"回调函数错误"});
			return false;
		}
		return true;
	};
	
	
	/**
	 * 统一回调行数
	 * @returns {} 
	 */
	AWCore.prototype.executeCallback = function(){
		var data = arguments[0];
		var me = this;
		if(data == '' || data == null || data == undefined){
			me.req.signal++;
			me.req.activeNext();
		}else{
			//获取最先来的请求
			var reqId = parseInt(data.requestId);
			//新版本
			var lastRequest = me.req.getReqById(reqId,data.finish);
			
			if(lastRequest != null){
				var userCallback = lastRequest.userCallback;
				if(typeof userCallback === 'function'){
					userCallback(data);
				}
			}
		}
	}
	
	window.AW = AW.extend(window.AW,new AWCore());
}());