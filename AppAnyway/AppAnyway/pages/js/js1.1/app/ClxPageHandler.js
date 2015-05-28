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
function checkParam(){
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
	
	
/**
 * 交互模块
 * @returns {} 
 */
function AWCore(){
	this.req = new AWReqQueue();
	var paramCheck = new checkParam();
	
	this.invoke = function(className,method,params,callback){
		//无四个参数，参数缺失
		if(arguments.length != 4){
			//提示错误
			AWToast.show({content:"参数缺失，参数分别为类名、方法名、参数对象、回调行数！！"});
			return false;
		}else{
			var me = this;
			if(!validateParam(className,method,params,callback))
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
	function validateParam(className,methodName,params,callback){
		var me = this;
		if(!paramCheck.isClassName(className)){
			AWToast.show({content:"类名错误"});
			return false;
		}
		if(!paramCheck.isMethodName(methodName)){
			AWToast.show({content:"方法名错误"});
			return false;
		}
		if(!paramCheck.isParamObj(params)){
			AWToast.show({content:"参数错误"});
			return false;
		}
		if(!paramCheck.isCallbackFun(callback)){
			AWToast.show({content:"回调函数错误"});
			return false;
		}
		return true;
	};
	
	this.executeCallback = function(){
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
};
	



(function(){
	var AWModal = function(){
	}
	
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
	AWModal.prototype.get = function(domid){
		return document.getElementById(domid);
	}
	
	/**
	 * 获取dom by class
	 * @param {} className
	 * @returns {} 
	 */
	AWModal.prototype.getDomByClass = function(className){
		return document.getElementsByClassName(className);
	}
	
	/**
	 * 选择器查询
	 * @param selector
	 */
	AWModal.prototype.find = function(selector){
		if(selector === undefined ||  typeof(selector)!== 'string')
			return;
		var sels = selector.split(" ");
		var cnt = 0;
		for(var i=0,len=sels.length;i<len;i++){
			if(sels !== ''){
				cnt++;
			}
		}
	}
	window.AW = new AWModal();
	window.AW = AW.extend(window.AW,new AWCore());
}());

/**
 * 页面对象
 * @returns {} 
 */
function AWPageContainer (pageId, config){
	this.pageId = pageId;
	this.params = config;
	this.scriptArr = new Array();
	
	this.setParams = function(paramObj){
		this.params = AW.extend(this.params,paramObj);
	}
	
	this.getParams = function(){
		var me = this;
		if(!me.params)
			return null;
		var strParams = JSON.stringify(me.params);
		if(strParams.length > 2){
			return "<savedParams>"+strParams+"</savedParams>";
		}
		return null;
	}
	
	
	this.setScriptArr = function(htmlStr){
		if(AW.isEmptyStr(htmlStr))
			return;
		var me = this;
		var reg = /<script.*?>[\S\s]+?<\/script>/g;
		var script = htmlStr.match(reg);
		for(var i = 0,len = script.length;i < len;i++){
			me.scriptArr.push(script[i]);
		}
	}
	
	this.getScriptArr = function(){
		var me = this;
		var len = me.scriptArr.length;
		var scriptStr = "<savedJS>";
		for(var i = 0; i < len; i++){
			scriptStr += me.scriptArr[i];
		}
		scriptStr += "</savedJS>";
		return scriptStr;
	}
}

	
(function(){
	var Modal = function(){
		var me = this;
		me.direct = userConfig.transitionMode;
		me.isloading = false;
		me.pages = {};
	}
	
	/**
	 * 根据URL跳转页面
	 * @returns {} 
	 */
	Modal.prototype.moveToPage = function(url){
		if(AW.isEmptyStr(url))
			return;
		var me = this;
		var pageId = url.substr(0,url.indexOf('.html'));
		me.changePage(pageId);
	}
	
	/**
	 * 切换页面
	 * @returns {} 
	 */
	Modal.prototype.changePage = function(pageId,direction){
		var me = this;
		if(pageId === null || pageId === undefined || pageId === "")
			return;
			
		var pageCon = null;
		if(pageConfig.pages)
			pageCon = pageConfig.pages[pageId];
		me.savePage();
		//确定是新页面还是已加载的页面
		if(direction === null || direction === undefined)
			me.direct = userConfig.transitionMode;
		else me.direct = direction;
		
		if(pageCon === undefined || pageCon === null){
			me.loadPage(pageId,saveConfig);
		}else{
			//是否是已经保存过的页面
			if(pageCon && pageCon.autoSave && pageCon.saved){
				//已经访问过且被保存的
				me.loadPageFromMobi(pageId);
			}else{
				me.loadPage(pageId);
			}	
		}
	}
	
	Modal.prototype.loadPage = function(pageId,fn){
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
				me.changePageInfo(pageId);
				me.savePageJS(pageId,data);
			}
		});
	}
	
	/**
	 * 修改页面配置信息
	 * @param {} pageId
	 * @returns {} 
	 */
	Modal.prototype.changePageInfo = function(pageId){
		//从html里面加载
		var me = this;
		if(AW.isEmptyStr(pageId))
			return;
			
		location.hash = 'page_'+pageId;
		$('#page_' + pageId).trigger('pagebeforeshow');
		//滑动页面
		me.translatePage(pageId);
		$('#page_' + pageId).trigger('pageshow');
		setPageHeight(pageId);
	}
	
	
	/**
	 * 页面切换，从userConfig读取页面切换方式
	 * @returns {} 
	 */
	Modal.prototype.translatePage = function (pageId){
		var me = this;
		PageTransitions.nextPage(me.direct);
	}
	
	/**
	 * 加载页面
	 */
	Modal.prototype.loadPageFromMobi = function(pageId){
		var me = this;
		if(AW.isEmptyStr(pageId))
			return;
		var param = {
			"pageId":pageId
		};
		
		AW.invoke("AWManagePages","loadPage",param,function(data){
			if(!data.success){
				loadPage(pageId);
			}else{
				me.createMobiPage(pageId,decodeURI(data.result));
			}
		});
	}
	
	/**
	 * 根据手机获取的字符串生成页面对象
	 */
	Modal.prototype.createMobiPage = function(pageId,htmlStr){
		var me = this;
		var current = PageTransitions.getCurrent();
		if(current == 1)
			current = 0;
		else current = 1;
		
		var sub1 = htmlStr.split('<savedJS>');
		var pageHtml = sub1[0];
		var pageJS = "";
		var pageParam = "";
		
		if(sub1[1])
			pageJS = sub1[1].split('</savedJS>');
		
		if(pageJS[1]){
			pageParam = pageJS[1].split('</savedParams>')[0];
		}
		
		pageJS = pageJS[0];
		if(pageParam.length)
			pageParam = pageParam.substring(13,pageParam.length);
		
		$('.pt-'+current).height(0);
		$('.pt-'+current).html(pageHtml);
		$('#page_' + pageId).trigger('pageinit');
		
		var reg = /<script.*?>[\S\s]+?<\/script>/g;
		var script = pageJS.match(reg);
		for(var i=0,len=script.length;i < len;i++){
			$(script[i]).appendTo('head');
		}
		me.changePageInfo(pageId);
		me.savePageJS(pageId,htmlStr);
		if(pageParam){
			var paramJSON = JSON.parse(pageParam);
			if(AW.isEmpty(me.pages[pageId])){
				return;
			}else{
				me.pages[pageId].setParams(paramJSON);
			}
		}
	}
	
	/**
	 * 根据手机获取的字符串生成页面对象
	 * 
	 */
	Modal.prototype.savePageJS = function(pageId,htmlStr){
		var me = this;
		if(me.pages[pageId]){
			me.pages[pageId].setScriptArr(htmlStr);
		}
	}
	
	
	/**
	 * 页面返回操作
	 * @returns {} 
	 */
	Modal.prototype.pageBack = function(){
		var me = this,
			hash = location.hash;
		if(AW.isEmptyStr(hash))
			return;
		
		var pageId = hash.substr(hash.indexOf('_')+1,hash.length);
		var layer = '';
		
		if(pageConfig.pages[pageId])
			layer = pageConfig.pages[pageId].layer;
			
		if(layer == 1){
			//中间件退出软件操作
			AW.invoke("AWAppInfo","exitSoft",{},function(data){
				
			});
		}else{
			var lastLayer = 0;
			do{
				lastLayer = pageConfig.layerPage[--layer];
			}while(!lastLayer && layer > 1)
			
			layer = layer || 1;
			pageId = lastLayer|| userConfig.homePage;
			var transitionMode = userConfig.transitionMode;
			me.changePage(pageId,transitionMode+1);
		}
	}
	
	/**
	 * 保存参数
	 * @param {} pageId
	 * @returns {} 
	 */
	saveConfig = function(pageId){
		if(AW.isEmptyStr(pageId))
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
	 * 页面保存
	 * @returns {} 
	 */
	Modal.prototype.savePage = function(){
		var hash = location.hash;
		if(AW.isEmptyStr(hash))
			return;
			
		var pageId = hash.substr(hash.indexOf('_')+1,hash.length);
		if(AW.isEmptyStr(pageId))
			return;
			
		var me = this;	
		//是否需要保存改页面
		var obj = userConfig.pages[pageId];
		if(obj && obj.autoSave){
			var id = PageTransitions.getCurrent();
			var pageContent = $('.pt-'+id).html();
			if(AW.isEmptyStr(pageContent))
				return;
		    
			var JS = me.pages[pageId].getScriptArr();
			if(JS)
				pageContent += JS;
			var params = me.pages[pageId].getParams();
			if(params)
				pageContent += params;
			
			pageContent = encodeURI(pageContent);
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
			me.removePage(pageId);
		}
	}
	
	/**
	 * 添加page时创建一个AWPageContainer
	 */
	Modal.prototype.createPageObj = function(name,config){
		var me = this;
		if(typeof name !== 'string')
			return 1;
			
		if(me.pages[name] !== undefined)
			return 2;
			
		var pageObj = new AWPageContainer(name,config);
		me.pages[name] = AW.extend(me.pages[name], pageObj);
		return me.pages[name];
	}
	
	/**
	 * 移除page
	 * @param name: pageid
	 */
	Modal.prototype.removePage = function(pageId){
		var me = this;
		me.pages[pageId] = null;
		delete me.pages[pageId];
		if(window['page_'+pageId]){
			window['page_'+pageId] = null;
			delete window['page_'+pageId];
		}
	}
	
	/**
	 * 设置页面高度
	 * @returns {} 
	 */
	function setPageHeight (){
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
	
	window.AW = AW.extend(window.AW,new Modal());
}());