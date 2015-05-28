//
//  AWBaiduStastic.m
//  AppAnyWay
//
//  Created by Jelly on 14-12-19.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//

#import "AWBaiduStatistics.h"
//baidu统计
#import "BaiduMobStat.h"

#import "AWPublicClassForiOS.h"

@implementation AWBaiduStatistics
/**
 * 统计
 */
+(void)startBDStat
{
    NSString     *appKey    = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"baiduStatistics_appKey"];
    NSString     *channelId = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"baiduStatistics_channelID"];
    
    if ( !appKey || [appKey isEqualToString:@""] ) {
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"提示" message:@"百度统计app key,不能为空" delegate:nil cancelButtonTitle:@"确定" otherButtonTitles: nil];
        [alert show];
        
        return;
    }else if ( !channelId || [channelId isEqualToString:@""] ){
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"提示" message:@"百度统计channelID,不能为空" delegate:nil cancelButtonTitle:@"确定" otherButtonTitles: nil];
        [alert show];
        return;
    }
    
    //百度统计-启动功能
    BaiduMobStat* statTracker = [BaiduMobStat defaultStat];
    statTracker.enableExceptionLog = NO;
    statTracker.channelId = channelId;  
    statTracker.logStrategy = BaiduMobStatLogStrategyCustom;
    statTracker.logSendInterval = 1;
    statTracker.logSendWifiOnly = YES;
    statTracker.sessionResumeInterval =  60;
    NSString *baiduStasticKey = appKey;
    [statTracker startWithAppId:baiduStasticKey];
}

@end
