//
//  CJSONSerializedData.m
//  TouchJSON
//
//  Created by Jonathan Wight on 10/31/10.
//  Copyright 2010 toxicsoftware.com. All rights reserved.
//

#import "CJSONSerializedData.h"

@interface CJSONSerializedData ()
@end

#pragma mark -

@implementation CJSONSerializedData

@synthesize data;

- (id)initWithData:(NSData *)inData
    {
    if ((self = [super init]) != NULL)
        {
        #if ! __has_feature(objc_arc)
        data = [inData retain];
        #endif
        }
    return(self);
    }

- (void)dealloc
{
    data = NULL;
    #if ! __has_feature(objc_arc)
    [data release];
    [super dealloc];
    #endif
}

- (NSData *)serializedJSONData
    {
    return(self.data);
    }

@end
