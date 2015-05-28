var startX = endX = 0;
var startY = endY = 0;

function handleTouchEvent(event) {
        switch (event.type) {
            case "touchstart":
                startX = event.touches[0].clientX;
				startY = event.touches[0].clientY;
                break;
            case "touchend":
                endX = event.changedTouches[0].clientX;
				endY = event.changedTouches[0].clientY;
				countDire();
                break;
            case "touchmove":
            	endX = event.changedTouches[0].clientX;
				endY = event.changedTouches[0].clientY;
            	//判定滑动方向
            	if(!upDown()){
            		event.preventDefault(); //阻止滑动事件
            	}
				break;
			default:break;
        }
}

/**
 * 判断移动方向
 * @returns {} 
 */
function upDown(){
	if(Math.abs(startX - endX) < Math.abs(startY - endY))
		return true;
}


function countDire(){
	if(Math.abs(startX - endX) > 100){
		if(startX < endX){
			//回退
			startX = endX =0;
			startY = endY =0;
			$PageHandler.pageBack();
		}else{
			//新页面
			//PageTransitions.nextPage(1);
		}
	}
}


document.addEventListener("touchstart", handleTouchEvent, false);
document.addEventListener("touchend", handleTouchEvent, false);
document.addEventListener("touchmove", handleTouchEvent, false);