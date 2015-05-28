//
//  AWPublicClassForiOS.h
//  AppAnyWay
//
//  Created by Jelly on 14-12-8.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//

#import <Foundation/Foundation.h>
 
@interface AWPublicClassForiOS : NSObject

+(id)analyseJsonData:(NSData*)data withTag:(NSString*)tag;
+(BOOL)isDictionaryEmpty:(NSDictionary *)dic;
+(BOOL)isStringEmpty:(NSString *)string;
+(BOOL)isSubString:(NSString *)subString inString:(NSString *)string;
+(NSDictionary *)jsonStringToDictionary:(NSString *)param;
+(NSDictionary *)readPlistFile:(NSString *)fileName;
+(NSDictionary *)readPlistFile:(NSString *)fileName bundle:(NSString *)bundleName;
+ (NSString *)md5HexDigest:(NSString*)input;
+(id)readPlistFile:(NSString *)fileName forKey:(NSString *)key;
+(id)readPlistFile:(NSString *)fileName forKey:(NSString *)key bundle:(NSString *)bundleName;
//上传文件
+(void)sendDataAtPath:(NSString *)path completionHandler:(void (^)(NSData* data, NSString *error)) handler NS_AVAILABLE(10_7, 5_0);
//修改配置文件
//+(void)writePlistFile:(NSString *)fileName withData:(NSDictionary *)dictionary;
@end
