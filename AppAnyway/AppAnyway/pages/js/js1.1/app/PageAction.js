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
				AWToast.show({"content":"页面未处理完"});
			if(me.pageTransitions.movingFlag)
				AWToast.show({"content":"页面未滑动完"});
			return;
		}
		me.loading = true;	
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
		//Ajax加载本地html
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
		//滑动页面
		me.translatePage();

		AW.pages[pageId].fireEvent('pageshow');
		me.loading = false;
		me.removeHtml();
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
		
		if(sub1[1])
			pageJS = sub1[1].split('</savedJS>');
		
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
		console.log("回退回退");
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
			AWToast.show({"content":"请检查，项目中是否有id号为"+pageId+"的页面!!"});
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
			//参数错误
			AWToast.show({"content":"参数错误，请检查参数 "+name+" 是否存在！！"});
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
			
		console.log(me.pages[pageId]+"______"+window['page_'+pageId]+"____"+window['AW_'+pageId]);
	}
	
	/**
	 * 保存页面滚动高度
	 * @param {} pageId
	 * @returns {} 
	 */
	AWPageAction.prototype.saveScrollTop = function(pageId){
		var me = this;
		var current = me.pageTransitions.current;
		var elem = AW.getDomById('page'+current);
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
		var scrollTop;
		if(pageConfig.pages[pageId])
			scrollTop = pageConfig.pages[pageId].scrollTop;
		else
			scrollTop = userConfig.pages[pageId].scrollTop;
		//设置
		var me = this;
		var current = me.pageTransitions.current;
		current = current == 1 ? 0 : 1;
		var elem = AW.getDomById('page'+current);
		elem.scrollTop = scrollTop;
	}
	
	window.AW = AW.extend(window.AW,new AWPageAction());
}());