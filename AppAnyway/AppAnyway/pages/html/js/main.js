var baseUrl = "http://www.appanyway.com";

window.onload = function(){
	AW.changePage('menuHome');
	bindEvent();
	document.addEventListener('touchmove', function(event) {
        var current = AW.pageTransitions.current;
        if($('.aw-'+current).find('#mainct').css('left') == '220px'){
            event.preventDefault();
        }
    });
}

function bindEvent(){
	$('.aw').on("click",function(e){
		var e = e || window.event;    
		var target = e.srcElement || e.target;
		var wrapPage = e.currentTarget.firstChild;
		var mainct = $(wrapPage).find('#mainct');
		if(target.tagName === 'IMG' && target.className === 'tomenu'){	
			//该事件为左上角菜单
			$(wrapPage).find('#main_menu').css('height',mainct.css('height')); 
			$(wrapPage).find('#main_menu').css({'height':window.innerHeight + 'px','display':'block'}); 
			if(mainct.css('left') === '0px'){
				mainct.animate({left:220},"fast",function(){
					$(wrapPage).find('#main_menu').css('display','block');
				});
			}else{
				mainct.animate({left:0},"fast",function(){
					$(wrapPage).find('#main_menu').css('display','none');
				});
			}
		}else if(target.tagName === 'H4' && target.className === 'evefnh'){
			//该事件为下拉菜单事件
			var linum = $(".licont").index($(target).next());
			var $liarr = $(".licont");
			for(var i = 0;i < $liarr.length;i ++){
				if(i != linum){
					$liarr[i].style.display = 'none';
					$liarr[i].parentNode.children[0].style.backgroundImage = 'url(image/open.png)';
				}
			}
			$(target).next().toggle("fast");
			if($(target).next().css('height') === '1px'){
				$(target).css('background-image','url(image/close.png)');
			}else{
				$(target).css('background-image','url(image/open.png)');
			}
		}else{
			if(mainct.css('left') !== '0px'){
				mainct.animate({left:0},"fast",function(){
					$(wrapPage).find('#main_menu').css('display','none');
				});
			}
		}
		//e.stopPropagation();
	});
}

function changePage(pageId){
	/**
	var mainct = $('#mainct');
	if(mainct.css('left') !== '0px'){
		mainct.animate({left:0},"fast",function(){
			$('#main_menu').css('display','none');
			AW.changePage(pageId);
		});
	}
	*/
	
	AW.changePage(pageId);
	
}
