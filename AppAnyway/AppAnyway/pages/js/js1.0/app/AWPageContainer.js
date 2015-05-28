/**
 * 页面对象
 * @returns {} 
 */
(function(){
	var AWPageContainer = function (){
		this.listeners = {};
		this.scriptArr = new Array();
	}
	/**
	 * 设置参数JavaScript数组
	 * @param {} htmlStr
	 * @returns {} 
	 */
	AWPageContainer.prototype.setScriptArr = function(htmlStr){
		if(AW.isEmptyStr(htmlStr))
			return;
		var me = this;
		var reg = /<script.*?>[\S\s]+?<\/script>/g;
		var script = htmlStr.match(reg);
		for(var i = 0,len = script.length;i < len;i++){
			me.scriptArr.push(script[i]);
		}
	}
	
	/**
	 * 获取JavaScript
	 * @returns {} 
	 */
	AWPageContainer.prototype.getScriptArr = function(){
		var me = this;
		var len = me.scriptArr.length;
		var scriptStr = "<savedJS>";
		for(var i = 0; i < len; i++){
			scriptStr += me.scriptArr[i];
		}
		scriptStr += "</savedJS>";
		return scriptStr;
	}
	
	/**
	 * 事件定义
	 * init
	 * beforeshow
	 * show 
	 */
	 
	
	/**
	 * 绑定事件
	 * @param ename 事件名
	 * @param func  事件执行方法
	 * @returns {} 
	 */
	AWPageContainer.prototype.addEvent = function(ename,func){
		var me = this;
		if(ename !== undefined && func !== undefined && typeof ename==='string' && typeof func === 'function'){
			me.listeners[ename] = func;
		}
	}
	
	/**
	 * 触发事件
	 * @param ename 事件名
	 * @returns  
	 */
	AWPageContainer.prototype.fireEvent = function(ename){
		var me = this;
		if(ename !== undefined && typeof ename === 'string'){
			var func = me.listeners[ename];
			if(func !== undefined && typeof func === 'function'){
				func(me,ename);
			}
		}
	}
	
	AW.AWPageContainer = AWPageContainer;
}());