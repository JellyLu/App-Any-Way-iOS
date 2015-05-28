//
//  AppDelegate.m
//  AppAnyway
//
//  Created by luyang on 15/4/27.
//  Copyright (c) 2015年 AppAnyway. All rights reserved.
//

#import "AppDelegate.h"
#import "AWPublicClassForiOS.h"

//微信
#import "WXApi.h"
#import "AWThirdPartWX.h"

//腾讯QQ
#import "AWThirdPartQQ.h"

//新浪微博
#import "WeiboSDK.h"
#import "AWThirdPartSina.h"

//百度统计
#import "AWBaiduStatistics.h"

//百度导航
#import "BNCoreServices.h"

//支付宝alipay
#import <AlipaySDK/AlipaySDK.h>
#import "AWAlipay.h"

NSUInteger DeviceSystemMajorVersion();
NSUInteger DeviceSystemMajorVersion() {
    static NSUInteger _deviceSystemMajorVersion = -1;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _deviceSystemMajorVersion = [[[[[UIDevice currentDevice] systemVersion] componentsSeparatedByString:@"."] objectAtIndex:0] intValue];
        
    });
    return _deviceSystemMajorVersion;
}

#define CurrentVersion  DeviceSystemMajorVersion()
@interface AppDelegate ()

@end

@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    [AWBaiduStatistics startBDStat];
    
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    
    if ( CurrentVersion >= 7 ) {
        self.viewController = [[ViewController alloc] initWithNibName:@"ViewController-ios7" bundle:nil];
    }else{
        self.viewController = [[ViewController alloc] initWithNibName:@"ViewController-ios6" bundle:nil];
    }
    self.window.rootViewController = self.viewController;
    [self.window makeKeyAndVisible];
    
    //target-info中设置View controller-based status bar appearance 为NO
    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleBlackTranslucent];
    
    NSString *wxAppKey = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"wx_appKey"];
    [WXApi registerApp:wxAppKey];
    
    NSString *sinaAppKey = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"sinaWeibo_appKey"];
    [WeiboSDK enableDebugMode:YES];
    [WeiboSDK registerApp:sinaAppKey];

    NSString *baiduNaviAppKey = [AWPublicClassForiOS readPlistFile:@"config"
                                                            forKey:@"baiduNavi_appKey"];
    [BNCoreServices_Instance initServices:baiduNaviAppKey];
    [BNCoreServices_Instance startServicesAsyn:nil fail:nil];
    
    return YES;
}

-(BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
    NSString *scheme = [url scheme];
    
    NSString *wxAppKey = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"wx_appKey"];
    if ( [scheme isEqualToString:wxAppKey] ) {
        return [WXApi handleOpenURL:url delegate:[AWThirdPartWX getInstance]];
    }
    
    NSString *txAppKey = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"tx_appKey"];
    if ( [scheme isEqualToString:[NSString stringWithFormat:@"tencent%@", txAppKey]] ) {
        [TencentOAuth HandleOpenURL:url];
    }
    
    NSString *sinaAppKey = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"sinaWeibo_appKey"];
    if ( [scheme isEqualToString:[NSString stringWithFormat:@"wb%@", sinaAppKey]] ) {
        AWThirdPartSina *sina = [AWThirdPartSina getInstance];
        return [WeiboSDK handleOpenURL:url delegate:sina];
    }
    
    if ([url.host isEqualToString:@"safepay"]) {
        [[AlipaySDK defaultService] processOrderWithPaymentResult:url standbyCallback:^(NSDictionary *resultDic) {
            [[AWAlipay getInstance] paymentResult:resultDic];
        }];
    }
   
    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end
