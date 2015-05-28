/**
 * 请求队列
 * @returns {} 
 */
(function(){
	var AWReqQueue = function (){
		this.reqQueue = new Array();				//未提交的请求队列
		this.hasReqQueue = new Array();			    //已提交的请求队列
		this.signal = 1;
	}
	/**
	 * 添加请求到未处理的请求
	 * @param {} param
	 * @returns {} 
	 */
	AWReqQueue.prototype.addReq = function(param){
		var me = this;
		me.reqQueue.push(param);
	}
	
	/**
	 * 执行下一个请求，从未处理移队列移到处理队列
	 * @returns {} 
	 */
	AWReqQueue.prototype.getNextReq = function(){
		var me = this,
			reqLen = me.reqQueue.length,
			obj = null;
		if(reqLen > 0 ){
			obj = me.reqQueue.shift();
			if(obj){
				me.hasReqQueue.push(obj);
			}
		}
		return obj;
	};
	
	/**
	 * 请求处理完，删除已提交请求队列里对应的请求
	 * @param {} reqId
	 * @returns {} 
	 */
	AWReqQueue.prototype.getReqById = function(reqId,finish){
		if(reqId === null || reqId === undefined)
			return;
		var me = this,
			reqLen = me.hasReqQueue.length;
		if(reqLen > 0){
			for(var i = 0; i < reqLen; i++){
				if(parseInt(reqId) == parseInt(me.hasReqQueue[i].requestId)){
					if(!finish)
						return me.hasReqQueue[i];
					else
						return me.hasReqQueue.splice(i,1)[0];
				}
			}
		}
	};
	
	/**
	 * 激活下一个请求
	 * @returns {} 
	 */
	AWReqQueue.prototype.activeNext = function(){
		var me = this;
		if(me.signal > 0){
			var param = me.getNextReq();
			if(param != null){
				me.signal--;
				invokeMethod(param);
			}
		}
	}
	
	AW.AWReqQueue = AWReqQueue;
}());
