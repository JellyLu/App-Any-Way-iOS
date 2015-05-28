//
//  AWAlipay.h
//  AppAnyWay
//
//  Created by Jelly on 14-12-25.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//
/*
 *1.https://open.alipay.com创建移动快捷支付
 *
 *  额外添加代码：
 *1.在AppDelegate中 #import <AlipaySDK/AlipaySDK.h> #import "AWAlipay.h"
 *2.target-info-URL Types中添加一条url,  URL Schemes为***(****既为与配置文件config.plist中alipay_scheme相同)
 *3.在- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
 *  中均添加代码:
 *  if ([url.host isEqualToString:@"safepay"]) {
 *      [[AlipaySDK defaultService] processOrderWithPaymentResult:url standbyCallback:^(NSDictionary *resultDic) {
 *          [[AWAlipay getInstance] paymentResult:resultDic];
 *      }];
 *  }
 *4.在config.plist文件中Ali下添加alipay_scheme、alipay_privateKey、alipay_partnerId、alipay_sellerId的值
 */
#import "AWBaseClass.h"
 
@interface AWAlipay : AWBaseClass 
 
-(void)paymentResult:(NSDictionary *)result;
@end
