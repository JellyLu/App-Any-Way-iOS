//
//  AWBaiduNavigation.m
//  AppAnyWay
//
//  Created by Jelly on 14-12-19.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//

#import "AWBaiduNavigation.h"
//baidu导航
#import "BNCoreServices.h"

@interface AWBaiduNavigation()<
                                BNNaviRoutePlanDelegate
                               ,BNNaviUIManagerDelegate
                              >
{
    BN_NaviType _naviType;
}
@end

@implementation AWBaiduNavigation
/**
 * 导航
 * @param  param:参数字典集，包括startX:起点经度
 *                            startY:起点纬度
 *                            sType:起点坐标类型
 *                            endX:终点经度
 *                            endY:终点纬度
 *                            eType:终点坐标类型
 */
- (void)startNavigation:(NSDictionary *)param
{
    //BNCoordinate_OriginalGPS = 0,//原始的经纬度坐标
    //BNCoordinate_BaiduMapSDK = 1,//从百度地图中获取的sdk
    
    double    startX = [param[@"startX"] doubleValue];
    double    startY = [param[@"startY"] doubleValue];
    int       sType  = [param[@"sType"] intValue];
    
    double    endX   = [param[@"endX"] doubleValue];
    double    endY   = [param[@"endY"] doubleValue];
    int       eType  = [param[@"eType"] intValue];
    
    if ( startX < 0 || startX > 180 || endX < 0 || endX > 180
       || startY < 0 || startY > 90 || endY < 0 || endY > 90
       || sType > 1 || sType < 0 || eType > 1 || eType < 0 ) {
        
        [self.delegate callBackDelegate:_resultDic error:@"1501"];
        return;
    }
    
    NSMutableArray *nodesArray = [[NSMutableArray alloc] initWithCapacity:2];
    //起点 传入的是原始的经纬度坐标，若使用的是百度地图坐标，可以使用BNTools类进行坐标转化
    BNRoutePlanNode *startNode = [[BNRoutePlanNode alloc] init];
    startNode.pos       = [[BNPosition alloc] init];
    startNode.pos.x     = startX;
    startNode.pos.y     = startY;
    int      seType     = sType ? BNCoordinate_BaiduMapSDK : BNCoordinate_OriginalGPS;
    startNode.pos.eType = seType;
    [nodesArray addObject:startNode];
    
    //终点
    BNRoutePlanNode *endNode = [[BNRoutePlanNode alloc] init];
    endNode.pos       = [[BNPosition alloc] init];
    endNode.pos.x     = endX;
    endNode.pos.y     = endY;
    int    eeType     = eType ? BNCoordinate_BaiduMapSDK : BNCoordinate_OriginalGPS;
    endNode.pos.eType = eeType ;
    [nodesArray addObject:endNode];
    
    _naviType =  BN_NaviTypeReal; //BN_NaviTypeSimulator
    
    [BNCoreServices_RoutePlan startNaviRoutePlan:BNRoutePlanMode_Recommend naviNodes:nodesArray time:nil delegete:self userInfo:nil];    
}

#pragma mark - BNNaviRoutePlanDelegate
//算路成功回调
-(void)routePlanDidFinished:(NSDictionary *)userInfo
{
    //路径规划成功，开始导航
    [BNCoreServices_UI showNaviUI:_naviType delegete:self isNeedLandscape:YES];
    _resultDic[@"result"] = @YES;
    [self.delegate callBackDelegate:_resultDic error:nil];
}

//算路失败回调
- (void)routePlanDidFailedWithError:(NSError *)error andUserInfo:(NSDictionary *)userInfo
{
    if ([error code] == BNRoutePlanError_LocationFailed) {
       
        [self.delegate callBackDelegate:_resultDic error:@"1502"];
        
    }else if ([error code] == BNRoutePlanError_RoutePlanFailed) {
        
        [self.delegate callBackDelegate:_resultDic error:@"1503"];
        
    }else if ([error code] == BNRoutePlanError_LocationServiceClosed) {
        
        [self.delegate callBackDelegate:_resultDic error:@"0006"];
        
    }else if ([error code] == BNRoutePlanError_NodesTooNear) {
        
        [self.delegate callBackDelegate:_resultDic error:@"1504"];
        
    }else if ([error code] == BNRoutePlanError_NodesInputError) {
        
        [self.delegate callBackDelegate:_resultDic error:@"1505"];
        
    }else if ([error code] == BNRoutePlanError_WaitAMoment) {
        
        [self.delegate callBackDelegate:_resultDic error:@"1506"];
        
    }
    
}

//算路取消回调
-(void)routePlanDidUserCanceled:(NSDictionary*)userInfo
{
    [self.delegate callBackDelegate:_resultDic error:@"1507"];
}

#pragma mark - BNNaviUIManagerDelegate

//退出导航回调
-(void)onExitNaviUI:(NSDictionary*)extraInfo
{
//   [_resultDic setValue:@"退出导航" forKey:@"result"];
//   [self.delegate callBackDelegate:_resultDic error:nil];
}

//退出导航声明页面回调
- (void)onExitexitDeclarationUI:(NSDictionary*)extraInfo
{ 
//    [_resultDic setValue:@"退出导航声明页面" forKey:@"result"];
//    [self.delegate callBackDelegate:_resultDic error:nil];
}
@end
