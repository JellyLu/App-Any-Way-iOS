(function(){
	var Modal = function(){
		
	}
	/**
	 * extend object
	 * @return extended object
	 */
	Modal.prototype.extend=function(){
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
	Modal.prototype.isEmpty = function(obj){
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
	 * 获取dom by id
	 * @param domid
	 * @returns
	 */
	Modal.prototype.get = function(domid){
		return document.getElementById(domid);
	}
	
	/**
	 * 获取dom by class
	 * @param {} className
	 * @returns {} 
	 */
	Modal.prototype.getDomByClass = function(className){
		return document.getElementsByClassName(className);
	}
	
	/**
	 * 选择器查询
	 * @param selector
	 */
	Modal.prototype.find = function(selector){
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
	
	window.AW = new Modal();
}());

/**
 * page controller
 * page变量的管理需要开发者按照 pageid.setParam(name,val)和 pageid.getParam(name)规则来使用
 */
(function(){
	var Modal = function(){
		var me = this;
		me.pages = {};
	};
	
	//page class
	var Page = function(config){
		
		this.params={};
		
		//获取page参数
		this.getParam = function(pname){
			return this.params[pname];
		};
		
		this.setParam=function(pname,val){
			this.params[pname] = val;
		};
		
		this.setParams=function(config){
			this.params = AW.extend(this.params,config);
		};
		
		this.init = function(config){
			if(config !== undefined && config !== null && typeof config === 'object'){
				if(config.params !== undefined)
					this.setParams(config.params);
			}
		};
	};
	
	/**
	 * 添加page
	 */
	Modal.prototype.addPage(name,config){
		var me = this;
		if(typeof name !== 'string')
			return 1;
		if(me.pages[name] !== undefined)
			return 2;
		
		window[name] = AW.extend(window[name],new Page(config));
		return 0;
	}
	
	/**
	 * 移除page
	 * @param name: pageid
	 */
	Modal.prototype.removePage(name){
		var me = this;
		var page = me.pages[name];
		if(page !== undefined){
			for(var o in page){
				if(typeof page[o] === 'object')
					page[o] = null;
			}
			window[name] = null;
			delete me.pages[name];
		}
		return 0;
	}
	
	/**
	 * 保存page
	 */
	Modal.prototype.savePage(name){
		var me = this;
		//save page params
		var page = me.pages[name];
		if(page !== undefined){
			var pagehtml = AW.get(name).innerHTML()
			if(!AW.isEmpty(page.params)){
				pagehtml += "<savedparams>"+ JSON.stringify(page.params) +"</savedparams>";
			}
			
			//save to device
			
			//从内存清除
			me.removePage(name);
		}
		
	}
	
	/**
	 * 加载页面
	 */
	Modal.prototype.loadPageFromMobi(name){
		var me = this;
		//get page string
		var pagehtml = loadpage// 从设备加载页面
		var pagearr = pagehtml.splite("<savedparams>");
		var params;
		var ind = pagehtml.indexOf("<savedparams>");
		if(ind !== -1){
			params = JSON.parse(pagehtml.substring(ind + 13,pagehtml.length-13));
			pagehtml = pagehtml.substring(0,ind);
		}
		me.addPage(name,{params:params});
		//添加pagehtml到页面
	}
	
	AW.PageController = new Modal();
});
