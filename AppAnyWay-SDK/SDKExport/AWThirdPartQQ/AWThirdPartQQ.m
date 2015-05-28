//
//  AWThirdPartQQ.m
//  AppAnyWay
//
//  Created by Jelly on 14-12-24.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//

#import "AWThirdPartQQ.h"
#import "AWPublicClassForiOS.h"
#import <TencentOpenAPI/TencentApiInterface.h> 
#import <TencentOpenAPI/QQApiInterface.h>

@interface AWThirdPartQQ()<
                           TencentSessionDelegate
                          ,QQApiInterfaceDelegate
                          >
{
    TencentOAuth *_tencentOAuth;
}
@end

@implementation AWThirdPartQQ
/**
 * 登录
 * @param  param:参数字典集，空
 */
-(void)login:(NSDictionary *)param
{
    NSArray  *_permissions = [NSArray arrayWithObjects:@"get_user_info", @"get_simple_userinfo", @"add_t", nil];
    NSString *appKey = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"tx_appKey"];
    
    _tencentOAuth = [[TencentOAuth alloc] initWithAppId:appKey andDelegate:self];
    BOOL inSafari = [TencentOAuth iphoneQQInstalled] ? NO : YES;
    [_tencentOAuth authorize:_permissions inSafari:inSafari];
}

/**
 * 分享到空间、qq好友
 * @param  param:参数字典集，包括type:分享类型，qzone空间，qq好友
 *                            url:分享链接
 *                            imageUrl:图片地址
 *                            title:标题
 *                            description:内容
 */
-(void)shareMsg:(NSDictionary *)param
{    
    NSString *type     = param[@"type"];
    NSString *pageUrl  = param[@"url"];
    NSString *imageUrl = param[@"imageUrl"];
    NSString *title    = param[@"title"];
    NSString *description = param[@"description"];
    
    NSString *appKey = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"tx_appKey"];
    
    _tencentOAuth = [[TencentOAuth alloc] initWithAppId:appKey andDelegate:self];
    
    QQApiNewsObject *newsObj = [QQApiNewsObject objectWithURL:[NSURL URLWithString:pageUrl]
                                                        title:title
                                                  description:description
                                              previewImageURL:[NSURL URLWithString:imageUrl]];
    
    SendMessageToQQReq  *req  = [SendMessageToQQReq reqWithContent:newsObj];
    QQApiSendResultCode resultCode = 0;
    if ( [type isEqualToString:@"qq"] ) {
       resultCode = [QQApiInterface sendReq:req];
    }else if ( [type isEqualToString:@"qzone"] ) {
       resultCode = [QQApiInterface SendReqToQZone:req];
    }
    if ( resultCode == 0 || resultCode == EQQAPIAPPSHAREASYNC ) {
        _resultDic[@"result"] = @YES;
        [self.delegate callBackDelegate:_resultDic error:nil];
    }else{
        NSString *error;
        switch ( resultCode ) {
            case EQQAPIAPPNOTREGISTED:
            {
                error = @"1601";
                break;
            }
            case EQQAPIMESSAGECONTENTINVALID:
            case EQQAPIMESSAGECONTENTNULL:
            case EQQAPIMESSAGETYPEINVALID:
            {
                error = @"1602";
                break;
            }
            case EQQAPIQQNOTINSTALLED:
            {
                error = @"1603";
                break;
            }
            case EQQAPIQQNOTSUPPORTAPI:
            {
                error = @"1604";
                break;
            }
            case EQQAPISENDFAILD:
            {
                error = @"1605";
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
    
}

#pragma  mark QQApiInterfaceDelegate
/**
 处理来至QQ的请求
 */
- (void)onReq:(QQBaseReq *)req
{
    if( [req isKindOfClass:[SendMessageToQQReq class]] ){
        NSString *strMsg = [NSString stringWithFormat:@"qq发送消息结果:%d", req.type];
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"err" message:strMsg
                                                       delegate:nil
                                              cancelButtonTitle:@"确定"
                                              otherButtonTitles: nil];
        [alert show];
        
    }else if( [req isKindOfClass:[SendMessageToQQResp class] ] ){
        NSString *strMsg = [NSString stringWithFormat:@"qq 响应结果:%d", req.type];
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"err" message:strMsg
                                                       delegate:nil
                                              cancelButtonTitle:@"确定"
                                              otherButtonTitles: nil];
        [alert show];
        
    }
}

/**
 处理来至QQ的响应
 */
 -(void)onResp:(QQBaseResp *)resp
 {
     if( [resp isKindOfClass:[SendMessageToQQReq class]] ){
         NSString *strMsg = [NSString stringWithFormat:@"qq发送消息结果:%@", resp.result];
         UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"err" message:strMsg
                                                        delegate:nil
                                               cancelButtonTitle:@"确定"
                                               otherButtonTitles: nil];
         [alert show];
         
     }else if( [resp isKindOfClass:[SendMessageToQQResp class] ] ){
         NSString *strMsg = [NSString stringWithFormat:@"qq 响应结果:%@", resp.result];
         UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"err" message:strMsg
                                                        delegate:nil
                                               cancelButtonTitle:@"确定"
                                               otherButtonTitles: nil];
         [alert show];

     }
 }

