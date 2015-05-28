//
//  AWUserGuideViewController.h
//  AppAnyWay
//
//  Created by Jelly on 14-12-27.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//

//
#import "AWBaseClass.h"

@interface AWUserGuideViewController : AWBaseClass<UIGestureRecognizerDelegate>
{
    CGFloat   _bodyWidth;
    CGFloat   _bodyHeight;
    NSInteger _pageIndex;
    
    NSArray                  *_imageUrls;
    UIButton                 *_goMainBtn;
    UIImageView              *_imageView;
    UIPageControl            *_pageControl;
    UINavigationController   *_navigationController;
    UISwipeGestureRecognizer *_swipe;
}

@end
