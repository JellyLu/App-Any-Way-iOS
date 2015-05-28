//
//  AWBaseClass.h
//  AppAnyWay
//
//  Created by Jelly on 14-12-6.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//
 
#import <UIKit/UIKit.h>  

@protocol CallBakDelegate <NSObject>

-(void)callBackDelegate:(NSMutableDictionary *)result error:(id)error;

@end

@interface AWBaseClass : NSObject
{
    NSMutableDictionary *_resultDic; 
}

@property (assign, nonatomic) id <CallBakDelegate>  delegate; 
@property (weak, nonatomic) UIViewController     *viewController;

-(void)invokeMethod:(NSString *)methodName param:(NSDictionary *)param;
+(id)getInstance;
-(id)initWithViewController:(UIViewController *)vc delegate:(id)delegate;
-(void)setCallbackMethod:(NSString *)callbackMethod;
-(void)setRequestId:(NSString *)requestId;
@end
