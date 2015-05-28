//
//  AWThirdPartWX.h
//  AppAnyWay
//
//  Created by Jelly on 14-12-17.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//
/*1.https://open.weixin.qq.com创建微信移动应用，申请app key
 *2.libstdc++6.0.9.dylib、libsqlite3.dylib、libz1.2.5.dylib这几个framework添加到工程中
 *  target-Build Phrases选项，点击Link Binary with Libraries下的“+”逐个添加
 *  额外添加代码：
 *1.在AppDelegate中#import "WXApi.h" #import "AWThirdPartWX.h"
 *2.- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
 *  中添加代码:
 *  NSString *wxAppKey = @"****";//申请的app key
 *  [WXApi registerApp:wxAppKey];
 *3.target-info-URL Types中添加一条url, Identifier为wx, URL Schemes为wx****(****既为申请的app key)
 *4.在- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
 *  中均添加代码:
 *   NSString *scheme = [url scheme];
 *   NSString *wxAppKey = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"wx_appKey"];
 *   if ( [scheme isEqualToString:wxAppKey] ) {
 *      return [WXApi handleOpenURL:url delegate:[AWThirdPartWX getInstance]];
 *   }
 *5.在config.plist文件中添加wx_appKey的值
 */


#import "AWBaseClass.h"

@interface AWThirdPartWX : AWBaseClass
 
@end
