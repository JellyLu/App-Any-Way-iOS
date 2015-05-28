(function(){
	var PageAction = function(){
		var me = this;
		me.direct = userConfig.transitionMode;
		me.pages = {};
		me.loading = false;
		me.pageTransitions = new AW.PageTransitions();
	}
	
	/**
	 * 根据URL跳转页面
	 * @returns {} 
	 */
	PageAction.prototype.moveToPage = function(url,config){
		if(AW.isEmptyStr(url))
			return;
		var me = this;
		var pageId = url.substr(0,url.indexOf('.html'));
		me.changePage(pageId);
		if(window['page_'+pageId]){
			window['AW_'+pageId] = AW.extend(window['AW_'+pageId],config)
		}
	}
	
	/**
	 * 切换页面
	 * @returns {} 
	 */
	PageAction.prototype.changePage = function(pageId,direction){
		var me = this;
		//console.log("window高度"+window.innerHeight);
		if(AW.isEmptyStr(pageId))
			return;
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
			//是否是已经保存过的页面
			if(pageCon && pageCon.autoSave && pageCon.saved){
				//已经访问过且被保存的
				me.loadPageFromMobi(pageId);
			}else{
				me.loadPage(pageId);
			}	
		}
	}
	
	PageAction.prototype.loadPage = function(pageId,fn){
		var me = this;
		//Ajax加载本地html
		if(AW.isEmptyStr(pageId))
			return;
		AW.get({
			url:pageId+'.html',
			type:"post",
			dataType:'html',
			callback:function(data){
				if(!data)
					return;
				var current = me.pageTransitions.getCurrent();
				current = current == 1 ? 0 : 1;
				var awCurrent = AW.getDomByClass('aw-'+current);
				awCurrent[0].style.height = 0 + 'px';
				awCurrent[0].innerHTML = data;
				
				me.activeJS(data);
				AW.pages[pageId].fireEvent('init');
				
				if(fn){
					fn(pageId);
				}
				me.changePageInfo(pageId);
				me.loading = false;
				me.savePageJS(pageId,data);
			}
		});
	}
	
	
	PageAction.prototype.activeJS = function(data){
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
	PageAction.prototype.changePageInfo = function(pageId){
		//从html里面加载
		var me = this;
		if(AW.isEmptyStr(pageId))
			return;
		location.hash = 'page_'+pageId;
		AW.pages[pageId].fireEvent('pagebeforeshow');
		
		//滑动页面
		me.translatePage();
		me.setPageHeight(pageId);
		AW.pages[pageId].fireEvent('pageshow');
			
		/*setTimeout(function(){
			me.setPageHeight(pageId);
			AW.pages[pageId].fireEvent('pageshow');
		},300);*/
	}
	
	
	/**
	 * 页面切换，从userConfig读取页面切换方式
	 * @returns {} 
	 */
	PageAction.prototype.translatePage = function (){
		var me = this;
		me.pageTransitions.nextPage(me.direct);
	}
	
	/**
	 * 加载页面
	 */
	PageAction.prototype.loadPageFromMobi = function(pageId){
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
		me.loading = false;
	}
	
	/**
	 * 根据手机获取的字符串生成页面对象
	 */
	PageAction.prototype.createMobiPage = function(pageId,htmlStr){
		var me = this;
		var current = me.pageTransitions.getCurrent();
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
		awCurrent[0].style.height = '0px';
		awCurrent[0].innerHTML = pageHtml;
		
		me.activeJS(pageJS);
		me.changePageInfo(pageId);
		me.savePageJS(pageId,htmlStr);
		
		if(pageParam){
			var paramJSON = JSON.parse(pageParam);
			if(AW.isEmpty(me.pages[pageId])){
				return;
			}else{
				window['AW_'+pageId] = AW.extend(window['AW_'+pageId],paramJSON);
			}
		}
	}
	
	/**
	 * 根据手机获取的字符串生成页面对象
	 * 
	 */
	PageAction.prototype.savePageJS = function(pageId,htmlStr){
		var me = this;
		if(me.pages[pageId]){
			me.pages[pageId].setScriptArr(htmlStr);
		}
	}
	
	
	/**
	 * 页面返回操作
	 * @returns {} 
	 */
	PageAction.prototype.pageBack = function(){
		var me = this,
			hash = location.hash;
		if(me.loading)
			return;
			
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
	PageAction.prototype.savePage = function(){
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
			var id = me.pageTransitions.getCurrent();
			var pageContent = AW.getDomByClass('aw-'+id)[0].innerHTML;
			if(AW.isEmptyStr(pageContent))
				return;
		    
			var JS = me.pages[pageId].getScriptArr();
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
			me.removePage(pageId);
		}
	}
	
	/**
	 * 添加page时创建一个AWPageContainer
	 */
	PageAction.prototype.createPageObj = function(name,config){
		var me = this;
		if(typeof name !== 'string')
			return 1;
			
		if(me.pages[name] !== undefined)
			return 2;
			
		var pageObj = new AW.AWPageContainer();
		me.pages[name] = AW.extend(me.pages[name], pageObj);
		window['AW_'+name] = AW.extend(window['AW_'+name],config);
		return pageObj;
	}
	
	/**
	 * 移除page
	 * @param name: pageid
	 */
	PageAction.prototype.removePage = function(pageId){
		var me = this;
		var page = me.pages[pageId];
		if(page !== undefined){
			delete me.pages[pageId];
		}
	
		if(window['page_'+pageId])
			window['page_'+pageId] = null;
			
		if(window['AW_'+pageId])
			window['AW_'+pageId] = null;
			
		var current = me.pageTransitions.getCurrent();
		var lastPage = AW.getDomById("page_"+pageId);
		lastPage.parentNode.removeChild(lastPage);
	}
	
	/**
	 * 设置页面高度
	 * @returns {} 
	 */
	PageAction.prototype.setPageHeight = function (pageId){
		var me = this;
		var current = me.pageTransitions.getCurrent();
		var awCurrent = AW.getDomByClass('aw-'+current);
		var nowPage = AW.getDomById('page_'+pageId);
		var windowHeight = window.innerHeight;
		
		nowPage.style.height = windowHeight + 'px';
		awCurrent[0].style.height = windowHeight+'px';
		var awContent = AW.getDomByClass('aw-content');
		awContent[0].style.height = windowHeight+'px';
	}
	
	window.AW = AW.extend(window.AW,new PageAction());
}());