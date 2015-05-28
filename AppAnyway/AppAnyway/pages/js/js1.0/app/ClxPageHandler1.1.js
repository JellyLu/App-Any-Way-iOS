/**
 * 全局配置
 */
var GlobalIdentify={
	id:0,
	getId:function(){
		return ++this.id;
	}
};

(function(){
	var AWModal = function(){}
	
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
		if(param.async === undefined)
			param.async = true;
		
		//add param to url
		var url = param.url;
		var sendData = null;
		
		//add random to url
		if(url.indexOf('?') !== -1) 
			url += '&_dc=' + Math.random();
		else
			url += '?_dc=' + Math.random();
		
		if(param.params !== undefined && typeof param.params === 'object'){
			var a = [];
			for(var o in param.params){
				a.push(encodeURIComponent(o) + '=' + encodeURIComponent(param.params[o]));
			}
			sendData = a.join('&');
		}
		
		var xhr = new XMLHttpRequest();
		xhr.open("GET",url,param.async);
		xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
		
		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4 && xhr.status === 200){
				if(param.callback !== undefined && param.callback !== null){
					try{
						var json = JSON.parse(xhr.responseText);
						param.callback(json);
					}catch(e){
						
					}
				}
			}	
		}
		xhr.send(sendData);
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
		var me = this;
		if(param === undefined || param === null || 
		   param.url===undefined || param.url===null){
			return 3;			
		}
		if(param.async === undefined)
			param.async = true;
		
		//add param to url
		var url = param.url;
		var sendData = null;
		
		if(param.params !== undefined && typeof param.params === 'object'){
			var a = [];
			for(var o in param.params){
				a.push(encodeURIComponent(o) + '=' + encodeURIComponent(param.params[o]));
			}
			sendData = a.join('&');
		}
		
		var xhr = new XMLHttpRequest();
		xhr.open("GET",url,param.async);
		xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4 && xhr.status === 200){
				if(param.callback !== undefined && param.callback !== null){
					try{
						param.callback(xhr.responseText);
					}catch(e){
					}
				}
			}	
		}
		xhr.send(sendData);
	}
	
	window.AW = new AWModal();
}());

	
/**	
(function() {
	var PageTransitions = function (){
		var me = this;
		me.$pages = document.getElementsByClassName("aw"),
		me.pagesCount = me.$pages.length,
		me.currentPage = 0,
		me.isAnimating = false,
		me.endCurrPage = false,
		me.endNextPage = false,
		me.animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		me.animEndEventName = me.animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		
		// support css animations
		me.support = Modernizr.cssanimations;
		me.init();
	}
	
	PageTransitions.prototype.init = function() {
		var me = this;
		for(var i = 0, len = me.$pages.length; i < len;i++){
			me.$pages[i].setAttribute("originalClass", me.$pages[i].getAttribute('class'));
		}
		
		me.$pages[me.currentPage].className += ' aw-current';
	}

	PageTransitions.prototype.getCurrent = function(){
		var me = this;
		return me.currentPage;
	}
	
	PageTransitions.prototype.nextPage = function( animation ) {
		console.log("animation start");
		var me = this;
		if( me.isAnimating ) {
			return false;
		}
		me.isAnimating = true;
		
		var $currPage = me.$pages[ me.currentPage ];
		
		if( me.currentPage < me.pagesCount - 1 ) {
			++me.currentPage;
		} else {
			me.currentPage = 0;
		}
		
		me.$pages[me.currentPage].className += ' aw-current';
		
		var $nextPage = me.$pages[me.currentPage],
			outClass = '', inClass = '';
			
		switch( animation ) {  
			case 1:
				outClass = 'aw-moveToLeft';
				inClass = 'aw-moveFromRight';
				break;
			case 2:
				outClass = 'aw-moveToRight';
				inClass = 'aw-moveFromLeft';
				break;
			case 3:
				outClass = 'aw-moveToLeftFade';
				inClass = 'aw-moveFromRightFade';
				break;
			case 4:
				outClass = 'aw-moveToRightFade';
				inClass = 'aw-moveFromLeftFade';
				break;
		}
		
		$currPage.className += ' ' + outClass;
		$currPage.addEventListener( me.animEndEventName, function() {
			$currPage.removeEventListener( me.animEndEventName, function(){} );
			me.endCurrPage = true;
			if( me.endNextPage ) {
				console.log("设置高度1");
				me.onEndAnimation( $currPage, $nextPage );
			}
		} );
		
		$nextPage.className += ' ' +  inClass;
		$nextPage.addEventListener( me.animEndEventName, function() {
			$nextPage.removeEventListener( me.animEndEventName, function(){} );
			me.endNextPage = true;
			if( me.endCurrPage ) {
				console.log("设置高度2");
				me.onEndAnimation( $currPage, $nextPage );
			}
		} );
		
		setTimeout(function(){
			me.onEndAnimation( $currPage, $nextPage );
		},900);
		*/
		
		/*
		if( !me.support ) {
			console.log("设置高度3");
			me.onEndAnimation( $currPage, $nextPage );
		}
		
	}

	PageTransitions.prototype.onEndAnimation = function( $outpage, $inpage ) {
		var me = this;
		me.endCurrPage = false;
		me.endNextPage = false;
		me.resetPage( $outpage, $inpage );
		me.isAnimating = false;
	}
	
	PageTransitions.prototype.resetPage = function( $outpage, $inpage ) {	
		console.log("animation end");
		$outpage.setAttribute("class", $outpage.getAttribute( 'originalClass' ));
		$inpage.setAttribute("class", $inpage.getAttribute( 'originalClass' ) + ' aw-current' );
	}

	AW.PageTransitions = PageTransitions;
})();

*/