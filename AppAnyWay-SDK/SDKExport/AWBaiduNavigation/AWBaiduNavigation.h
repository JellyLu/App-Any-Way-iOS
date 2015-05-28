//
//  AWBaiduNavigation.h
//  AppAnyWay
//
//  Created by Jelly on 14-12-19.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//
/*
 *1.http://lbsyun.baidu.com/apiconsole/key  创建百度移动应用，得到app key 
 *2.将app key填写到config.phlist中对应的值中 baiduNavi_appKey
 *3.ImageIO.framework、CoreTelephony.framework、AVFoundation.framework、libstdc++6.0.9.dylib这几个framework添加到工程中
 *  target-Build Phrases选项，点击Link Binary with Libraries下的“+”逐个添加
 *4.target-Build Setting-Linking- other linking flag-  添加 －ObjC
 * 
 *  额外添加代码：
 *1.在AppDelegate中#import "BNCoreServices.h"  #import "AWBaiduNavigation.h"
 *2.- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
 *  中添加代码:
 *   NSString *baiduNaviAppKey = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"baiduNavi_appKey"];
 *   [BNCoreServices_Instance initServices:baiduNaviAppKey];
 *   [BNCoreServices_Instance startServicesAsyn:nil fail:nil]; 
 *3.在config.plist文件中添加baiduNavi_appKey的值
 */
 

#import "AWBaseClass.h"

@interface AWBaiduNavigation : AWBaseClass
@end
