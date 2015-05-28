/**
 * android 交互
 */
// 应用软件交互
function invokeMethod(param) {
	return window.android.invokeMethod(JSON.stringify(param));
}
