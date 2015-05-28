//
//  SlideImage.h
//  AppAnyWay
//
//  Created by Jelly on 14-12-28.
//  Copyright (c) 2014年 1390Mall. All rights reserved.
//

//#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
/*! @brief 滑动方向
 *
 */
enum SlideDirection {
    SlideHorizontal  = 0,        /**< 水平滑动    */
    SlideVertical    = 1,        /**< 垂直滑动      */
};


@interface AWSlideImage : UIViewController<UIGestureRecognizerDelegate>
{
    CGSize    _size;
    NSInteger _pageIndex;
    NSInteger _slideDirection;
    
    NSArray          *_imageUrls;
    UIButton         *_goMainBtn;
    UIImageView      *_imageView;
    UIPageControl    *_pageControl;
    UIScrollView     *_scrollView;
 
}
-(id)initWithRect:(CGRect)rect param:(NSDictionary *)param;
-(void)present:(UIViewController *)vc;
@end
