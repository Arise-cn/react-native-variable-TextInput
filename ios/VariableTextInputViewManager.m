#import <React/RCTViewManager.h>
#import "VariableTextInput.h"
#import <React/RCTConvert.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTFont.h>
#import <React/RCTConvert.h>
#import "EmojiTextAttachment.h"
#import "NSAttributedString+EmojiExtension.h"
@interface VariableTextInputViewManager : RCTViewManager<RCTBridgeModule>
@property(nonatomic,strong)VariableTextInput *textInput;
@property (nonatomic, strong)NSDictionary *typingAttributes;
@end
@implementation VariableTextInputViewManager
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

RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onContentSizeChange, RCTBubblingEventBlock)
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
RCT_EXPORT_METHOD(focus)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [self->_textInput becomeFirstResponder];
  });
}

RCT_EXPORT_METHOD(blur)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [self->_textInput resignFirstResponder];
  });
}
RCT_EXPORT_METHOD(changeAttributedText:(NSArray *)arr){
  dispatch_async(dispatch_get_main_queue(), ^{
    [self setAttributedText:arr];
  });
}
RCT_EXPORT_METHOD(insertMentions:(NSDictionary *)mention)
{
    dispatch_async(dispatch_get_main_queue(), ^{
      [self insertTagText:mention];
  });
}
RCT_EXPORT_METHOD(insertEmoji:( NSDictionary *)rnImageData)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [self insertTextEmoji:rnImageData];
    });
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
-(void)setTextAttachment:(UIImage *)img tag:(NSString *)tag size:(CGSize)size copyStr:(NSString *)copyStr{
  if ([self isOutMaxLength:copyStr]) {
    return;
  }
  EmojiTextAttachment *emojiTextAttachment = [EmojiTextAttachment new];
  emojiTextAttachment.emojiTag = tag;
  emojiTextAttachment.image = img;
  emojiTextAttachment.showCopyStr = copyStr;
  CGFloat paddingTop = self.textInput.font.lineHeight - self.textInput.font.pointSize;
  emojiTextAttachment.react = CGRectMake(0, -paddingTop, size.width, size.height);
  NSAttributedString *str = [NSAttributedString attributedStringWithAttachment:emojiTextAttachment];
  NSRange selectedRange = self.textInput.selectedRange;
  if (selectedRange.length > 0) {
    [self.textInput.textStorage deleteCharactersInRange:selectedRange];
   }
  [self.textInput.textStorage insertAttributedString:str atIndex:self.textInput.selectedRange.location];
  self.textInput.selectedRange = NSMakeRange(self.textInput.selectedRange.location+1, 0);
  //插入表情后换行modal切换
  //插入表情后planceholder修改
  NSString *planStr = [self.textInput.textStorage getPlainString];
  [self.textInput setPlaceholderVisibleForText:planStr];
  self.textInput.typingAttributes = self.typingAttributes;
  if (_textInput.onChange) {
      _textInput.onChange(@{@"text": [_textInput.textStorage getPlainString]});
  }
  [self.textInput becomeFirstResponder];
}
-(Boolean)isOutMaxLength:(NSString *)str{
  NSString *oldStr = [_textInput getStrContentInRange:NSMakeRange(0, _textInput.attributedText.length)];
  NSString *newStr = [NSString stringWithFormat:@"%@%@",oldStr,str];
  if (_textInput.maxTextLength>0 && newStr.length>_textInput.maxTextLength) {
    return YES;
  }else{
    return NO;
  }
}
-(void)insertTextEmoji:(NSDictionary *)rnImageData{
  self.typingAttributes = self.textInput.typingAttributes;
  EmojiTextAttachment *emojiTextAttachment = [EmojiTextAttachment new];
  //Set tag and image
  emojiTextAttachment.emojiTag = rnImageData[@"emojiTag"];
  UIImage *image =[RCTConvert UIImage:rnImageData[@"img"]];
  emojiTextAttachment.showCopyStr =rnImageData[@"emojiTag"];
  if ([self isOutMaxLength:rnImageData[@"emojiTag"]]) {
    return;
  }
  emojiTextAttachment.image = image;
  CGFloat paddingTop = self.textInput.font.lineHeight - self.textInput.font.pointSize;
  emojiTextAttachment.react = CGRectMake(0, -paddingTop, self.textInput.font.lineHeight, self.textInput.font.lineHeight);
  NSAttributedString *str = [NSAttributedString attributedStringWithAttachment:emojiTextAttachment];
  NSRange selectedRange = self.textInput.selectedRange;
  if (selectedRange.length > 0) {
      [self.textInput.textStorage deleteCharactersInRange:selectedRange];
  }
  [self.textInput.textStorage insertAttributedString:str atIndex:self.textInput.selectedRange.location];
  
  self.textInput.selectedRange = NSMakeRange(self.textInput.selectedRange.location+1, 0);
  NSString *planStr = [self.textInput.textStorage getPlainString];
  [self.textInput setPlaceholderVisibleForText:planStr];
  self.textInput.typingAttributes = self.typingAttributes;
    if (_textInput.onChange) {
        _textInput.onChange(@{@"text": [_textInput.textStorage getPlainString]});
    }
}
-(void)insertTagText:(NSDictionary *)mention{
  NSString *tag = [RCTConvert NSString:mention[@"tag"]];
  NSString *name =[RCTConvert NSString:mention[@"name"]];
  UIColor *color =  [RCTConvert UIColor:mention[@"color"]];
  NSString *user_id = [RCTConvert NSString:mention[@"id"]];
  NSString *showStr = [[tag stringByAppendingString:name] stringByAppendingString:@" "];
  NSString *emojiTag = [NSString stringWithFormat:@"{%@}[%@](%@)",tag,name,user_id];
  NSString *copyStr = [NSString stringWithFormat:@"%@%@",tag,name];
  self.typingAttributes = self.textInput.typingAttributes;
  NSMutableDictionary <NSAttributedStringKey, id>*dic =[NSMutableDictionary dictionaryWithDictionary:self.textInput.typingAttributes];
  [dic setObject:color forKey:@"NSColor"];
  CGSize textSize = [showStr sizeWithAttributes:self.textInput.typingAttributes];
  UIImage *image =  [self drawImageWithColor:[UIColor clearColor] size:textSize text:[NSString stringWithFormat:@"%@",showStr] textAttributes:dic circular:NO];
    if(_textInput.tagStr != nil && ![_textInput.tagStr isEqualToString:@""]){
        _textInput.text = [_textInput.text stringByReplacingOccurrencesOfString:[NSString stringWithFormat:@"%@%@",_textInput.tagStr,_textInput.keyWord] withString:@""];
        NSAttributedString *attString = _textInput.attributedText;
        _textInput.tagStr = @"";
        _textInput.keyWord = @"";
    }
  [self setTextAttachment:image tag:emojiTag size:textSize copyStr:copyStr];
  
}

