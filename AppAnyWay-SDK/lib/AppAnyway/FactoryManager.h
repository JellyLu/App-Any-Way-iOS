//
//  FactoryManager.h
//  AppAnyWay
//
//  Created by Jelly on 15-1-12.
//  Copyright (c) 2015年 1390Mall. All rights reserved.
//

#import <Foundation/Foundation.h> 
@interface FactoryManager : NSObject
{
    NSMutableDictionary *_manager;
    NSDictionary        *_managerDic;
    
}

+(id)getInstance;
-(id)managerFactory:(NSString *)className;
@end
