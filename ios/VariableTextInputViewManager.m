#import <React/RCTViewManager.h>
#import "VariableTextInput.h"
#import <React/RCTConvert.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTFont.h>
#import <React/RCTConvert.h>
#import "EmojiTextAttachment.h"
#import "NSAttributedString+EmojiExtension.h"
#import <React/RCTUIManager.h>
@interface VariableTextInputViewManager : RCTViewManager<RCTBridgeModule>
@property(nonatomic,strong)VariableTextInput *textInput;
@property (nonatomic, strong)NSDictionary *typingAttributes;
@property (nonatomic, weak) RCTUIManager *uiManager;
@end
@implementation VariableTextInputViewManager
- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if (self = [super init]) {
    _uiManager = [bridge moduleForClass:[RCTUIManager class]];
  }
  return self;
}
RCT_EXPORT_MODULE()
RCT_EXPORT_VIEW_PROPERTY(placeholder, NSString)
RCT_EXPORT_VIEW_PROPERTY(text, NSString)
RCT_EXPORT_VIEW_PROPERTY(paddingTop, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(paddingRight, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(paddingBottom, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(paddingLeft, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(padding, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(paddingHorizontal, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(paddingVertical, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(keyboardType, UIKeyboardType)
RCT_EXPORT_VIEW_PROPERTY(keyboardAppearance, UIKeyboardAppearance)
RCT_EXPORT_VIEW_PROPERTY(returnKeyType, UIReturnKeyType)
RCT_EXPORT_VIEW_PROPERTY(blurOnSubmit, BOOL)
RCT_CUSTOM_VIEW_PROPERTY(placeholderTextColor, UIColor, VariableTextInput)
{
    [view setValue: [RCTConvert UIColor:json] forKeyPath: @"placeholderTextColor"];
}
RCT_EXPORT_VIEW_PROPERTY(onTextInput, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onTag, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onBlur, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFocus, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onContentSizeChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSubmitEditing, RCTBubblingEventBlock)
RCT_CUSTOM_VIEW_PROPERTY(textAlign, NSTextAlignment, VariableTextInput)
{
    [view setTextAlignment:[RCTConvert NSTextAlignment:json]];
}
RCT_CUSTOM_VIEW_PROPERTY(color, UIColor, VariableTextInput)
{
  view.textColor =[RCTConvert UIColor:json];
  NSDictionary *dic = self.textInput.typingAttributes;
  if (dic != nil) {
    self.textInput.defultTypingAttributes = self.textInput.typingAttributes;
  }
}
RCT_CUSTOM_VIEW_PROPERTY(maxTextLength, NSInteger, VariableTextInput)
{
  view.maxTextLength =[RCTConvert NSInteger:json];
}
RCT_CUSTOM_VIEW_PROPERTY(tags, NSArray, VariableTextInput)
{
  view.tags =[RCTConvert NSArray:json];
}
RCT_CUSTOM_VIEW_PROPERTY(fontSize, NSNumber, VariableTextInput)
{
    view.font = [RCTFont updateFont:view.font withSize:json ?: @(defaultView.font.pointSize)];
  NSDictionary *dic = self.textInput.typingAttributes;
  if (dic != nil) {
    self.textInput.defultTypingAttributes = self.textInput.typingAttributes;
  }
}
RCT_EXPORT_METHOD(focus:(nonnull NSNumber*) reactTag)
{
    [self.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        VariableTextInput *input =(VariableTextInput *) viewRegistry[reactTag];
        if (!input || ![input isKindOfClass:[VariableTextInput class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
          return;
        }
        [input becomeFirstResponder];
    }];
}

RCT_EXPORT_METHOD(blur:(nonnull NSNumber*) reactTag)
{
    [self.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        VariableTextInput *input =(VariableTextInput *) viewRegistry[reactTag];
        if (!input || ![input isKindOfClass:[VariableTextInput class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
          return;
        }
        [input resignFirstResponder];
    }];
}
RCT_EXPORT_METHOD( changeAttributedText:(nonnull NSNumber*) reactTag arr:(NSDictionary *)arr){
    [self.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        VariableTextInput *input =(VariableTextInput *) viewRegistry[reactTag];
        if (!input || ![input isKindOfClass:[VariableTextInput class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
          return;
        }
        [self setAttributedText:[arr objectForKey:@"data"] input:input];
    }];
}
RCT_EXPORT_METHOD(insertMentions:(nonnull NSNumber*) reactTag mention:(NSDictionary *)mention)
{
    [self.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        VariableTextInput *input =(VariableTextInput *) viewRegistry[reactTag];
        if (!input || ![input isKindOfClass:[VariableTextInput class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
          return;
        }
        [self insertTagText:[mention objectForKey:@"data"] input:input];
    }];
}
RCT_EXPORT_METHOD(insertEmoji:(nonnull NSNumber*) reactTag rnImageData:( NSDictionary *)rnImageData)
{
    [self.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        VariableTextInput *input =(VariableTextInput *) viewRegistry[reactTag];
        if (!input || ![input isKindOfClass:[VariableTextInput class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
          return;
        }
        [self insertTextEmoji:[rnImageData objectForKey:@"data"] input:input];
    }];
}
RCT_EXPORT_METHOD(dismissTag)
{
  dispatch_async(dispatch_get_main_queue(), ^{
      self.textInput.tagStr = @"";
      self.textInput.keyWord = @"";
    });
}
- (UIView *)view
{
    _uiManager = [self.bridge moduleForClass:[RCTUIManager class]];
    _textInput = [[VariableTextInput alloc]init];
    _textInput.textContainerInset = UIEdgeInsetsZero;
    _textInput.textContainer.lineFragmentPadding = 0;
    _textInput.tagStr = @"";
    _textInput.keyWord = @"";
    _textInput.blurOnSubmit = true;
    return  _textInput;
}
#pragma mark -drawImagewith text
/**
 绘制图片
 
 @param color 背景色
 @param size 大小
 @param text 文字
 @param textAttributes 字体设置
 @param isCircular 是否圆形
 @return 图片
 */
-(UIImage *)drawImageWithColor:(UIColor *)color
                          size:(CGSize)size
                          text:(NSString *)text
                textAttributes:(NSDictionary<NSAttributedStringKey, id> *)textAttributes
                      circular:(BOOL)isCircular
{
    if (!color || size.width <= 0 || size.height <= 0) return nil;
    CGRect rect = CGRectMake(0, 0, size.width, size.height);
    UIGraphicsBeginImageContextWithOptions(rect.size, NO, 0);
    CGContextRef context = UIGraphicsGetCurrentContext();
    // circular
    if (isCircular) {
        CGPathRef path = CGPathCreateWithEllipseInRect(rect, NULL);
        CGContextAddPath(context, path);
        CGContextClip(context);
        CGPathRelease(path);
    }
    
    // color
    CGContextSetFillColorWithColor(context, color.CGColor);
    CGContextFillRect(context, rect);
    
    // text
    CGSize textSize = [text sizeWithAttributes:textAttributes];
    [text drawInRect:CGRectMake((size.width - textSize.width) / 2, (size.height - textSize.height) / 2, textSize.width, textSize.height) withAttributes:textAttributes];
    
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}


#pragma mark insertMethod
-(void)setTextAttachment:(UIImage *)img tag:(NSString *)tag size:(CGSize)size copyStr:(NSString *)copyStr input:(VariableTextInput *)input{
  if ([self isOutMaxLength:copyStr input:input]) {
    return;
  }
  EmojiTextAttachment *emojiTextAttachment = [EmojiTextAttachment new];
  emojiTextAttachment.emojiTag = tag;
  emojiTextAttachment.image = img;
  emojiTextAttachment.showCopyStr = copyStr;
  CGFloat paddingTop = input.font.lineHeight - input.font.pointSize;
  emojiTextAttachment.react = CGRectMake(0, -paddingTop, size.width, size.height);
  NSAttributedString *str = [NSAttributedString attributedStringWithAttachment:emojiTextAttachment];
  NSRange selectedRange = input.selectedRange;
  if (selectedRange.length > 0) {
    [input.textStorage deleteCharactersInRange:selectedRange];
   }
  [input.textStorage insertAttributedString:str atIndex:input.selectedRange.location];
  input.selectedRange = NSMakeRange(input.selectedRange.location+1, 0);
  //插入表情后换行modal切换
  //插入表情后planceholder修改
  NSString *planStr = [input.textStorage getPlainString];
  [input setPlaceholderVisibleForText:planStr];
  input.typingAttributes = self.typingAttributes;
  if (input.onChange) {
      input.onChange(@{@"text": [input.textStorage getPlainString]});
  }
  [input becomeFirstResponder];
}
-(Boolean)isOutMaxLength:(NSString *)str input:(VariableTextInput *)input{
  NSString *oldStr = [input getStrContentInRange:NSMakeRange(0, input.attributedText.length)];
  NSString *newStr = [NSString stringWithFormat:@"%@%@",oldStr,str];
  if (input.maxTextLength>0 && newStr.length>input.maxTextLength) {
    return YES;
  }else{
    return NO;
  }
}
-(void)insertTextEmoji:(NSDictionary *)rnImageData input:(VariableTextInput *)input{
  self.typingAttributes = input.typingAttributes;
  EmojiTextAttachment *emojiTextAttachment = [EmojiTextAttachment new];
  //Set tag and image
  emojiTextAttachment.emojiTag = rnImageData[@"emojiTag"];
  UIImage *image =[RCTConvert UIImage:rnImageData[@"img"]];
  emojiTextAttachment.showCopyStr =rnImageData[@"emojiTag"];
  if ([self isOutMaxLength:rnImageData[@"emojiTag"] input:input]) {
    return;
  }
  emojiTextAttachment.image = image;
  CGFloat paddingTop = input.font.lineHeight - input.font.pointSize;
  emojiTextAttachment.react = CGRectMake(0, -paddingTop, input.font.lineHeight, input.font.lineHeight);
  NSAttributedString *str = [NSAttributedString attributedStringWithAttachment:emojiTextAttachment];
  NSRange selectedRange = input.selectedRange;
  if (selectedRange.length > 0) {
      [input.textStorage deleteCharactersInRange:selectedRange];
  }
  [input.textStorage insertAttributedString:str atIndex:input.selectedRange.location];
  
  input.selectedRange = NSMakeRange(input.selectedRange.location+1, 0);
  NSString *planStr = [input.textStorage getPlainString];
  [input setPlaceholderVisibleForText:planStr];
  input.typingAttributes = self.typingAttributes;
    if (input.onChange) {
        input.onChange(@{@"text": [input.textStorage getPlainString]});
    }
}
-(void)insertTagText:(NSDictionary *)mention input:(VariableTextInput *)input{
  NSString *tag = [RCTConvert NSString:mention[@"tag"]];
  NSString *name =[RCTConvert NSString:mention[@"name"]];
  UIColor *color =  [RCTConvert UIColor:mention[@"color"]];
  NSString *user_id = [RCTConvert NSString:mention[@"id"]];
  NSString *showStr = [[tag stringByAppendingString:name] stringByAppendingString:@" "];
  NSString *emojiTag = [NSString stringWithFormat:@"{%@}[%@](%@)",tag,name,user_id];
  NSString *copyStr = [NSString stringWithFormat:@"%@%@",tag,name];
  self.typingAttributes = input.typingAttributes;
  NSMutableDictionary <NSAttributedStringKey, id>*dic =[NSMutableDictionary dictionaryWithDictionary:input.typingAttributes];
  [dic setObject:color forKey:@"NSColor"];
  CGSize textSize = [showStr sizeWithAttributes:input.typingAttributes];
  UIImage *image =  [self drawImageWithColor:[UIColor clearColor] size:textSize text:[NSString stringWithFormat:@"%@",showStr] textAttributes:dic circular:NO];
    if(input.tagStr != nil && ![input.tagStr isEqualToString:@""]){
        input.text = [input.text stringByReplacingOccurrencesOfString:[NSString stringWithFormat:@"%@%@",input.tagStr,input.keyWord] withString:@""];
        NSAttributedString *attString = input.attributedText;
        input.tagStr = @"";
        input.keyWord = @"";
    }
  [self setTextAttachment:image tag:emojiTag size:textSize copyStr:copyStr input:input];
  
}

-(void)setAttributedText:(NSArray *)arr input:(VariableTextInput *)input{
  NSMutableAttributedString *attStr = [[NSMutableAttributedString alloc]init];
  UIFont *textFont = [input.defultTypingAttributes objectForKey:@"NSFont"];
  CGFloat oldpaddingTop = input.font.lineHeight - input.font.pointSize;
  [arr enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
    NSDictionary *dic = arr[idx];
    NSNumber *typeNum = dic[@"type"];
    NSInteger type = [typeNum intValue];
    if (type == 0) {
      //普通字符
      NSString *str = [RCTConvert NSString:dic[@"text"]];
      NSAttributedString *text = [[NSAttributedString alloc]initWithString:str];
      NSMutableAttributedString *normMutaStr = [[NSMutableAttributedString alloc]initWithAttributedString:text];
      [normMutaStr addAttributes:input.defultTypingAttributes range:NSMakeRange(0, normMutaStr.length)];
      [attStr appendAttributedString:normMutaStr];
    }
    if(type == 1){
      NSDictionary *rnImageData = dic;
      EmojiTextAttachment *emojiTextAttachment = [EmojiTextAttachment new];
      //Set tag and image
      emojiTextAttachment.emojiTag = rnImageData[@"emojiTag"];
      UIImage *image =[RCTConvert UIImage:rnImageData[@"img"]];
      emojiTextAttachment.showCopyStr =rnImageData[@"emojiTag"];
      if ([self isOutMaxLength:rnImageData[@"emojiTag"] input:input]) {
        return;
      }
      emojiTextAttachment.image = image;
      CGFloat paddingTop = textFont.lineHeight -textFont.pointSize;
      emojiTextAttachment.react = CGRectMake(0, -paddingTop, textFont.lineHeight, textFont.lineHeight);
      NSAttributedString *str = [NSAttributedString attributedStringWithAttachment:emojiTextAttachment];
      [attStr appendAttributedString:str];
    }
    if(type == 2){
      NSDictionary *mention =dic;
      NSString *tag = [RCTConvert NSString:mention[@"tag"]];
      NSString *name =[RCTConvert NSString:mention[@"name"]];
      UIColor *color =  [RCTConvert UIColor:mention[@"color"]];
      NSString *user_id = [RCTConvert NSString:mention[@"id"]];
      NSString *showStr = [[tag stringByAppendingString:name] stringByAppendingString:@" "];
      NSString *emojiTag = [NSString stringWithFormat:@"{%@}[%@](%@)",tag,name,user_id];
      NSString *copyStr = [NSString stringWithFormat:@"%@%@",tag,name];
      NSMutableDictionary <NSAttributedStringKey, id>*dic =[NSMutableDictionary dictionaryWithDictionary:input.defultTypingAttributes];
      [dic setObject:color forKey:@"NSColor"];
      CGSize textSize = [showStr sizeWithAttributes:input.defultTypingAttributes];
      UIImage *image =  [self drawImageWithColor:[UIColor clearColor] size:textSize text:[NSString stringWithFormat:@"%@",showStr] textAttributes:dic circular:NO];
      EmojiTextAttachment *emojiTextAttachment = [EmojiTextAttachment new];
      emojiTextAttachment.emojiTag = emojiTag;
      emojiTextAttachment.image = image;
      emojiTextAttachment.showCopyStr = copyStr;
      emojiTextAttachment.react = CGRectMake(0, -oldpaddingTop, textSize.width, textSize.height);
      NSAttributedString *str = [NSAttributedString attributedStringWithAttachment:emojiTextAttachment];
      [attStr appendAttributedString:str];
    }
  }];
  [attStr addAttributes:input.defultTypingAttributes range:NSMakeRange(0, attStr.length)];
    input.attributedText = attStr;
    if (input.onChange) {
        input.onChange(@{@"text": [input.textStorage getPlainString]});
    }
  
}
@end
