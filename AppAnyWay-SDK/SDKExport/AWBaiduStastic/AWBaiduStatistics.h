//
//  AWBaiduStastic.h
//  AppAnyWay
//
//  Created by Jelly on 14-12-19.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//

#import <UIKit/UIKit.h>

/*
 *1.http://mtj.baidu.com 创建百度统计移动应用，得到app key，channelID
 *2.CoreTelephony.framework添加到工程中
 *  target-Build Phrases选项，点击Link Binary with Libraries下的“+”逐个添加
 *3.在AppDelegate中#import "AWBaiduStatistics.h"
 *4.- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
 *  中添加代码:
 *  [AWBaiduStatistics startBDStat];
 *4.在config.plist文件中添加baiduStatistics_appKey、baiduStatistics_channelID的值
 */

@interface AWBaiduStatistics : NSObject

+(void)startBDStat;
@end
