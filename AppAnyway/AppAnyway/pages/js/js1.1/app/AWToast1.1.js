/**
 *toast消息提示框
 *默认属性：
 *  time-显示时间：时间格式是毫秒，1000表示1s
 *  content-显示内容:文本
 *  cssTheme-CSS样式：default\primary\caution\highlight
 *  position-位置:属性设置toast的位置
 *      其中复合属性类似margin-left需要写成marginLeft
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
	
	AW.AWToast = AWToast;
}());
