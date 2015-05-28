/**
 * Id生成器
 * 
 */
var GlobalId={
	GlobalId:0,
	getGlobalId:function(){
		return ++this.GlobalId;
	}
};


/**
 * 获取一个对象的属性数量
 * @param {} obj
 * @returns {} 
 */
function getObjProCount(obj){
	if(!obj)
		return;
	var count = 0;
	for(var i in obj){
		if(obj.hasOwnProperty(i))
			count++;
	}
	return count;
}
!function($){
	var AWModal = function(ele,options){
		this.options = options;
		this.ele = ele;
		this.$ele = $(ele);
		this.init();
	};
	
	AWModal.VERSION = '1.0';
	AWModal.DEFAULT = {
		width:300,
		height:300
	};
	
	/**
	 * 初始化，给div设置data-id
	 */
	AWModal.prototype.init = function(){
		var me = this;
		var winLst = me.ele;
		for(var i = 0,winLen = winLst.length; i < winLen; i++){
			$(winLst[i]).attr('data-id','awwindow'+GlobalId.getGlobalId());
		}
		$(me).addClass('AWModal-ready');
	};
	
	/***
	 * 激活对话框
	 * winId表示，data-id的值
	 * @param winId
	 */
	AWModal.prototype.active = function(winId){
		
	};
	
	/**
	 * 取消激活
	 * winId表示，data-id的值
	 * @param winId
	 */
	AWModal.prototype.deactive = function(winId){
		$("div[data-id='"+winId+"']").removeClass('AWModal-pop-animate');
	};
	
	
	/**
	 * 打开AWModal
	 * @param obj
	 */
	AWModal.prototype.AWOpen = function(obj,options){
		if(!obj)
			return;
		var target = $.extend(options,AWModal.DEFAULT);
		var winId = $(obj).attr('data-id');
		for(name in options){
			$(obj).css(name,options[name]);
		}
		this.open(winId);
	};
	
	
	AWModal.prototype.open = function(winId){
		var len = $PageHandle.history.length;
		if(len < 1 ){
			var dialog = [];
			dialog.push(winId);
			var item = {};
			item.dialog = dialog;
			$PageHandle.history.push(item);
		}else{
			var dialog = $PageHandle.history[len-1].dialog;
			dialog.push(winId);
			$PageHandle.history[len-1].dialog = dialog;
		}
		len = $PageHandle.history.length;
		if($PageHandle.history[len-1].dialog.length == 1){
			$('#page_'+$PageHandle.history[len-1].pageId).addClass('AWModal-active');
		}
	
		this.addClass($("div[data-id="+winId+"]"),'AWModal-pop-animate');
		this.active(winId);
	};
	
	/**
	 * 关闭对话框
	 * @param obj
	 */
	AWModal.prototype.AWClose = function(obj){
		if(!obj)
			return;
		var winId = $(obj).attr('data-id');
		var len = $PageHandle.history.length;
		$PageHandle.history[len-1].dialog.pop();
		if($PageHandle.history[len-1].dialog.length == 0){
			$('#page_'+$PageHandle.history[len-1].pageId).removeClass('AWModal-active');
		}
		this.deactive(winId);
	};
	
	/**
	 * 添加class
	 * @param element
	 * @param name
	 */
	AWModal.prototype.addClass = function(element,name){
		element.addClass(name);
	};
	
	/**
	 * 删除class
	 * @param element
	 * @param name
	 */
	AWModal.prototype.removeClass = function(element,name){
		element.removeClass(name);
	};
	
	
	function Plugin(option,_relatedTarget){
		var $this = $(this),
		data = $this.data('bs.awwin'),
		options = $.extend(true, {}, AWModal.DEFAULT, $this.data(), options);
		if (!data) $this.data('bs.awwin', (data = new AWModal(this, options)));
      	if (typeof option == 'string'){
      		return data[option]($this,options);
      	}
	}
		
	$.fn.awwin = Plugin;
	$.fn.awwin.constructor = AWModal;
}(jQuery);