/**
 *toast消息提示框
 *默认属性：
 *time-显示时间：时间格式是毫秒，1000表示1s
 *  content-显示内容:文本
 *  cssTheme-CSS样式：default\primary\caution\highlight
 *  position-位置:属性设置toast的位置
 *      其中复合属性类似margin-left需要写成marginLeft
 * 
 */
var AWToast = (function () {
    /**
	 * 默认配置
	 */
	'use strict'
	var defaultConfig = {
		time : 3000,
		content : "显示",
		cssTheme : "default",
		position : {
			position : 'relactive',
			marginTop : '50px'
		}
	};
	
	var toastQueue = new Array();			//消息样式 数组
	var configQueue = new Array();			//参数样式数组，每个消息对应一个参数配置对象
	var signal = 1;							//标志
	function initConfig(config,defaultCon){
		var key;
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
	 * 组件
	 * @param {} config
	 * @returns {} 
	 */
	function initToast(config){
		config = initConfig(config,defaultConfig);
		var toastDiv = $("<div class='AWToast'><div class='AWMsg'>"+config.content+"</div></div>").appendTo($('body'));
		toastDiv.find('.AWMsg').addClass(config.cssTheme);
		toastDiv.find('.AWMsg').addClass("glow-"+config.cssTheme);
		for(var key in config.position){
			toastDiv.css(key,config.position[key]);
		}
		toastQueue.push(toastDiv);
		configQueue.push(config);
		triggerShow();
	}
	
	/**
	 * 显示
	 * @param {} config
	 * @returns {} 
	 */
	function show(config){
		initToast(config);
	}
	
	
	/**
	 * 触发显示
	 * @returns {} 
	 */
	function triggerShow(){
		if(signal && toastQueue.length){
			var config = configQueue.splice(0,1)[0];
			var toastDiv = toastQueue.splice(0,1)[0];
			signal = 0;
			toastDiv.fadeIn().delay(config.time).fadeOut("slow",
				function(){
					signal = 1;
					toastDiv.remove();
					triggerShow();			//触发下一次显示
			});
		}
	}
	
	return{
		show:show
	}
})();