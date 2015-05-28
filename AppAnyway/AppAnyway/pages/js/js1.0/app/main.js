/**
 * main.js入口页面
 * changePage参数1为要加载的第一个页面
 * @returns {} 
 */
$(document).ready(function(){	
	var hash = location.hash;
	if(hash){
		AW.moveToPage(hash.substring(1));
	}else{
		AW.changePage('home');
	}
});	