/**
 处理QQ在线状态的回调
 */
- (void)isOnlineResponse:(NSDictionary *)response
{
    
}

- (void)handleSendResult:(QQApiSendResultCode)sendResult
{
    NSString *error;
    switch (sendResult) {
        case EQQAPIAPPNOTREGISTED: {
            error = @"1601";
            break;
        }
        case EQQAPIMESSAGECONTENTINVALID:
        case EQQAPIMESSAGECONTENTNULL:
        case EQQAPIMESSAGETYPEINVALID: {
            error = @"1602";
            break;
        }
        case EQQAPIQQNOTINSTALLED: {
            error = @"1603";
            break;
        }
        case EQQAPIQQNOTSUPPORTAPI: {
            error = @"1604";
            break;
        }
        case EQQAPISENDFAILD: {
            error = @"1605";
            break;
        }
        default: {
            error = @"0001";
            break;
        }
    }
    [self.delegate callBackDelegate:_resultDic error:error];
}

-(void)tencentDidLogout
{
 //   [_resultDic setValue:@"退出登录成功，请重新登录" forKey:@"result"];
 //   [self.delegate callBackDelegate:_resultDic error:nil];
}

-(void)tencentDidLogin
{
    if (_tencentOAuth.accessToken && 0 != [_tencentOAuth.accessToken length]) {
        if( ![ _tencentOAuth getUserInfo] ){
            [self.delegate callBackDelegate:_resultDic error:@"1606"];
        }
    }else {
        [self.delegate callBackDelegate:_resultDic error:@"1607"];
    }
}

-(void)tencentDidNotLogin:(BOOL)cancelled
{
    NSString *error;
    if (cancelled){
        error = @"1608";
    }else {
        error = @"1609";
    }
    [self.delegate callBackDelegate:_resultDic error:error];
}

-(void)tencentDidNotNetWork
{
    [self.delegate callBackDelegate:_resultDic error:@"1610"];
}

/**
 * Called when the get_user_info has response.
 */
- (void)getUserInfoResponse:(APIResponse*) response {
    if (response.retCode == URLREQUEST_SUCCEED)
    {
        NSMutableString *str=[NSMutableString stringWithFormat:@""];
        for (id key in response.jsonResponse) {
            [str appendString: [NSString stringWithFormat:@"%@:%@\n",key,response.jsonResponse[key]]];
        }
        
        NSString *userName = response.jsonResponse[@"nickname"];
        NSDictionary *result = [[NSDictionary alloc] initWithObjectsAndKeys: userName, @"userName", _tencentOAuth.accessToken, @"accessToken", nil];
        _resultDic[@"result"] = result;
        [self.delegate callBackDelegate:_resultDic error:nil];
        
    }else{
        
        [self.delegate callBackDelegate:_resultDic error:@"1610"];
        
    }
    
}
/**
 *当第三方应用调用某个API接口时，如果服务器返回操作未被授权，则会触发增量授权逻辑。
 *第三方应用需自行实现tencentNeedPerformIncrAuth:withPermissions:协议接口才能够进入增量授权逻辑，
 *否则默认第三方应用放弃增量授权。
 */
- (BOOL)tencentNeedPerformIncrAuth:(TencentOAuth *)tencentOAuth
                   withPermissions:(NSArray *)permissions
{
    // incrAuthWithPermissions是增量授权时需要调用的登录接口
    // permissions是需要增量授权的权限列表
    [_tencentOAuth incrAuthWithPermissions:permissions];
    return NO; // 返回NO表明不需要再回传未授权API接口的原始请求结果；
    // 否则可以返回YES
}

- (void)tencentDidUpdate:(TencentOAuth *)tencentOAuth
{
    if (tencentOAuth.accessToken && 0 != [tencentOAuth.accessToken length]){
        // 在这里第三方应用需要更新自己维护的token及有效期限等信息
        // **务必在这里检查用户的openid是否有变更，变更需重新拉取用户的资料等信息**
      //  [_resultDic setValue:@"增量授权成功"  forKey:@"result"];
      //  [self.delegate callBackDelegate:_resultDic error:nil];
        [ _tencentOAuth getUserInfo];
        
    }else{
        
        [self.delegate callBackDelegate:_resultDic error:@"1611"];
    }
}
//增量授权失败时，会通过tencentFailedUpdate:协议接口通知第三方应用：

- (void)tencentFailedUpdate:(UpdateFailType)reason
{
    NSString *error;
    switch (reason)
    {
        case kUpdateFailNetwork:
        {
           error = @"1610";
            break;
        }
        case kUpdateFailUserCancel:
        {
            error = @"1612";
            break;
        }
        case kUpdateFailUnknown:
        default:
        {
            error = @"0001";
            break;
        }
    }
    
    [self.delegate callBackDelegate:_resultDic error:error];
}

/*
 -(id)init
{
    
    self = [super init];
    NSString *appKey = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"tx_appKey"];
    
    _tencentOAuth = [[TencentOAuth alloc] initWithAppId:appKey andDelegate:self];
    return self;
}
 */
@end
