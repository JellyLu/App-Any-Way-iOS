//
//  AWThirdPartTencentWB.m
//  AppAnyWay
//
//  Created by Jelly on 14-12-22.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//

#import "AWThirdPartTencentWB.h"
#import "AWPublicClassForiOS.h"
#import "JSONKit.h"
#import "WeiboApi.h"
@interface AWThirdPartTencentWB()<
                                              WeiboAuthDelegate
                                             ,WeiboRequestDelegate
                                             >
{
    WeiboApi     *_wbApi;
    BOOL          _isShared;
    NSDictionary *_content;
}
@end

@implementation AWThirdPartTencentWB

-(void)login:(NSDictionary *)param
{
    
    NSString *txwbAppKey = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"txwb_appKey"];
    NSString *txwbSecret = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"txwb_secret"];
    NSString *txwbUri    = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"txwb_uri"];
    
    _wbApi = [[WeiboApi alloc] initWithAppKey:txwbAppKey andSecret:txwbSecret andRedirectUri:txwbUri];
    [_wbApi loginWithDelegate:self andRootController:self.viewController];
 
}

-(void)shareMsg:(NSDictionary *)param
{
    _content = [param copy];
    if ( [_wbApi accessToken] && 0 != [[_wbApi accessToken] length] ) {
        [self sharePageByTXWB];
    }else{
        _isShared = YES;
        [self login:nil];
    }
}

-(void)sharePageByTXWB
{
    NSString *pageUrl      = [_content objectForKey:@"url"];
    NSString *imageUrl     = [_content objectForKey:@"imageUrl"];
    NSString *title        = [_content objectForKey:@"title"];
    NSString *description  = [_content objectForKey:@"description"];
    UIImage  *pic          = [UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:imageUrl]]];
    if ( !pic ) {
        pic = [UIImage imageNamed:@"120x120.png"];
    }
    
    NSString *message = [[NSString alloc] initWithFormat:@"%@ %@ %@", title, description, pageUrl];
    NSMutableDictionary *params = [[NSMutableDictionary alloc]initWithObjectsAndKeys:@"json",@"format",
                                                                                     message, @"content",
                                                                                         pic, @"pic",
                                                                                     nil];
    [_wbApi requestWithParams:params apiName:@"t/add_pic" httpMethod:@"POST" delegate:self];
}

#pragma mark WeiboRequestDelegate
/**
 * @brief   接口调用成功后的回调
 * @param   INPUT   data    接口返回的数据
 * @param   INPUT   request 发起请求时的请求对象，可以用来管理异步请求
 * @return  无返回
 */
-(void)didReceiveRawData:(NSData *)data reqNo:(int)reqno
{
    NSString *result = [[NSString alloc] initWithBytes:[data bytes] length:[data length] encoding:NSUTF8StringEncoding]; 

    NSDictionary *dic =  [data objectFromJSONData];
    if ( dic ) {
        NSString *isTxwbShare = [dic valueForKey:@"msg"];
        if ( [isTxwbShare isEqualToString:@"ok"] ) {
            [_resultDic setValue:[NSNumber numberWithBool:YES] forKey:@"result"];
            [self.delegate callBackDelegate:_resultDic error:nil];
        }
    }
}

/**
 * @brief   接口调用失败后的回调
 * @param   INPUT   error   接口返回的错误信息
 * @param   INPUT   request 发起请求时的请求对象，可以用来管理异步请求
 * @return  无返回
 */
- (void)didFailWithError:(NSError *)error reqNo:(int)reqno
{
    [self.delegate callBackDelegate:_resultDic error:@"1801"];
}

#pragma mark WeiboAuthoDelegate
/**
 * @brief   重刷授权成功后的回调
 * @param   INPUT   wbapi 成功后返回的WeiboApi对象，accesstoken,openid,refreshtoken,expires 等授权信息都在此处返回
 * @return  无返回
 */
-(void)DidAuthRefreshed:(WeiboApi *)wbapi
{
   // NSString *str = [[NSString alloc]initWithFormat:@"accesstoken = %@\r openid = %@\r appkey=%@ \r appsecret=%@\r", wbapi.accessToken, wbapi.openid, wbapi.appKey, wbapi.appSecret];
   // NSLog(@"%@", str );
}

/**
 * @brief   重刷授权失败后的回调
 * @param   INPUT   error   标准出错信息
 * @return  无返回
 */
- (void)DidAuthRefreshFail:(NSError *)error
{
   // NSString *str = [[NSString alloc] initWithFormat:@"refresh token error, errcode = %@",error.userInfo];
   // NSLog(@"%@", str );
    [self.delegate callBackDelegate:_resultDic error:@"1802"];
}

/**
 * @brief   授权成功后的回调
 * @param   INPUT   wbapi 成功后返回的WeiboApi对象，accesstoken,openid,refreshtoken,expires 等授权信息都在此处返回
 * @return  无返回
 */
-(void)DidAuthFinished:(WeiboApi *)wbapi
{
    if ( wbapi.accessToken && 0 != [wbapi.accessToken length] ) {
        _wbApi = wbapi;
        
        if ( _isShared ) {
            
            [self sharePageByTXWB];
            _isShared = NO;
        }else{
            
            NSDictionary *result = [[NSDictionary alloc] initWithObjectsAndKeys:wbapi.accessToken,@"accessToken", wbapi.userNick,@"userName", wbapi.openid,@"openId", nil];
            [_resultDic setValue:result forKey:@"result"];
            [self.delegate callBackDelegate:_resultDic error:nil];
        
        }
    }
}

/**
 * @brief   授权成功后的回调
 * @param   INPUT   wbapi   weiboapi 对象，取消授权后，授权信息会被清空
 * @return  无返回
 */
- (void)DidAuthCanceled:(WeiboApi *)wbapi
{
    
}

/**
 * @brief   授权成功后的回调
 * @param   INPUT   error   标准出错信息
 * @return  无返回
 */
- (void)DidAuthFailWithError:(NSError *)error
{
   // NSString *str = [[NSString alloc] initWithFormat:@"login token error, errcode = %@",error.userInfo];
   // NSLog(@"%@", str );
     [self.delegate callBackDelegate:_resultDic error:@"0001"];
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

@end