-(void)setAttributedText:(NSArray *)arr{
  NSMutableAttributedString *attStr = [[NSMutableAttributedString alloc]init];
  UIFont *textFont = [_textInput.defultTypingAttributes objectForKey:@"NSFont"];
  CGFloat oldpaddingTop = self.textInput.font.lineHeight - self.textInput.font.pointSize;
  [arr enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
    NSDictionary *dic = arr[idx];
    NSNumber *typeNum = dic[@"type"];
    NSInteger type = [typeNum intValue];
    if (type == 0) {
      //普通字符
      NSString *str = [RCTConvert NSString:dic[@"text"]];
      NSAttributedString *text = [[NSAttributedString alloc]initWithString:str];
      NSMutableAttributedString *normMutaStr = [[NSMutableAttributedString alloc]initWithAttributedString:text];
      [normMutaStr addAttributes:_textInput.defultTypingAttributes range:NSMakeRange(0, normMutaStr.length)];
      [attStr appendAttributedString:normMutaStr];
    }
    if(type == 1){
      NSDictionary *rnImageData = dic;
      EmojiTextAttachment *emojiTextAttachment = [EmojiTextAttachment new];
      //Set tag and image
      emojiTextAttachment.emojiTag = rnImageData[@"emojiTag"];
      UIImage *image =[RCTConvert UIImage:rnImageData[@"img"]];
      emojiTextAttachment.showCopyStr =rnImageData[@"emojiTag"];
      if ([self isOutMaxLength:rnImageData[@"emojiTag"]]) {
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
      NSMutableDictionary <NSAttributedStringKey, id>*dic =[NSMutableDictionary dictionaryWithDictionary:_textInput.defultTypingAttributes];
      [dic setObject:color forKey:@"NSColor"];
      CGSize textSize = [showStr sizeWithAttributes:_textInput.defultTypingAttributes];
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
  [attStr addAttributes:_textInput.defultTypingAttributes range:NSMakeRange(0, attStr.length)];
  _textInput.attributedText = attStr;
    if (_textInput.onChange) {
        _textInput.onChange(@{@"text": [_textInput.textStorage getPlainString]});
    }
  
}
@end
