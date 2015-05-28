//
//  AWThirdPartWX.m
//  AppAnyWay
//
//  Created by Jelly on 14-12-17.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//

#import "AWThirdPartWX.h"
#import "AWPublicClassForiOS.h"
#import "WXApi.h"

@interface AWThirdPartWX()<WXApiDelegate>

@end

@implementation AWThirdPartWX
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
* 是否安装微信
* @param  param:参数字典集，空
*/
-(void)isInstalledWX:(NSDictionary *)param
{
    BOOL isInstalledWX = [WXApi isWXAppInstalled];
    
    _resultDic[@"result"] = [NSNumber numberWithBool:isInstalledWX];
    [self.delegate callBackDelegate:_resultDic error:nil];
}

/*
 * 登录
 * @param  param:参数字典集，空
 */
-(void)login:(NSDictionary *)param
{
    [self sendAuthRequest];
}

/*
 * 分享文字到朋友圈、微信好友
 * @param  param:参数字典集，包括type:wx微信好友，wxfriend朋友圈
 *                            url:分享链接
 *                            imageUrl:图片地址
 *                            title:标题
 *                            description:内容
 */
-(void)shareByWX:(NSDictionary *)param
{
    if( [WXApi isWXAppInstalled] )
    {
        NSString *type         = param[@"type"];
        NSString *description  = param[@"description"];
        
        if( [type isEqualToString:@"wx"] ){
            SendMessageToWXReq* req = [[SendMessageToWXReq alloc] init];
            req.bText = YES;
            req.text  = description;
            req.scene = [type isEqualToString:@"wx"]? WXSceneSession : WXSceneTimeline;//选择发送到朋友圈，默认值为WXSceneSession，发送到会话
            [WXApi sendReq:req];
        }
    }else{
        
        [self.delegate callBackDelegate:_resultDic error:@"1901"];
    }
    
}

/*
 * 分享文字、图片、链接到朋友圈、微信好友
 * @param  param:参数字典集，包括type:wx微信好友，wxfriend朋友圈
 *                            url:分享链接
 *                            imageUrl:图片地址
 *                            title:标题
 *                            description:内容
 */
-(void)shareMsg:(NSDictionary *)param
{
    if( [WXApi isWXAppInstalled] ){
        
        NSString *type        = param[@"type"];
        NSString *url         = param[@"url"];
        NSString *title       = param[@"title"];
        NSString *description = param[@"description"];
        NSString *imageUrl    = param[@"imageUrl"];
        
        WXMediaMessage *message = [WXMediaMessage message];
        [message setTitle:title];
        [message setDescription:description];
        
        WXWebpageObject *ext = [WXWebpageObject object];
        ext.webpageUrl = url;
        NSURLRequest *request  = [NSURLRequest requestWithURL:[NSURL URLWithString:imageUrl] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:5];
        NSURLResponse *response;
        NSData *imageData =  [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:nil];
        if ( !imageData || [imageData length] > 32768 ) {
            message.thumbData =   UIImagePNGRepresentation([UIImage imageNamed:@"120x120.png"]);
        }else{
            message.thumbData = imageData;
            
        }
        message.mediaObject = ext;
        
        SendMessageToWXReq* req = [[SendMessageToWXReq alloc] init];
        req.bText   = NO;
        req.message = message;
        req.scene   = [type isEqualToString:@"wx"]? WXSceneSession : WXSceneTimeline;//选择发送到朋友圈，默认值为WXSceneSession，发送到会话
        
        [WXApi sendReq:req];
        
    }else{
        
        [self.delegate callBackDelegate:_resultDic error:@"1901"];
    }

}


-(void)sendAuthRequest
{
    if( [WXApi isWXAppInstalled] ) {
        
        SendAuthReq* req = [[SendAuthReq alloc ] init ];
        req.scope = @"snsapi_userinfo";
        req.state = @"wx"; 
        [WXApi sendReq:req];
        
    }else {        
        [self.delegate callBackDelegate:_resultDic error:@"1901"];
    }
}

-(void) onResp:(BaseResp*)resp
{ 
    if([resp isKindOfClass:[SendMessageToWXResp class]] && resp.errCode == 0 ) {
        
        _resultDic[@"result"] = @YES;
        [self.delegate callBackDelegate:_resultDic error:nil];
        
    }else if( [resp isKindOfClass:[SendAuthResp class]] && resp.errCode == 0  ){
        
        SendAuthResp *sendAuthResp = (SendAuthResp *)resp;
        NSString *code   = sendAuthResp.code;
        NSString *appid  = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"wx_appKey"];
        NSString *secret = [AWPublicClassForiOS readPlistFile:@"config" forKey:@"wx_appSecret"];
        NSURL    *url    = [NSURL URLWithString:[NSString stringWithFormat:@"https://api.weixin.qq.com/sns/oauth2/access_token?appid=%@&secret=%@&code=%@&grant_type=authorization_code", appid, secret, code]];
        
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url cachePolicy:0 timeoutInterval:10];
        
        NSOperationQueue *queue = [[NSOperationQueue alloc]init];
       [NSURLConnection sendAsynchronousRequest:request queue:queue completionHandler:  ^(NSURLResponse *response,
                                                                                           NSData *data,
                                                                                           NSError *error){
          
           if ( data.length != 0 && error == nil && [(NSHTTPURLResponse *)response statusCode] != 404 ) {
               NSDictionary *dics = [AWPublicClassForiOS analyseJsonData:data withTag:@""];
               NSString *accessToken = dics[@"access_token"];
               NSDictionary *dic = [[NSDictionary alloc] initWithObjectsAndKeys: accessToken, @"accessToken", nil];
               
               _resultDic[@"result"] = dic;
               [self.delegate callBackDelegate:_resultDic error:nil];
           }else{
               [self.delegate callBackDelegate:_resultDic error:@"1904"];
           }
        
       }];
      
         
    }else{
        
        NSString *error = nil;
        switch ( resp.errCode ) {
            case -2:
            {
                error = @"1902";
                break;
            }
            case -3:
            {
                error = @"1903";
                break;
            }
            case -4:
            {
                error = @"1904";
                break;
            }
            case -5:
            {
                error = @"1905";
                break;
            }
            case -1:
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

@end
