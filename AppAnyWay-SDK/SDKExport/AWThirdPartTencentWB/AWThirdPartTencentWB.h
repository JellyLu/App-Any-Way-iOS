//
//  AWThirdPartTencentWB.h
//  AppAnyWay
//
//  Created by Jelly on 14-12-22.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//
/*
 *  额外添加代码：
 *1.在AppDelegate中 #import "WeiboApi.h"
 *2.target-info-URL Types中添加一条url, Identifier为tencent, URL Schemes为wb****(****既为申请的app key)
 *3.在- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url
 *  和- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
 *  中均添加代码:
 *   NSString *scheme = [url scheme];
 *   NSString *txwbAppKey = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"txwb_appKey"];
 *   NSString *txwbSecret = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"txwb_secret"];
 *   NSString *txwbUri    = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"txwb_uri"];
 *   WeiboApi *wbApi = [[WeiboApi alloc] initWithAppKey:txwbAppKey andSecret:txwbSecret andRedirectUri:txwbUri];
 *   if ( [scheme isEqualToString:[NSString stringWithFormat:@"wb%@", txwbAppKey]] ) {
 *      return [wbApi handleOpenURL:url];
 *   }
 *4.在config.plist文件中添加txwb_appKey、txwb_secret、txwb_uri的值
 */

#import "AWBaseClass.h"


@interface AWThirdPartTencentWB : AWBaseClass

@end
