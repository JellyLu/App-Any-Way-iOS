/**
 * AppAW页面系统配置选项
 * 此部分内容，用户不需要修改
 */
var pageConfig = {
	"layerPage":{
	},
	"pages":{
		
	}
}


/**
 * AppAW页面用户配置选项
 */
/*******************提示************************
 * userConfig为用户需要配置的内容，以下是对各部分的说明
 * homePage:为第一个要加载的页面
 * transitionMode：为页面切换模式
 * 		目前已有的页面切换模式有：slide与fade，
 *		slide是左右滑动，选择slide则在transitionMode写1（其中2代表回退的效果）
 * 		fade是淡入淡出，选择slide则在transitionMode写3（其中4表示淡出的效果）
 * pages：APP内所有页面的配置
 * 	其中:layer为页面所在的层
 * autoSave：是否自动保存页面到手机(一般，层级较高的页面可以保存到手机写true，层级较低的页面可以不保存写false);
 * AWHeader：如果页面中有标题，那么需要在此配置标题header的Id
 * AWFooter：如果页面中有footer，那么需要在此配置底部footer的Id
 *********************************************/
 
var userConfig = {
	"homePage":"home",
	"transitionMode":1,
	"pages":{
		'function':{"layer":1,"autoSave":true},
		'home':{"layer":1,"autoSave":true},
		'home1':{"layer":1,"autoSave":true},
		'appInfo':{"layer":2,"autoSave":true},
		'alipay':{"layer":2,"autoSave":true},
		'audioPlayer':{"layer":2,"autoSave":false},
		'audioRecorder':{"layer":2,"autoSave":false},
		'beep':{"layer":2,"autoSave":true},
		'deviceInfo':{"layer":2,"autoSave":true},
		'fileSystem':{"layer":2,"autoSave":true},
		'info':{"layer":3,"autoSave":true},
		'linkMan':{"layer":2,"autoSave":false},
		'localResource':{"layer":2,"autoSave":true},
		'location':{"layer":2,"autoSave":true},
		'manage':{"layer":2,"autoSave":true},
		'message':{"layer":2,"autoSave":false},
		'netWork':{"layer":2,"autoSave":true},
		'photo':{"layer":2,"autoSave":true},
		'publicClass':{"layer":2,"autoSave":true},
		'scan':{"layer":2,"autoSave":false},
		'shake':{"layer":2,"autoSave":true},
		'vibrate':{"layer":2,"autoSave":true},
		'video':{"layer":2,"autoSave":true},
		'info1':{"layer":2,"autoSave":true},
		'info2':{"layer":2,"autoSave":true},
		'info3':{"layer":2,"autoSave":true},
		'info4':{"layer":2,"autoSave":true},
		'info5':{"layer":2,"autoSave":true},
		'info6':{"layer":2,"autoSave":true},
		'info7':{"layer":2,"autoSave":true},
		'info8':{"layer":2,"autoSave":true},
		'info9':{"layer":2,"autoSave":true},
		'info10':{"layer":2,"autoSave":true}
	}
}