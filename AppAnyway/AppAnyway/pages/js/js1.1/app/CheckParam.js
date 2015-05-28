/**
 * 检测参数类型
 * @returns {} 
 */
(function(){
	var CheckParam = function(){}
	
	/**
	 * 验证参数是否为空
	 * @param {} param
	 * @returns {} 
	 */
	CheckParam.prototype.isNullOrUndefined = function(param){
		if(param === null || param === undefined)
			return true;
		else
			return false;
	}
	
	/**
	 * 判断字符串是否是类名
	 * 约定类名为大写字母开头
	 * @param {} param
	 * @returns {} 
	 */
	CheckParam.prototype.isClassName = function(param){
		var me = this;
		if(me.isNullOrUndefined(param))
			return false;
		var reg = /^[A-Z]/;
		if(reg.test(param))
			return true;
		else 
			return false;
	}
	
	/**
	 * 判断字符串是否是方法名
	 * 约定方法名小写字母开头
	 * @param {} param
	 * @returns {} 
	 */
	CheckParam.prototype.isMethodName = function(param){
		var me = this;
		if(me.isNullOrUndefined(param))
			return false;
		var reg = /^[a-z]/;
		if(reg.test(param))
			return true;
		else 
			return false;
	}
	
	/**
	 * 判断参数是否为对象
	 * 约定参数为对象格式
	 * @param {} param
	 * @returns {} 
	 */
	CheckParam.prototype.isParamObj = function(param){
		var me = this;
		if(me.isNullOrUndefined(param))
			return false;
		if(typeof param == "object")
			return true;
		else 
			return false;
	}
	
	/**
	 * 判断参数是否为函数
	 * @param {} param
	 * @returns {} 
	 */
	CheckParam.prototype.isCallbackFun = function(param){
		var me = this;
		if(me.isNullOrUndefined(param))
			return false;
		if(typeof param == "function")
			return true;
		else 
			return false;
	}
	
	AW.CheckParam = CheckParam;
}());
