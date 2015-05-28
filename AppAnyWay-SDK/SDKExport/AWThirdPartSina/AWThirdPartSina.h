//
//  AWThirdPartSina.h
//  AppAnyWay
//
//  Created by Jelly on 14-12-21.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//
/*
 *1.http://open.weibo.com创建新浪微博移动应用，申请app key
 *2.ImageIO.framework添加到工程中,target-Build Phrases选项，点击Link Binary with Libraries下的“+”添加
 *  额外添加代码：
 *1.在AppDelegate中 #import "WeiboSDK.h" #import "AWThirdPartSina.h"
 *2.- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
 *  中添加代码:
 *    NSString *sinaAppKey = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"sinaWeibo_appKey"];
 *    [WeiboSDK enableDebugMode:YES];
 *    [WeiboSDK registerApp:sinaAppKey];
 *3.target-info-URL Types中添加一条url, Identifier为com.weibo, URL Schemes为wb****(****既为申请的app key)
 *4.在- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url
 *  和- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
 *  中均添加代码:
 *   NSString *scheme = [url scheme];
 *   NSString *sinaAppKey = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"sinaWeibo_appKey"];
 *   if ( [scheme isEqualToString:[NSString stringWithFormat:@"wb%@", sinaAppKey]] ) {
 *      ViewController *controller = [[ViewController alloc] init];
 *      return [WeiboSDK handleOpenURL:url delegate:[AWThirdPartSina getInstance:controller delegate:controller]];
 *   }
 *5.在config.plist文件中添加sinaWeibo_appKey、sinaWeiBo_uri的值
 */

#import "AWBaseClass.h"
#import "WeiboSDK.h"

@interface AWThirdPartSina : AWBaseClass<WeiboSDKDelegate>

@end
