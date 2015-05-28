//
//  AWThirdPartSina.m
//  AppAnyWay
//
//  Created by Jelly on 14-12-21.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//

#import "AWThirdPartSina.h"
#import "AWPublicClassForiOS.h"
 

@implementation AWThirdPartSina
/**
 * 登录
 * @param  param:参数字典集，空
 */
-(void)login:(NSDictionary *)param
{
    WBAuthorizeRequest *request = [WBAuthorizeRequest request];
    request.redirectURI =  [AWPublicClassForiOS readPlistFile:@"config" forKey:@"sinaWeiBo_uri"];
    request.scope       =  @"all";
    request.userInfo    =  nil;
    [WeiboSDK sendRequest:request];
}

/**
 * 分享到新浪微博
 * @param  param:参数字典集，包括url:分享链接
 *                            imageUrl:图片地址
 *                            title:标题
 *                            description:内容
 */
-(void)shareMsg:(NSDictionary *)param
{
    NSString *title       = param[@"title"];
    NSString *description = param[@"description"];
    NSString *imageUrl    = param[@"imageUrl"];
    NSString *webpageUrl  = param[@"url"];
    NSURLRequest *request  = [NSURLRequest requestWithURL:[NSURL URLWithString:imageUrl] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:5];
    NSURLResponse *response;
    NSData *imageData =  [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:nil];
    
    WBMessageObject *message = [WBMessageObject message];
    WBWebpageObject *webpage = [WBWebpageObject object];
    [webpage setObjectID:@"identifier"];
    [webpage setTitle:title];
    [webpage setDescription:description];
    [webpage setWebpageUrl:webpageUrl];
    if ( !imageData || [imageData length] > 32768 ) {
        UIImage *image = [UIImage imageNamed:@"120x120.png"];
        [webpage setThumbnailData:UIImagePNGRepresentation( image )];
    }else {
        [webpage setThumbnailData:imageData];
    }
    
    [message setMediaObject:webpage];
    [message setText:title];
    
    WBAuthorizeRequest *authRequest = [WBAuthorizeRequest request];
    authRequest.redirectURI = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"sinaWeiBo_uri"];
    authRequest.scope = @"all";
    
    WBSendMessageToWeiboRequest *wbRequest = [WBSendMessageToWeiboRequest requestWithMessage:message authInfo:authRequest access_token:[AWPublicClassForiOS readPlistFile:@"config" forKey:@"sinaWeibo_appKey"]];
    wbRequest.userInfo = nil;
    [WeiboSDK sendRequest:wbRequest];
}

-(void)didReceiveWeiboResponse:(WBBaseResponse *)response
{
    if ( [response isKindOfClass:WBSendMessageToWeiboResponse.class] && response.statusCode == 0 ) {
        
        _resultDic[@"result"] = @YES;
        [self.delegate callBackDelegate:_resultDic error:nil];
        
    }else if ( [response isKindOfClass:WBAuthorizeResponse.class] && response.statusCode == 0 ){
        
        WBAuthorizeResponse *authorResponse = (WBAuthorizeResponse *)response;
        
        NSString *wbtoken    = [[NSString alloc] initWithFormat:@"%@", [authorResponse accessToken]];
        NSString *wbUserID   = [[NSString alloc] initWithFormat:@"%@", [authorResponse userID]];
        NSDictionary *result = @{ @"accessToken" : wbtoken, @"userID" : wbUserID };
        _resultDic[@"result"] = result;
        [self.delegate callBackDelegate:_resultDic error:nil];
        
    }else{
        
        NSString *error = nil;
        switch ( response.statusCode ) {
            case -1:
            {
                error = @"1701";
                break;
            }
            case -2:
            {
                error = @"1702";
                break;
            }
            case -3:
            {
                error = @"1703";
                break;
            }
            case -4:
            {
                error = @"1704";
                break;
            }
            case -99:
            {
                error = @"1705";
                break;
            }
            case -8:
            {
                error = @"1706";
                break;
            }
            case -100:
            {
                error = @"0001";
                break;
            }
            default:
                break;
        }
        
        [self.delegate callBackDelegate:_resultDic error:error];
    }
}

-(void)didReceiveWeiboRequest:(WBBaseRequest *)request
{
    
}



@end
