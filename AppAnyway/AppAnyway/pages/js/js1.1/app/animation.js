(function(){
	var PageTransitions = function(){
		var me = this;
		me.current = 0;
		me.next = 1;
		me.movingFlag = false;
		me.page = document.getElementsByClassName('aw');
		me.pageLen = me.page.length;
		me.init();
	}
	
	PageTransitions.prototype.init = function(){
		var me = this;
		document.getElementById('aw-ct').style.height = window.innerHeight;
		document.getElementById('aw-ct').style.width =  window.innerWidth;
		
		for(var i = 0, len = me.page.length; i < len;i++){
			me.page[i].setAttribute("originalClass", me.page[i].getAttribute('class'));
			me.page[i].style.height = window.innerHeight;
		}
		//animationend
		//webkitAnimationEnd
		document.getElementById('page0').addEventListener('animationend',function(){
			me.movingFlag = false;
		});
	}
	
	PageTransitions.prototype.moveleft = function(){
		var me = this;
		if(me.movingFlag)
			return;
		me.movingFlag = true;
		
		me.changeCurrent();
		
		for(var i = 0;i < 2; i++){
			var p = me.page[i];
			var left = p.offsetLeft;
			if(left<0){
				p.style.left = '100%';
				me.move(p,2);
			}else if(left>0){
				me.move(p,2);
			}else{
				me.move(p,1);
			}
				
		}
	}
	
	PageTransitions.prototype.moveright = function(){
		var me = this;
		if(me.movingFlag)
			return;
		me.movingFlag = true;
		me.changeCurrent();
		for(var i = 0;i < 2; i++){
			var p = me.page[i];
			var left = p.offsetLeft;
			if(left>0){
				p.style.left = '-100%';
				me.move(p,3)
			}else if(left<0){
				me.move(p,3);
			}else
				me.move(p,4);
		}
	}
	
	PageTransitions.prototype.move = function(ele,index){
		var left = ele.offsetLeft;
		ele.setAttribute('class',ele.getAttribute('originalClass') + ' move' + index);
		if(index<2){ //左
			if(left===0)
				ele.style.left = '-100%';
			else
				ele.style.left = 0;
		}else{//右
			if(left===0)
				ele.style.left = '100%';
			else
				ele.style.left = 0;
		}
	}	
	
	PageTransitions.prototype.changeCurrent = function(){
		var me = this;	
		if(me.current < me.pageLen - 1){
			++me.current;
		}else{
			me.current = 0;
		}
	}
	
	
	AW.PageTransitions = PageTransitions;
}());