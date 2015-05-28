/**
 * android 交互
 */

// 获取系统名
function getSystemName() {
	return "android";
}

// 应用软件交互
function invokeMethod(param) {
	return window.android.invokeMethod(JSON.stringify(param));
}
