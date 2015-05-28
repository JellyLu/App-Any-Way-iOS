 //===============================
 //	@module android交互
 // @author clx
 // @time 2015-5-11
 //===============================
function invokeMethod(param) {
	return window.android.invokeMethod(JSON.stringify(param));
}