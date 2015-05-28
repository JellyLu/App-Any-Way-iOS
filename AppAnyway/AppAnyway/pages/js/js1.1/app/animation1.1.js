(function(){
	var AWAnimation = function(){
		var me = this;
		me.movingFlag = false;
		me.current = 0;
		me.awPages = document.getElementsByClassName('aw');
		me.pageLen = me.awPages.length;
		me.init();
	}
	
	AWAnimation.prototype.init = function(){
		var me = this;
		document.getElementById('aw-ct').style.height = window.innerHeight;
		document.getElementById('aw-ct').style.width =  window.innerWidth;
		
		for(var i = 0; i < me.pageLen;i++){
			me.awPages[i].setAttribute("originalClass", me.awPages[i].getAttribute('class'));
			me.awPages[i].style.height = window.innerHeight;
		}
		//animationend
		//webkitAnimationEnd
		document.getElementById('page0').addEventListener('webkitAnimationEnd',function(){
			me.movingFlag = false;
			me.setCurrent();
		});
	}
	
	AWAnimation.prototype.awMovePage = function(animation){
		var me = this;
		if(me.movingFlag){
			return;
		}
		me.movingFlag = true;
		var currentPage = document.getElementById('page'+me.current);
		var next = me.current == 1 ? 0 : 1;
		var nextPage = document.getElementById('page'+next);
		var outClass = "";
		var inClass = "";	
		
		currentPage.setAttribute('class',currentPage.getAttribute('originalClass'));
		nextPage.setAttribute('class',nextPage.getAttribute('originalClass'));
		
		switch(animation){
			case 1://left 
				currentPage.style.left = 0;
				nextPage.style.left = '100%';
				outClass = ' aw-moveToLeft';
				inClass = ' aw-moveFromRight'
				break;
			case 2://right
				currentPage.style.left = 0;
				nextPage.style.left = '-100%';
				outClass = ' aw-moveToRight';
				inClass = ' aw-moveFromLeft ';	
			break;
			case 3://leftFade
				currentPage.style.left = 0;
				nextPage.style.left = '100%';
				outClass = ' aw-moveToLeftFade';
				inClass = ' aw-moveFromRightFade'
				break;
			case 4://rightFade
				currentPage.style.left = 0;
				nextPage.style.left = '-100%';
				outClass = ' aw-moveToRightFade';
				inClass = ' aw-moveFromLeftFade'
				break;
		}
		currentPage.setAttribute('class',currentPage.getAttribute('originalClass') + outClass);
		nextPage.setAttribute('class',nextPage.getAttribute('originalClass') + inClass);
		
		switch(animation){
			case 1:
				currentPage.style.left = '100%';
				nextPage.style.left = 0;
				break;
			case 2:
				currentPage.style.left = '-100%';
				nextPage.style.left = 0;
				break;
			case 3:
				currentPage.style.left = '-100%';
				nextPage.style.left = 0;
				break;
			case 4:
				currentPage.style.left = '100%';
				nextPage.style.left = 0;
				break;
		}
	}
	
	AWAnimation.prototype.setCurrent = function(){
		var me = this;
		if(me.current < me.pageLen - 1){
			++me.current;
		}else{
			me.current = 0;
		}
	}
	
	AW.AWAnimation = AWAnimation;
}())