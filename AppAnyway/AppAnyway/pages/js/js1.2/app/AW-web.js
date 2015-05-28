/**
 * android 交互
 */
function invokeMethod(param) {
	//return window.android.invokeMethod(JSON.stringify(param));
}


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
 * AW基础工具方法
 * @returns {} 
 */
(function(){
	var AWModal = function(){}
	
	/**
	 * 对象扩展
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


/**
 *toast消息提示框
 *默认属性：
 *  time-显示时间：时间格式是毫秒，1000表示1s
 *  content-显示内容:文本
 *  cssTheme-CSS样式：default\primary\caution\highlight
 *  position-位置:属性设置toast的位置
 * 
 */
(function(){
	var AWToast = function(){
		var me = this;
		me.defaultConfig = {
			time : 5000,
			content : "显示",
			cssTheme : "default",
			position : {
				'z-index':'10000',
			}
		};
		me.toastQueue = new Array();			//消息样式 数组
		me.configQueue = new Array();			//参数样式数组，每个消息对应一个参数配置对象
	 	me.signal = 1;				
	}
	
	/**
	 * 初始化toast
	 * @param {} config
	 * @returns {} 
	 */
	AWToast.prototype.initToast = function(config){
		var me = this;
		config = me.initConfig(config,me.defaultConfig);
		var wrapDiv = document.createElement("div");
		wrapDiv.setAttribute('class','AWToast');
		var innerDiv = "<div class='AWMsg "+config.cssTheme+" glow-"+config.cssTheme+"'>"+config.content+"</div>";
		for(var key in config.position){
			wrapDiv.style[key] = config.position[key];
		}
		wrapDiv.innerHTML = innerDiv;
		me.toastQueue.push(wrapDiv);
		me.configQueue.push(config);
		me.triggerShow();
	}
	
	/**
	 * 初始化配置参数
	 * @param {} config
	 * @param {} defaultCon
	 * @returns {} 
	 */
	AWToast.prototype.initConfig = function(config,defaultCon){
		var key, me = this;
		var newConfig = new Object();
		for( key in defaultCon){
			if(key in config){
				if(typeof config[key] === 'object'){
					newConfig[key] = initConfig(config[key],defaultCon[key]);
				}else
					newConfig[key] = config[key];
			}else{
				newConfig[key] = defaultCon[key];
			}
		}
		return newConfig; 
	}
	
	/**
	 * 显示toast
	 * @returns {} 
	 */
	AWToast.prototype.triggerShow = function (){
		var me = this;
		if(me.signal && me.toastQueue.length){
			var config = me.configQueue.splice(0,1)[0];
			var toastDiv = me.toastQueue.splice(0,1)[0];
			me.signal = 0;
			var bodyDom = document.getElementsByTagName('body')[0]; 
			toastDiv.style.display = 'block'; 
			bodyDom.appendChild(toastDiv);
			var timeout = setTimeout(function(){me.hide(timeout,toastDiv);},config.time);
		}
	}
	
	/**
	 * 隐藏toast
	 * @param {} timeout
	 * @param {} dom
	 * @returns {} 
	 */
	AWToast.prototype.hide = function(timeout,dom){
		var me = this;
		me.signal = 1;
		dom.style.display = 'none';
		clearTimeout(timeout);
		var bodyDom = document.getElementsByTagName('body')[0];  
		bodyDom.removeChild(dom);
		me.triggerShow();	
	}
	
	
	AWToast.prototype.show = function(config){
		var me = this;
		me.initToast(config);
	}
	
	window.AW.Toast = new AWToast();
}());


/**
 * 页面滑动逻辑控制
 * @returns {} 
 */
(function(){
	var AWAnimation = function(){
		var me = this;
		me.movingFlag = false;
		me.current = 0;
		me.awPages = document.getElementsByClassName('aw');
		me.pageLen = me.awPages.length;
		me.init();
	}
	
	/**
	 * 初始化绑定时间
	 * @returns {} 
	 */
	AWAnimation.prototype.init = function(){
		var me = this;
		document.getElementById('aw-ct').style.height = window.innerHeight;
		document.getElementById('aw-ct').style.width =  window.innerWidth;
		
		for(var i = 0; i < me.pageLen;i++){
			me.awPages[i].setAttribute("originalClass", me.awPages[i].getAttribute('class'));
			me.awPages[i].style.height = window.innerHeight;
		}
		//firefox浏览器   animationend
		//WebView  webkitAnimationEnd
		document.getElementById('awpage0').addEventListener('animationend',function(){
			me.movingFlag = false;
			me.setCurrent();
		});
	}
	
	/**
	 * 滑动页面
	 * @param {} animation
	 * @returns {} 
	 */
	AWAnimation.prototype.awMovePage = function(animation){
		var me = this;
		if(me.movingFlag){
			return;
		}
		me.movingFlag = true;
		var currentPage = document.getElementById('awpage'+me.current);
		var next = me.current == 1 ? 0 : 1;
		var nextPage = document.getElementById('awpage'+next);
		var outClass = "";
		var inClass = "";	
		
		currentPage.setAttribute('class',currentPage.getAttribute('originalClass'));
		nextPage.setAttribute('class',nextPage.getAttribute('originalClass'));
		
		switch(animation){
			case 1://left 
				outClass = ' aw-moveToLeft';
				inClass = ' aw-moveFromRight'
				break;
			case 2://right
				outClass = ' aw-moveToRight';
				inClass = ' aw-moveFromLeft ';	
			break;
			case 3://leftFade
				outClass = ' aw-moveToLeftFade';
				inClass = ' aw-moveFromRightFade'
				break;
			case 4://rightFade
				outClass = ' aw-moveToRightFade';
				inClass = ' aw-moveFromLeftFade'
				break;
		}
		currentPage.setAttribute('class',currentPage.getAttribute('originalClass') + outClass);
		nextPage.setAttribute('class',nextPage.getAttribute('originalClass') + inClass);
	}
	
	/**
	 * 改变当前页面的标志
	 * @returns {} 
	 */
	AWAnimation.prototype.setCurrent = function(){
		var me = this;
		if(me.current < me.pageLen - 1){
			++me.current;
		}else{
			me.current = 0;
		}
	}
	
	AW.AWAnimation = AWAnimation;
}());


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
	 * pageinit
	 * pagebeforeshow
	 * pageshow 
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


/**
 * 交互模块
 * @returns {} 
 */
(function(){
	var AWCore = function (){
		this.req = new AW.AWReqQueue();
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
		if(arguments.length != 4){
			AW.Toast.show({content:"参数缺失，参数分别为：类名、方法名、参数对象、回调函数！！"});
			return false;
		}else{
			var me = this;
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
	 * 统一回调函数
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


/**
 * 页面控制
 * @returns {} 
 */
(function(){
	var AWPageAction = function(){
		var me = this;
		me.direct = userConfig.transitionMode;
		me.pages = {};
		me.loading = false;
		me.pageTransitions = new AW.AWAnimation();
		me.lastPConfig = null;
		me.lastPage = "";
	}
	
	/**
	 * 根据URL跳转页面
	 * @param {} url
	 * @param {} config
	 * @returns {} 
	 */
	AWPageAction.prototype.moveToPage = function(url,config){
		if(AW.isEmptyStr(url))
			return;
		var me = this;
		var pageId = url.substr(0,url.indexOf('.html'));
		me.lastPConfig = config;
		me.changePage(pageId);	
	}
	
	/**
	 * 切换页面
	 * @param {} pageId
	 * @param {} direction
	 * @returns {} 
	 */
	AWPageAction.prototype.changePage = function(pageId,direction){
		var me = this;
		if(AW.isEmptyStr(pageId))
			return;
		if(me.loading || me.pageTransitions.movingFlag){
			if(me.loading)
				AW.Toast.show({"content":"页面未处理完！！"});
			if(me.pageTransitions.movingFlag)
				AW.Toast.show({"content":"页面未滑动完！！"});
			return;
		}
		me.loading = true;	
		var pageCon = null;
		if(pageConfig.pages)
			pageCon = pageConfig.pages[pageId];
		
		//me.savePage();
		//确定是新页面还是已加载的页面
		if(direction === null || direction === undefined)
			me.direct = userConfig.transitionMode;
		else me.direct = direction;
		
		if(pageCon === undefined || pageCon === null){
			me.loadPage(pageId,saveConfig);
		}else{
			//是否是已经成功保存到手机的页面
			if(pageCon && pageCon.autoSave && pageCon.saved){
				me.loadPageFromMobi(pageId);
			}else{
				me.loadPage(pageId);
			}	
		}
	}
	
	/**
	 * 加载本地的html文件
	 * @param {} pageId
	 * @param {} fn
	 * @returns {} 
	 */
	AWPageAction.prototype.loadPage = function(pageId,fn){
		var me = this;
		if(AW.isEmptyStr(pageId))
			return;
		AW.get({
			url:pageId+'.html',
			callback:function(data){
				if(!data)
					return;
				var current = me.pageTransitions.current;
				current = current == 1 ? 0 : 1;
				var awCurrent = AW.getDomByClass('aw-'+current);
				awCurrent[0].innerHTML = data;
				
				me.activeJS(data);
				AW.pages[pageId].fireEvent('pageinit');
				
				if(fn){
					fn(pageId);
				}
				me.changePageInfo(pageId);
				me.savePageJS(pageId,data);
			}
		});
	}
	
	/**
	 * 将JS附加到<head>
	 * @param {} data
	 * @returns {} 
	 */
	AWPageAction.prototype.activeJS = function(data){
		var reg = /<script.*?>[\S\s]+?<\/script>/g;
		var script = data.match(reg);
		if(AW.isEmptyStr( script ))
			return;
		var regrep = /<script.*?>|<\/script>/g;
		var outerScript = document.createElement('script');
		var innerJS = "";
		for(var i=0,len=script.length;i < len;i++){
			script[i] = script[i].replace(regrep,"");
			innerJS += script[i];
		}
		outerScript.innerHTML = innerJS;
		document.getElementsByTagName('head')[0].appendChild(outerScript);
	}
	
	/**
	 * 修改页面配置信息
	 * @param {} pageId
	 * @returns {} 
	 */
	AWPageAction.prototype.changePageInfo = function(pageId){
		var me = this;
		if(AW.isEmptyStr(pageId))
			return;
		
		me.setScrollTop(pageId);
		AW.pages[pageId].fireEvent('pagebeforeshow');
		me.translatePage();

		AW.pages[pageId].fireEvent('pageshow');
		me.loading = false;
		//me.removeHtml();
		me.lastPage = pageId;
	}
	
	
	/**
	 * 删除上一个访问页面的HTML
	 * @returns {} 
	 */
	AWPageAction.prototype.removeHtml = function(){
		var me = this;
		var last = me.lastPage;
		if(last){
			var lastPage = AW.getDomById('page_'+last);
			lastPage.parentNode.removeChild(lastPage);
		}
	}
	
	
	/**
	 * 页面切换，从userConfig读取页面切换方式
	 * @returns {} 
	 */
	AWPageAction.prototype.translatePage = function (){
		var me = this;
		me.pageTransitions.awMovePage(me.direct);
	}
	
	/**
	 * 从手机加载页面
	 * @param {} pageId
	 * @returns {} 
	 */
	AWPageAction.prototype.loadPageFromMobi = function(pageId){
		var me = this;
		if(AW.isEmptyStr(pageId))
			return;
		var param = {"pageId":pageId};
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
	 * @param {} pageId
	 * @param {} htmlStr
	 * @returns {} 
	 */
	AWPageAction.prototype.createMobiPage = function(pageId,htmlStr){
		var me = this;
		var current = me.pageTransitions.current;
		current = current == 1 ? 0 : 1;
		var sub1 = htmlStr.split('<savedJS>');
		var pageHtml = sub1[0];
		var pageJS = "";
		var pageParam = "";
		
		if(sub1[1]){
			pageJS = sub1[1].split('</savedJS>');
		}
			
		if(pageJS[1]){
			pageParam = pageJS[1].split('</savedParams>')[0];
		}
		
		pageJS = pageJS[0];
		if(pageParam.length)
			pageParam = pageParam.substring(13,pageParam.length);
			
		var awCurrent = AW.getDomByClass('aw-'+current);
		awCurrent[0].innerHTML = pageHtml;
		
		me.activeJS(pageJS);
		if(pageParam){
			var paramJSON = JSON.parse(pageParam);
			if(AW.isEmpty(me.pages[pageId])){
				return false;
			}else{
				window['AW_'+pageId] = AW.extend(window['AW_'+pageId],paramJSON);
			}
		}
		AW.pages[pageId].fireEvent('pageinit');
		me.changePageInfo(pageId);
		me.savePageJS(pageId,htmlStr);
	}
	
	
	/**
	 * 根据手机获取的字符串生成页面对象
	 * @param {} pageId
	 * @param {} htmlStr
	 * @returns {} 
	 */
	AWPageAction.prototype.savePageJS = function(pageId,htmlStr){
		var me = this;
		if(me.pages[pageId]){
			me.pages[pageId].setScriptArr(htmlStr);
		}
	}
	
	
	/**
	 * 页面返回操作
	 * @returns {} 
	 */
	AWPageAction.prototype.pageBack = function(){
		var me = this;
		if(me.loading || me.pageTransitions.movingFlag)
			return;

		var pageId = me.lastPage;
		if(AW.isEmptyStr(pageId))
			return;
		
		var layer = '';
		if(pageConfig.pages[pageId])
			layer = pageConfig.pages[pageId].layer;
		if(layer == 1){
			//中间件退出软件操作
			AW.invoke("AWAppInfo","exitSoft",{},function(data){});
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
			AW.Toast.show({"content":"请检查，项目中是否有id号为"+pageId+"的页面!!"});
		}
	}
	
	/**
	 * 页面保存
	 * @returns {} 
	 */
	AWPageAction.prototype.savePage = function(){
		var me = this;	
		var pageId = me.lastPage;
		if(AW.isEmptyStr(pageId))
			return;
			
		//是否需要保存改页面
		var obj = userConfig.pages[pageId];
		if(obj && obj.autoSave){
			me.saveScrollTop(pageId);
			var id = me.pageTransitions.current;
			var pageContent = AW.getDomByClass('aw-'+id)[0].innerHTML;
			if(AW.isEmptyStr(pageContent))
				return;
		    
			var JS = "";
			if(me.pages[pageId]){
				JS = me.pages[pageId].getScriptArr();
			}
			
			if(JS)
				pageContent += JS;
			
			var params = JSON.stringify(window['AW_'+pageId]);
			if(params.length > 2){
				pageContent += "<savedParams>"+params+"</savedParams>";
			}
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
		}
		me.removePage(pageId);
	}
	
	/**
	 * 添加page时创建一个AWPageContainer
	 * @param {} name
	 * @param {} config
	 * @returns {} 
	 */
	AWPageAction.prototype.createPageObj = function(name,config){
		var me = this;
		if(typeof name !== 'string'){
			AW.Toast.show({"content":"参数错误，请检查参数 "+name+" 是否为字符串！！"});
			return false;
		}
			
		var pageObj = new AW.AWPageContainer();
		me.pages[name] = AW.extend(me.pages[name], pageObj);
		config = AW.extend(config,me.lastPConfig);
		me.lastPConfig = null;
		window['AW_'+name] = AW.extend(window['AW_'+name],config);
		return pageObj;
	}
	
	/**
	 * 移除page
	 * @param name: pageid
	 */
	AWPageAction.prototype.removePage = function(pageId){
		var me = this;
		var page = me.pages[pageId];
		console.log("释放内存"+pageId);
		if(page !== undefined){
			page = null;
			me.pages[pageId] = null;
			delete me.pages[pageId];
		}
	
		if(window['page_'+pageId]){
			window['page_'+pageId] = null;
			delete window['page_'+pageId];
		}
			
		if(window['AW_'+pageId]){
			window['AW_'+pageId] = null;
			delete window['AW_'+pageId];
		}
	}
	
	/**
	 * 保存页面滚动高度
	 * @param {} pageId
	 * @returns {} 
	 */
	AWPageAction.prototype.saveScrollTop = function(pageId){
		var me = this;
		var current = me.pageTransitions.current;
		var elem = AW.getDomById('awpage'+current);
		var scrollT = elem.scrollTop;
		if(pageConfig.pages[pageId])
			pageConfig.pages[pageId].scrollTop = scrollT;
		else
			userConfig.pages[pageId].scrollTop = scrollT;
	}
	
	/**
	 * 设置页面滚动高度
	 * @param {} pageId
	 * @returns {} 
	 */
	AWPageAction.prototype.setScrollTop = function(pageId){
		var scrollTop, me = this;
		if(pageConfig.pages[pageId])
			scrollTop = pageConfig.pages[pageId].scrollTop;
		else
			scrollTop = userConfig.pages[pageId].scrollTop;
		var current = me.pageTransitions.current;
		current = current == 1 ? 0 : 1;
		var elem = AW.getDomById('awpage'+current);
		elem.scrollTop = scrollTop;
	}
	
	window.AW = AW.extend(window.AW,new AWPageAction());
}());