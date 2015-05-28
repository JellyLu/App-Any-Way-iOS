//
//  AWAlipay.m
//  AppAnyWay
//
//  Created by Jelly on 14-12-25.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//

#import "AWAlipay.h"
#import "AWPublicClassForiOS.h"
#import "Order.h"
#import "DataSigner.h"
//alipay
#import <AlipaySDK/AlipaySDK.h>
 
@implementation AWAlipay
/**
 * 支付宝付款
 * @param  param:参数字典集，包括tradeNO:订单编号
 *                            notifyURL:回调url
 *                            productName:商品名称
 *                            price:商品价格
 *                            productDescription:商品描述
 */
-(void)payOrder:(NSDictionary *)param
{
    NSString *orderInfo = [self genOrder:param];
    
    if ( [AWPublicClassForiOS isStringEmpty:orderInfo] ) {
        return ;
    }
    
    NSDictionary *configDic    = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"Ali"];
    NSString     *alipayScheme = configDic[@"alipay_scheme"];
    NSString     *signedStr    = [self doRsa:orderInfo];
    NSString     *orderStr     = [NSString stringWithFormat:@"%@&sign=\"%@\"&sign_type=\"%@\"", orderInfo, signedStr, @"RSA"];
    [[AlipaySDK defaultService] payOrder:orderStr fromScheme:alipayScheme callback:^(NSDictionary *resultDic) {
        [self paymentResult:resultDic];
    }];
    
}

/**
 * 生成订单
 * @param  param:参数字典集，包括tradeNO:订单编号
 *                            notifyURL:回调url
 *                            productName:商品名称
 *                            price:商品价格
 *                            productDescription:商品描述
 */
-(NSString *)genOrder:(NSDictionary *)param
{
    NSString *tradeNO   = param[@"tradeNO"];
    NSString *notifyURL = param[@"notifyURL"]?param[@"notifyURL"]:@"";
    if ( [AWPublicClassForiOS isStringEmpty:tradeNO] ) {
        [self.delegate callBackDelegate:_resultDic error:@"0003"];
        return nil;
    }
    NSString *productName = param[@"productName"];
    if ( [AWPublicClassForiOS isStringEmpty:productName] ) {
        productName = @"";
    }
    
    NSString *price = param[@"price"];
    if ( [AWPublicClassForiOS isStringEmpty:price] ) {
        price = @"0.00";
    }
    
    NSString *productDescription = param[@"productDescription"];
    if ( [AWPublicClassForiOS isStringEmpty:productDescription] ) {
        productDescription = @"";
    }
    
    NSDictionary *configDic = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"Ali"];
    NSString     *partnerId = configDic[@"alipay_partnerId"];
    NSString     *sellerID  = configDic[@"alipay_sellerId"];
    Order        *order     = [[Order alloc] init];
    [order setPartner:partnerId];
    [order setSeller:sellerID];
    [order setTradeNO:tradeNO];//订单编号
    [order setProductName:productName]; //商品标题
    [order setAmount:price]; //商品价格
    [order setNotifyURL:notifyURL]; //回调URL
    [order setProductDescription:productDescription]; //商品描述
    [order setService:@"mobile.securitypay.pay"];
    [order setPaymentType:@"1"];
    [order setInputCharset:@"utf-8"];
    [order setItBPay:@"30m"];
    [order setShowUrl:@"m.alipay.com"];
    
    if ( [AWPublicClassForiOS isStringEmpty:[order description]] ) {
        [self.delegate callBackDelegate:_resultDic error:@"1401"];
        return nil;
    }
    return [order description];
}

/**
 * 加密
 * @param  orderInfo:订单信息
 */
-(NSString*)doRsa:(NSString*)orderInfo
{
    NSDictionary *configDic  = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"Ali"];
    NSString     *privateKey = configDic[@"alipay_privateKey"];
    id<DataSigner> signer  = CreateRSADataSigner(privateKey
                                                 );
    return [signer signString:orderInfo];
}

/**
 * 处理回调信息
 * @param  result:回调信息
 */
-(void)paymentResult:(NSDictionary *)result
{
    if ( result ) {
        NSInteger status = [result[@"resultStatus"] integerValue];
        if ( status == 9000 ) {
            _resultDic[@"result"] = result[@"memo"];
            [self.delegate callBackDelegate:_resultDic error:nil];
        }else{
            
            NSString *error;
            switch ( status ) {
                case 4000:
                {
                    error = @"1402";
                    break;
                }
                case 6001:
                {
                    error = @"1403";
                    break;
                }
                case 6002:
                {
                    error = @"1404";
                    break;
                }
                case 8000:
                {
                    error = @"1405";
                    break;
                }
                default:
                {
                    error = @"0001";
                    break;
                }
                    
            }
            [self.delegate callBackDelegate:_resultDic error:error];
            
        }
    }else{
        [self.delegate callBackDelegate:_resultDic error:@"1401"];
    }
}

@end
