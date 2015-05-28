/**
 * 全局配置
 */
var GlobalIdentify={
	id:0,
	getId:function(){
		return ++this.id;
	}
};

/**
 * 请求队列
 * @returns {} 
 */
function AWReqQueue(){
	var reqQueue = new Array();				//未提交的请求队列
	var hasReqQueue = new Array();			    //已提交的请求队列
	this.signal = 1;

	/**
	 * 添加请求到未处理的请求
	 * @param {} param
	 * @returns {} 
	 */
	this.addReq = function(param){
		reqQueue.push(param);
	};
	
	/**
	 * 执行下一个请求，从未处理移队列移到处理队列
	 * @returns {} 
	 */
	this.getNextReq = function(){
		var me = this,
			reqLen = reqQueue.length,
			obj = null;
		if(reqLen > 0 ){
			obj = reqQueue.shift();
			if(obj){
				hasReqQueue.push(obj);
			}
		}
		return obj;
	};
	
	/**
	 * 请求处理完，删除已提交请求队列里对应的请求
	 * @param {} reqId
	 * @returns {} 
	 */
	this.getReqById = function(reqId,finish){
		if(reqId === null || reqId === undefined)
			return;
		var me = this,
			reqLen = hasReqQueue.length;
		if(reqLen > 0){
			for(var i = 0; i < reqLen; i++){
				if(parseInt(reqId) == parseInt(hasReqQueue[i].requestId)){
					if(!finish)
						return hasReqQueue[i];
					else
						return hasReqQueue.splice(i,1)[0];
				}
			}
		}
	};
	
	/**
	 * 激活下一个请求
	 * @returns {} 
	 */
	this.activeNext = function(){
		var me = this;
		if(me.signal > 0){
			var param = me.getNextReq();
			if(param != null){
				me.signal--;
				invokeMethod(param);
			}
		}
	}
};
	

/**
 * 检测参数类型
 */
function checkParam(param){
	/**
	 * 验证参数是否为空
	 * @param {} param
	 * @returns {} 
	 */
	function isNullOrUndefined(param){
		if(param === null || param === undefined)
			return true;
		else
			return false;
	}
	
	this.isClassName = function(param){
		if(isNullOrUndefined(param))
			return false;
		var reg = /^[A-Z]/;
		if(reg.test(param))
			return true;
		else 
			return false;
	};
	
	this.isMethodName = function(param){
		if(isNullOrUndefined(param))
			return false;
		var reg = /^[a-z]/;
		if(reg.test(param))
			return true;
		else 
			return false;
	};
	
	this.isParamObj = function(param){
		if(isNullOrUndefined(param))
			return false;
		if(typeof param == "object")
			return true;
		else 
			return false;
	};
	
	this.isCallbackFun = function(param){
		if(isNullOrUndefined(param))
			return false;
		if(typeof param == "function")
			return true;
		else 
			return false;
	};
};
	

(function(){
	/**
	 * 交互模块
	 * @returns {} 
	 */
	function AWCore(){};
	AWCore.prototype.req = new AWReqQueue();
	AWCore.prototype.checkParam = new checkParam();
	
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
	AWCore.prototype.validateParam = function(className,methodName,params,callback){
		var me = this;
		if(!me.checkParam.isClassName(className)){
			AWToast.show({content:"类名错误"});
			return false;
		}
		if(!me.checkParam.isMethodName(methodName)){
			AWToast.show({content:"方法名错误"});
			return false;
		}
		if(!me.checkParam.isParamObj(params)){
			AWToast.show({content:"参数错误"});
			return false;
		}
		if(!me.checkParam.isCallbackFun(callback)){
			AWToast.show({content:"回调函数错误"});
			return false;
		}
		return true;
	};
	
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
	};
	
	window.AW = new AWCore();
	window.$PageHandler = new $PageHandler();
})();

