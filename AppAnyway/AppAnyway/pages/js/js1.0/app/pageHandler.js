/**
 * 页面加载处理
 * 
 */
var $PageHandler = {
	direct:userConfig.transitionMode,
	lastPage:null,
	moveToPage:function(url){
		if(!url)
			return;
		var pageId = url.substr(0,url.indexOf('.html'));
		if(pageId)
			this.changePage(pageId);
	},
	/**
	 * 更改页面内容
	 * @param {} pageId
	 * @param {} direct
	 * @returns {} 
	 */
	changePage:function(pageId,direct){
		var me = this;
		//判断加载方式(3种)
		if(!pageId)
			return;
		var pageCon = null;
		if(pageConfig.pages)
			pageCon = pageConfig.pages[pageId];
			
		//确定是新页面还是回退
		me.direct = direct || userConfig.transitionMode;
		if(pageCon === undefined){
			me.loadPage(pageId,me.saveConfig);
		}else{
			//是否是已经保存过的页面
			if(pageCon && pageCon.autoSave && pageCon.saved){
				//已经访问过且被保存的
				me.loadFromMobi(pageId);
			}else{
				me.loadPage(pageId);
			}	
		}
	},
	/**
	 * 从本地加载页面
	 * @param {} pageId
	 * @param {} fn
	 * @returns {} 
	 */
	loadPage:function(pageId,fn){
		var me = this;
		//Ajax加载本地html
		if(!pageId)
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
				//$('.pt-'+current).empty();
				$('.pt-'+current).height(0);
				$('.pt-'+current).html(data);
				$('#page_' + pageId).trigger('pageinit');
				if(fn){
					fn(pageId);
					me.loading = false;
				}
				me.changePageInfo(pageId);
			}
		});
	},
	/**
	 * 从手机加载页面
	 * @param {} pageId
	 * @returns {} 
	 */
	loadFromMobi:function(pageId){
		//从手机加载
		//读取history
		if(!pageId)
			return;
		var param = {
			"pageId":pageId
		};
		
		AW.invoke("AWManagePages","loadPage",param,function(data){
			if(!data.success){
				$PageHandler.loadPage(pageId);
			}else{
				var current = PageTransitions.getCurrent();
				if(current == 1)
					current = 0;
				else current = 1;
				
				$('.pt-'+current).height(0);
				$('.pt-'+current).html(decodeURI(data.result));
				$PageHandler.changePageInfo(pageId);	
			}
		});
	},
	/**
	 * 设置配置信息
	 * @param {} pageId
	 * @returns {} 
	 */
	changePageInfo:function(pageId){
		//从html里面加载
		var me = this;
		if(!pageId)
			return;
		
		location.hash = 'page_'+pageId;	
		var obj = userConfig.pages[pageId];
		//加入设置了要保存
		if(obj && obj.autoSave)
			me.savePage(pageId);
			
		$('#page_' + pageId).trigger('pagebeforeshow');
		//滑动页面
		me.translatePage(pageId);
		$('#page_' + pageId).trigger('pageshow');
		me.setPageHeight(pageId);
	},
	/**
	 * 页面切换，从userConfig读取页面切换方式
	 * @returns {} 
	 */
	translatePage:function(pageId){
		var me = this;
		PageTransitions.nextPage(me.direct);
	},
	/**
	 * 页面返回操作
	 * @returns {} 
	 */
	pageBack:function(){
		var me = this,
			hash = location.hash;
			
		if(!hash)
			return;
		
		var pageId = hash.substr(hash.indexOf('_')+1,hash.length);
		var layer = '';
		
		if(pageConfig.pages[pageId])
			layer = pageConfig.pages[pageId].layer;
		if(layer == 1){
			//中间件退出软件操作
			AW.invoke("AWAppInfo","exitSoft","",function(data){
				/*if(data.success && !data.result){
					alert("退出软件失败!");
				}*/
			});
		}else{
			var lastLayer = 0;
			do{
				lastLayer = pageConfig.layerPage[--layer];
			}while(!lastLayer && layer > 1)
			
			layer = layer || 1;
			pageId = lastLayer;
			pageId = pageId || userConfig.homePage;
			var transitionMode = userConfig.transitionMode;
			me.changePage(pageId,transitionMode+1);
		}
	},
	
	/**
	 * 保存页面
	 * @param {} pageId
	 * @returns {} 
	 */
	savePage:function(pageId){
		if(!pageId)
			return;
		var id = PageTransitions.getCurrent();
		if(id == 1)
			id = 0;
		else id = 1;
		
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
	},
	
	/**
	 * 保存访问过的实体
	 * @param {} pageId
	 * @returns {} 
	 */
	saveConfig:function(pageId){
		if(!pageId)
			return;
		var userObj = userConfig.pages[pageId];
		
		if(userObj !== undefined){
			pageConfig.pages[pageId] = userObj;
			if(userObj.layer)
				pageConfig.layerPage[userObj.layer] = pageId;
		}else{
			alert("请检查，项目中是否有id号为"+pageId+"的页面");
		}
	},
	/**
	 * 设置页面的高度
	 * @param {} pageId
	 * @returns {} 
	 */
	setPageHeight:function(pageId){
		if(!pageId)
			return;
		var pageHeader = null;			//页面Header
		var pageFooter = null;			//页面Footer
		var obj = userConfig.pages[pageId];
		
		if(obj && obj['AWHeader']){
			$('#'+obj['AWHeader']).show();
			pageHeader = $('#'+obj['AWHeader']).height() || 0;
		}else{
			$('#'+obj['AWHeader']).hide();
		}
		
		if(obj && obj['AWFooter']){
			$('#'+obj['AWFooter']).show();
			pageFooter = $('#'+obj['AWFooter']).height() || 0;
		}else{
			$('#'+obj['AWFooter']).hide();
		}
		
		//设置content离header与footer的
		$('.ptContent').css('marginTop',pageHeader);
		$('.ptContent').css('marginBottom',pageFooter);
		
		//设置高度
		var current = PageTransitions.getCurrent();
		var curScrollHeight = $('.pt-'+current)[0].scrollHeight;
		var windowHeight = window.innerHeight;
		//设置页面高度，当内容页面的高度大于手机页面高度时，设置高度为内容页高度，否则为手机屏幕高度
		if(curScrollHeight > windowHeight){  
			$('.ptContent').height( curScrollHeight );
			$('.pt-'+current).height( curScrollHeight );
		}else{
			var actualHeight = windowHeight-pageHeader-pageFooter-1;
			$('.ptContent').height( actualHeight );
			$('.pt-'+current).height( actualHeight );
			$('.AWPage').height(actualHeight);
		}
	}
};






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
		if(url === "" || url === undefined || url === unll)
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
