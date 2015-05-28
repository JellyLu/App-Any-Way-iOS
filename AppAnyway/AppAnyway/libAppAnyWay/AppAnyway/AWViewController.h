//
//  ViewController.h
//  AppAnyWay
//
//  Created by Jelly on 14-12-6.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//

#import <UIKit/UIKit.h>
@interface AWViewController : UIViewController

@property (nonatomic,strong) IBOutlet UIWebView   *webView;
/**
 * 设置webview加载的本地页面
 * @param urlStr:页面的本地相对路径
 */
-(void)setURL:(NSString *) urlStr;
@end