function $PageHandler(){
	/**
	 * 页面切换方式
	 * @returns {} 
	 */
	var direct = userConfig.transitionMode;
	
	/**
	 * 根据页面URL切换页面
	 * @param {} url
	 * @returns {} 
	 */
	this.moveToPage = function(url){
		if(url === "" || url === undefined || url === null)
			return;
		var pageId = url.substr(0,url.indexOf('.html'));
		var me = this;
		me.changePage(pageId);
	}
	
	/**
	 * 根据页面Id切换页面
	 * @param {} pageId
	 * @param {} direct
	 * @returns {} 
	 */
	this.changePage = function(pageId,direction){
		//判断加载方式(2种)
		if(pageId === null || pageId === undefined || pageId === "")
			return;
			
		var pageCon = null;
		if(pageConfig.pages)
			pageCon = pageConfig.pages[pageId];
			
		savePage();
		
		//确定是新页面还是已加载的页面
		if(direction === null || direction === undefined)
			direct = userConfig.transitionMode;
		else direct = direction;
		if(pageCon === undefined){
			loadPage(pageId,saveConfig);
		}else{
			//是否是已经保存过的页面
			if(pageCon && pageCon.autoSave && pageCon.saved){
				//已经访问过且被保存的
				loadFromMobi(pageId);
			}else{
				loadPage(pageId);
			}	
		}
	}
	
	/**
	 * 页面回退
	 * @returns {} 
	 */
	this.pageBack = function(){
		var me = this,hash = location.hash;
		if(hash === "" || hash === undefined || hash === null)
			return;
			
		var pageId = hash.substr(hash.indexOf('_')+1,hash.length);
		if(pageId === "" || pageId === undefined || pageId === null)
			return;
			
		var layer = '';
		if(pageConfig.pages[pageId])
			layer = pageConfig.pages[pageId].layer || 1;
			
		if(layer == 1){
			AW.invoke("AWAppInfo","exitSoft",{},function(data){
				//退出失败或者成功
			});
		}else{
			var lastLayerPage;
			do{
				lastLayerPage = pageConfig.layerPage[--layer];
			}while(!lastLayerPage && layer > 1)
			
			pageId = lastLayerPage || userConfig.homePage;
			var transitionMode = userConfig.transitionMode+1;
			me.changePage(pageId,transitionMode);
		}
	}
	
	/**
	 * 从本地加载
	 * @param {} pageId
	 * @param {} fn
	 * @returns {} 
	 */
	function loadPage(pageId,fn){
		var me = this;
		//Ajax加载本地html
		if(pageId === "" || pageId === undefined || pageId === null)
			return;
		$.ajax({
			url:pageId+'.html',
			type:"post",
			dataType:'html',
			success:function(data){
				if(!data)
					return;
				var current = PageTransitions.getCurrent();
				if(current == 1)
					current = 0;
				else current = 1;
				$('.pt-'+current).height(0);
				$('.pt-'+current).html(data);
				$('#page_' + pageId).trigger('pageinit');
				if(fn){
					fn(pageId);
				}
				changePageInfo(pageId);
			}
		});
	}
	
	/**
	 * 从手机加载
	 * @param {} pageId
	 * @returns {} 
	 */
	function loadFromMobi(pageId){
		//从手机加载
		//读取history
		if(pageId === "" || pageId === undefined || pageId === null)
			return;
		var param = {
			"pageId":pageId
		};
		
		AW.invoke("AWManagePages","loadPage",param,function(data){
			if(!data.success){
				loadPage(pageId);
			}else{
				var current = PageTransitions.getCurrent();
				if(current == 1)
					current = 0;
				else current = 1;
				
				$('.pt-'+current).height(0);
				$('.pt-'+current).html(decodeURI(data.result));
				$('#page_' + pageId).trigger('pageinit');
				changePageInfo(pageId);	
			}
		});
	}
	
	/**
	 * 改变页面参数
	 * @param {} pageId
	 * @returns {} 
	 */
	function changePageInfo(pageId){
		//从html里面加载
		if(pageId === "" || pageId === undefined || pageId === null)
			return;
		location.hash = 'page_'+pageId;	
		$('#page_' + pageId).trigger('pagebeforeshow');
		//滑动页面
		translatePage();
		$('#page_' + pageId).trigger('pageshow');
		setPageHeight();
	}
	
	/**
	 * 页面切换
	 * @returns {} 
	 */
	function translatePage(){
		PageTransitions.nextPage(direct);
	}
	
	/**
	 * 页面保存
	 * @returns {} 
	 */
	function savePage(){
		var hash = location.hash;
		if(hash === "" || hash === undefined || hash === null)
			return;
			
		var pageId = hash.substr(hash.indexOf('_')+1,hash.length);
		if(pageId === "" || pageId === null || pageId === undefined)
			return;
		//是否需要保存改页面
		var obj = userConfig.pages[pageId];
		if(obj && obj.autoSave){
			var id = PageTransitions.getCurrent();
			var pageContent = $('.pt-'+id).html();
			if(pageContent){
				pageContent = encodeURI(pageContent);
				//保存页面到手机
				var param = {"pageContent":pageContent,"pageId":pageId};
				AW.invoke(
					"AWManagePages",
					"savePage",
					param,
					function(data){
						if(data.success){
							if(pageConfig.pages[pageId]) 
								pageConfig.pages[pageId].saved = true;
						}else{
							if(pageConfig.pages[pageId])
								pageConfig.pages[pageId].saved = false;
						}
					}
				);
			}
		}
	}
	
	/**
	 * 保存参数
	 * @param {} pageId
	 * @returns {} 
	 */
	function saveConfig(pageId){
		if(pageId === "" || pageId === null || pageId === undefined)
			return;
			
		var userObj = userConfig.pages[pageId];
		if(userObj !== undefined){
			pageConfig.pages[pageId] = userObj;
			if(userObj.layer)
				pageConfig.layerPage[userObj.layer] = pageId;
		}else{
			alert("请检查，项目中是否有id号为"+pageId+"的页面");
		}
	}
	
	/**
	 * 设置页面高度
	 * @returns {} 
	 */
	function setPageHeight(){
		//设置高度
		var current = PageTransitions.getCurrent();
		var curScrollHeight = $('.pt-'+current)[0].scrollHeight;
		var windowHeight = window.innerHeight;
		var windowWidth = window.innerWidth;
		$('.ptContent').height( windowHeight );
		$('.pt-'+current).height( windowHeight );
		$('.AWPage').height(windowHeight);
		
		$('.ptContent').width( windowWidth );
		$('.pt-'+current).width( windowWidth );
		$('.AWPage').width(windowWidth);
	}
}