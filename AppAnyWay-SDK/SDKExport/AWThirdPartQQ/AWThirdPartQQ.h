//
//  AWThirdPartQQ.h
//  AppAnyWay
//
//  Created by Jelly on 14-12-24.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//
/*
 *1.http://connect.qq.com创建qq移动应用，申请app key 
 *  额外添加代码：
 *1.在AppDelegate中 #import "AWThirdPartQQ.h"
 *2.target-info-URL Types中添加一条url, Identifier为tencentapi, URL Schemes为tencent****(****既为申请的app key)
 *3.在- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
 *  中均添加代码:
 *   NSString *scheme = [url scheme];
 *   NSString *txAppKey = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"tx_appKey"];
 *   if ( [scheme isEqualToString:[NSString stringWithFormat:@"tencent%@", txAppKey]] ) {
 *      ViewController *controller = [[ViewController alloc] init];
 *      return [QQApiInterface handleOpenURL:url delegate:[AWThirdPartQQ getInstance:controller delegate:controller]];
 *   }
 *4.在config.plist文件中添加tx_appKey的值
 */
#import "AWBaseClass.h"
#import <TencentOpenAPI/TencentOAuth.h>

@interface AWThirdPartQQ : AWBaseClass

@end
