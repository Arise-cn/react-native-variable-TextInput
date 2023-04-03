//
//  EmojiTextAttachment.h
//  CocoaAsyncSocket
//
//  Created by duom青源 on 2023/3/23.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface EmojiTextAttachment : NSTextAttachment
@property(strong, nonatomic) NSString *emojiTag;
@property(assign, nonatomic) CGSize emojiSize;  //For emoji image size
@property (nonatomic,assign) NSRange  range;
@property(nonatomic,copy)NSString *showCopyStr;
@property(assign,nonatomic)CGRect react;

@end

NS_ASSUME_NONNULL_END
