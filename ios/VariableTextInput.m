//
//  VariableTextInput.m
//  react-native-variable-text-input
//
//  Created by duom青源 on 2023/3/20.
//

#import "VariableTextInput.h"
#import "EmojiTextAttachment.h"
#import "NSAttributedString+EmojiExtension.h"
#import <React/UIView+React.h>
#import <React/RCTUIManager.h>
#define kATRegular                      @"@[\\u4e00-\\u9fa5\\w\\-\\_]+ "
#define kTopicRegular                   @"#(.*?)#+ "
#define kAT                             @"@"
#define kTopic                          @"#"

#define HAS_TEXT_CONTAINER [self respondsToSelector:@selector(textContainer)]
#define HAS_TEXT_CONTAINER_INSETS(x) [(x) respondsToSelector:@selector(textContainerInset)]
static NSString * const kAttributedPlaceholderKey = @"attributedPlaceholder";
static NSString * const kPlaceholderKey = @"placeholder";
static NSString * const kFontKey = @"font";
static NSString * const kAttributedTextKey = @"attributedText";
static NSString * const kTextKey = @"text";
static NSString * const kExclusionPathsKey = @"exclusionPaths";
static NSString * const kLineFragmentPaddingKey = @"lineFragmentPadding";
static NSString * const kTextContainerInsetKey = @"textContainerInset";
static NSString * const kTextAlignmentKey = @"textAlignment";
@interface VariableTextInput () <UITextViewDelegate>

@property (assign, nonatomic) NSInteger cursorLocation; /// 光标位置

@property (strong, nonatomic) UITextView *placeholderTextView;
@property (assign, nonatomic) NSInteger max_TextLength;
@property (strong, nonatomic) UIColor *attributed_TextColor;
@property (nonatomic, weak) UIResponder *overrideNextResponder;
@end
@implementation VariableTextInput
#if __IPHONE_OS_VERSION_MIN_REQUIRED >= 70000
- (instancetype)initWithFrame:(CGRect)frame textContainer:(NSTextContainer *)textContainer
{
    self = [super initWithFrame:frame textContainer:textContainer];
    if (self) {
      self.delegate = self;
        [self addObserver:self forKeyPath:@"contentSize" options:NSKeyValueObservingOptionNew|NSKeyValueObservingOptionOld context:NULL];

      [self preparePlaceholder];
    }
    return self;
}
#else
- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
      self.delegate = self;
        [self addObserver:self forKeyPath:@"contentSize" options:NSKeyValueObservingOptionNew|NSKeyValueObservingOptionOld context:NULL];

      [self preparePlaceholder];
    }
    return self;
}
#endif
- (void)preparePlaceholder
{
    NSAssert(!self.placeholderTextView, @"placeholder has been prepared already: %@", self.placeholderTextView);
    // the label which displays the placeholder
    // needs to inherit some properties from its parent text view

    // account for standard UITextViewPadding

    CGRect frame = self.bounds;
    self.placeholderTextView = [[UITextView alloc] initWithFrame:frame];
    self.placeholderTextView.opaque = NO;
    self.placeholderTextView.backgroundColor = [UIColor clearColor];
    self.placeholderTextView.textColor = [UIColor colorWithWhite:0.7f alpha:0.7f];
    self.placeholderTextView.textAlignment = self.textAlignment;
    self.placeholderTextView.editable = NO;
    self.placeholderTextView.scrollEnabled = NO;
    self.placeholderTextView.userInteractionEnabled = NO;
    self.placeholderTextView.font = self.font;
    self.placeholderTextView.isAccessibilityElement = NO;
    self.placeholderTextView.contentOffset = self.contentOffset;
    self.placeholderTextView.contentInset = self.contentInset;

    if ([self.placeholderTextView respondsToSelector:@selector(setSelectable:)]) {
        self.placeholderTextView.selectable = NO;
    }

    if (HAS_TEXT_CONTAINER) {
        self.placeholderTextView.textContainer.exclusionPaths = self.textContainer.exclusionPaths;
        self.placeholderTextView.textContainer.lineFragmentPadding = self.textContainer.lineFragmentPadding;
    }

    if (HAS_TEXT_CONTAINER_INSETS(self)) {
        self.placeholderTextView.textContainerInset = self.textContainerInset;
    }

    if (_attributedPlaceholder) {
        self.placeholderTextView.attributedText = _attributedPlaceholder;
    } else if (_placeholder) {
        self.placeholderTextView.text = _placeholder;
    }

    [self setPlaceholderVisibleForText:[self.textStorage getPlainString]];

    self.clipsToBounds = YES;

    // some observations
    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    [defaultCenter addObserver:self selector:@selector(textDidChange:)
                          name:UITextViewTextDidChangeNotification object:self];

    [self addObserver:self forKeyPath:kAttributedPlaceholderKey
              options:NSKeyValueObservingOptionNew context:nil];
    [self addObserver:self forKeyPath:kPlaceholderKey
              options:NSKeyValueObservingOptionNew context:nil];
    [self addObserver:self forKeyPath:kFontKey
              options:NSKeyValueObservingOptionNew context:nil];
    [self addObserver:self forKeyPath:kAttributedTextKey
              options:NSKeyValueObservingOptionNew context:nil];
    [self addObserver:self forKeyPath:kTextKey
              options:NSKeyValueObservingOptionNew context:nil];
    [self addObserver:self forKeyPath:kTextAlignmentKey
              options:NSKeyValueObservingOptionNew context:nil];

    if (HAS_TEXT_CONTAINER) {
        [self.textContainer addObserver:self forKeyPath:kExclusionPathsKey
                                options:NSKeyValueObservingOptionNew context:nil];
        [self.textContainer addObserver:self forKeyPath:kLineFragmentPaddingKey
                                options:NSKeyValueObservingOptionNew context:nil];
    }

    if (HAS_TEXT_CONTAINER_INSETS(self)) {
        [self addObserver:self forKeyPath:kTextContainerInsetKey
                  options:NSKeyValueObservingOptionNew context:nil];
    }
}

- (void)setPlaceholder:(NSString *)placeholderText
{
    _placeholder = [placeholderText copy];
    _attributedPlaceholder = [[NSAttributedString alloc] initWithString:placeholderText];
    [self resizePlaceholderFrame];
}

- (void)setAttributedPlaceholder:(NSAttributedString *)attributedPlaceholderText
{
    _placeholder = attributedPlaceholderText.string;
    _attributedPlaceholder = [attributedPlaceholderText copy];

    [self resizePlaceholderFrame];
}
- (void)resizePlaceholderFrame
{
    CGRect frame = self.placeholderTextView.frame;
    frame.size = self.bounds.size;
    self.placeholderTextView.frame = frame;
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary *)change
                       context:(void *)context
{
    if ([keyPath isEqualToString:kAttributedPlaceholderKey]) {
        self.placeholderTextView.attributedText = [change valueForKey:NSKeyValueChangeNewKey];
    }
    else if ([keyPath isEqualToString:kPlaceholderKey]) {
        self.placeholderTextView.text = [change valueForKey:NSKeyValueChangeNewKey];
    }
    else if ([keyPath isEqualToString:kFontKey]) {
        self.placeholderTextView.font = [change valueForKey:NSKeyValueChangeNewKey];
    }
    else if ([keyPath isEqualToString:kAttributedTextKey]) {
        NSAttributedString *newAttributedText = [change valueForKey:NSKeyValueChangeNewKey];
        [self setPlaceholderVisibleForText:newAttributedText.string];
    }
    else if ([keyPath isEqualToString:kTextKey]) {
        NSString *newText = [change valueForKey:NSKeyValueChangeNewKey];
        [self setPlaceholderVisibleForText:newText];
    }
    else if ([keyPath isEqualToString:kExclusionPathsKey]) {
        self.placeholderTextView.textContainer.exclusionPaths = [change objectForKey:NSKeyValueChangeNewKey];
        [self resizePlaceholderFrame];
    }
    else if ([keyPath isEqualToString:kLineFragmentPaddingKey]) {
        self.placeholderTextView.textContainer.lineFragmentPadding = [[change objectForKey:NSKeyValueChangeNewKey] floatValue];
        [self resizePlaceholderFrame];
    }
    else if ([keyPath isEqualToString:kTextContainerInsetKey]) {
        NSValue *value = [change objectForKey:NSKeyValueChangeNewKey];
        self.placeholderTextView.textContainerInset = value.UIEdgeInsetsValue;
    }
    else if ([keyPath isEqualToString:kTextAlignmentKey]) {
        NSNumber *alignment = [change objectForKey:NSKeyValueChangeNewKey];
        self.placeholderTextView.textAlignment = alignment.intValue;
    }else if([keyPath isEqualToString:@"contentSize"]){
        //v center
//        [self updateContentInset];
    }
    else {
        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    }
}

- (void)setPlaceholderTextColor:(UIColor *)placeholderTextColor
{
    self.placeholderTextView.textColor = placeholderTextColor;
}

- (UIColor *)placeholderTextColor
{
    return self.placeholderTextView.textColor;
}

- (void)textDidChange:(NSNotification *)aNotification
{
    [self setPlaceholderVisibleForText:self.text];
}

- (BOOL)becomeFirstResponder
{
    [self setPlaceholderVisibleForText:self.text];

    return [super becomeFirstResponder];
}

- (void)setPlaceholderVisibleForText:(NSString *)text
{
    if (text.length < 1) {
        if (self.fadeTime > 0.0) {
            if (![self.placeholderTextView isDescendantOfView:self]) {
                self.placeholderTextView.alpha = 0;
                [self addSubview:self.placeholderTextView];
                [self sendSubviewToBack:self.placeholderTextView];
            }
            [UIView animateWithDuration:_fadeTime animations:^{
                self.placeholderTextView.alpha = 1;
            }];
        }
        else {
            [self addSubview:self.placeholderTextView];
            [self sendSubviewToBack:self.placeholderTextView];
            self.placeholderTextView.alpha = 1;
        }
    }
    else {
        if (self.fadeTime > 0.0) {
            [UIView animateWithDuration:_fadeTime animations:^{
                self.placeholderTextView.alpha = 0;
            }];
        }
        else {
            [self.placeholderTextView removeFromSuperview];
        }
    }
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeObserver:self forKeyPath:kAttributedPlaceholderKey];
    [self removeObserver:self forKeyPath:kPlaceholderKey];
    [self removeObserver:self forKeyPath:kFontKey];
    [self removeObserver:self forKeyPath:kAttributedTextKey];
    [self removeObserver:self forKeyPath:kTextKey];
    [self removeObserver:self forKeyPath:kTextAlignmentKey];

    if (HAS_TEXT_CONTAINER) {
        [self.textContainer removeObserver:self forKeyPath:kExclusionPathsKey];
        [self.textContainer removeObserver:self forKeyPath:kLineFragmentPaddingKey];
    }

    if (HAS_TEXT_CONTAINER_INSETS(self)) {
        [self removeObserver:self forKeyPath:kTextContainerInsetKey];
    }
}




















#pragma mark - UITextViewDelegate
- (void)textViewDidChangeSelection:(UITextView *)textView {
//    NSArray *results = [self getResultsListArrayWithTextView:textView.attributedText];
  textView.typingAttributes = self.defultTypingAttributes;
    BOOL inRange = NO;
    NSRange tempRange = NSMakeRange(0, 0);
    NSInteger textSelectedLocation = textView.selectedRange.location;
    NSInteger textSelectedLength = textView.selectedRange.length;
    if (inRange) {
        // 解决光标在‘特殊文本’左右时 无法左右移动的问题
        NSInteger location = tempRange.location;
        if (self.cursorLocation < textSelectedLocation) {
            location = tempRange.location+tempRange.length;
        }
        textView.selectedRange = NSMakeRange(location, textSelectedLength);
        if (textSelectedLength) { // 解决光标在‘特殊文本’内时，文本选中问题
            textView.selectedRange = NSMakeRange(textSelectedLocation, 0);
        }
    }
    self.cursorLocation = textView.selectedRange.location;
}

- (void)textViewDidChange:(UITextView *)textView {
    
    if (_onChange) {
        _onChange(@{@"text":[textView.textStorage getPlainString]});
    }
}

- (BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text {
  NSString *oldStr =  [self getStrContentInRange:NSMakeRange(0, [self.attributedText length])];
  NSString *newStr =  [NSString stringWithFormat:@"%@%@",oldStr,text];
    [self handleTags:text];
    if(self.tagStr != nil && ![self.tagStr isEqualToString:@""]){
        if(self.keyWord == nil){
            self.keyWord = @"";
        }else{
            self.keyWord = [NSString stringWithFormat:@"%@%@",self.keyWord,text];
            self.keyWord = [self.keyWord stringByReplacingOccurrencesOfString:self.tagStr withString:@""];
            
        }
        if (_onTag) {
            _onTag(@{
            @"tag": _tagStr,
            @"keyWord": _keyWord,
          });
        }
    }
  if (self.max_TextLength>0 && newStr.length>self.max_TextLength) {
    return NO;
  }
  if (_onTextInput) {
    _onTextInput(@{
      @"text": text,
      @"previousText": oldStr,
      @"range": @{
        @"start": @(range.location),
        @"end": @(range.location + range.length)
      },
    });
  }
  // 解决UITextView富文本编辑会连续的问题，且预输入颜色不变的问题
    if (textView.textStorage.length != 0) {
        textView = [self setTextViewAttributes:textView];
    }
  return YES;
 }
-(void)handleTags:(NSString *)text {
   __block Boolean istags =NO;
    __block NSString *tagStr = @"";
    [self.tags enumerateObjectsWithOptions:NSEnumerationReverse usingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
         NSLog(@"%@----%@",self.tags[idx],[NSThread currentThread]);
        NSString *str = self.tags[idx];
        if([str isEqualToString:text]){
            istags = YES;
            tagStr = text;
            self.tagStr = tagStr;
            self.keyWord = @"";
        }
     }];
}
- (void)textViewDidBeginEditing:(UITextView *)textView {
  //todo
}

- (void)textViewDidEndEditing:(UITextView *)textView {
    //todo
}

- (UITextView *)setTextViewAttributes:(UITextView *)textView {
    NSMutableDictionary *attributes = [NSMutableDictionary dictionary];
    attributes[NSFontAttributeName] = self.font;
    attributes[NSForegroundColorAttributeName] = self.textColor;
    if (self.lineSpacing > 0) {
        NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
        paragraphStyle.lineSpacing = self.lineSpacing;// 字体的行间距
        attributes[NSParagraphStyleAttributeName] = paragraphStyle;
    }
    textView.typingAttributes = attributes;
    return textView;
}
//解决在ios 10.11系统上，长按自定义表情的时候，keyboard会退出，并且弹出保存图片的系统窗口，这样的体验也不好。
-(BOOL)textView:(UITextView *)textView shouldInteractWithTextAttachment:(NSTextAttachment *)textAttachment inRange:(NSRange)characterRange interaction:(UITextItemInteraction)interaction{

     return NO;

 }

#pragma mark - set data
- (void)setMaxTextLength:(NSInteger)maxTextLength {
    _max_TextLength = maxTextLength;
}
- (void)setDefultTypingAttributes:(NSDictionary *)defultTypingAttributes {
    _defultTypingAttributes = defultTypingAttributes;
}
- (void)setAttributedTextColor:(UIColor *)attributedTextColor {
    _attributed_TextColor = attributedTextColor;
}

- (void)setBSupport:(BOOL)bSupport {
    _bSupport = bSupport;
}
#pragma mark -emoji
-(NSMutableAttributedString*)getEmojiText:(NSString*)content{
  static NSString *emojiTextPttern = @"\\[[0-9a-zA-Z\\u4e00-\\u9fa5]+\\]";
     NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc]initWithString:content attributes:self.typingAttributes];
     static NSRegularExpression *regExpress = nil;
     if(regExpress == nil){
       regExpress = [[NSRegularExpression alloc]initWithPattern:emojiTextPttern options:NSRegularExpressionCaseInsensitive error:nil];
     }
     //通过正则表达式识别出emojiText
     NSArray *matches = [regExpress matchesInString:content options:NSMatchingReportProgress range:NSMakeRange(0, content.length)];
     if(matches.count >0 ){
         for(NSTextCheckingResult *result in [matches reverseObjectEnumerator]){
             NSString *emojiText = [content substringWithRange:result.range];
             //构造NSTextAttachment对象
             NSTextAttachment *attachment = [self createEmojiAttachment:emojiText];
             if(attachment){
                 NSAttributedString *rep = [NSAttributedString attributedStringWithAttachment:attachment];
                 //在对应的位置替换
                 [attributedString replaceCharactersInRange:result.range withAttributedString:rep];
             }
         }
     }
     return attributedString;
 }
-(NSTextAttachment*)createEmojiAttachment:(NSString*)emojiText{
    if(emojiText.length==0){
        return nil;
    }
    NSString *imageName = @"[噘嘴]";
    if(imageName.length ==0 ){
        return nil;
    }
    UIImage *image = [UIImage imageNamed:imageName];
    if(image == nil){
        return nil;
    }
    //把图片缩放到符合当前textview行高的大小
    CGFloat emojiWHScale = image.size.width/1.0/image.size.height;
    CGSize emojiSize = CGSizeMake(self.font.lineHeight*emojiWHScale, self.font.lineHeight);
    UIImageView *imageView = [[UIImageView alloc]initWithFrame:CGRectMake(0, 0, emojiSize.width, emojiSize.height)];
    imageView.image = image;
    //防止模糊
    UIGraphicsBeginImageContextWithOptions(imageView.bounds.size, NO, [UIScreen mainScreen].scale);
    [imageView.layer renderInContext:UIGraphicsGetCurrentContext()];
    UIImage *emojiImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    EmojiTextAttachment *attachment = [[EmojiTextAttachment alloc]init];
    attachment.image = emojiImage;
    attachment.emojiTag = emojiText;
    attachment.bounds = CGRectMake(0, 0, emojiImage.size.width, emojiImage.size.height);
    return attachment;
}


#pragma mark copy cut part

-(void)paste:(id)sender{
    UIPasteboard *defaultPasteboard = [UIPasteboard generalPasteboard];
    if(defaultPasteboard.string.length>0){
        NSRange range = self.selectedRange;
        if(range.location == NSNotFound){
            range.location = self.text.length;
        }
        if([self.delegate textView:self shouldChangeTextInRange:range replacementText:defaultPasteboard.string]){
           NSAttributedString *newAttriString = [self getEmojiText:defaultPasteboard.string];
           [self insertAttriStringToTextview:newAttriString];
        }
        return;
    }
    [super paste:sender];
}

-(void)insertAttriStringToTextview:(NSAttributedString*)attriString{
    NSMutableAttributedString *mulAttriString = [[NSMutableAttributedString alloc]initWithAttributedString:self.attributedText];
    NSRange range = self.selectedRange;
    if(range.location == NSNotFound){
        range.location = self.text.length;
    }
    [mulAttriString insertAttributedString:attriString atIndex:range.location];
    self.attributedText = [mulAttriString copy];
    self.selectedRange = NSMakeRange(range.location+attriString.length,0 );
}
-(void)copy:(id)sender{
    NSRange range = self.selectedRange;
    NSString *content = [self getStrContentInRange:range];
    if(content.length>0){
        UIPasteboard *defaultPasteboard = [UIPasteboard generalPasteboard];
        [defaultPasteboard setString:content];
        return;
    }
    [super copy:sender];
}
-(void)cut:(id)sender{
    NSRange range = self.selectedRange;
    NSString *content = [self getStrContentInRange:range];
    if(content.length>0){
        [super cut:sender];
        UIPasteboard *defaultPasteboard = [UIPasteboard generalPasteboard];
        [defaultPasteboard setString:content];
        // 标记视图需要重新布局
        [self setNeedsLayout];
        return;
    }
    // 标记视图需要重新布局
    [self setNeedsLayout];
    [super cut:sender];
}

/**
 把textview的attributedText转化为NSString，其中把自定义表情转化为emojiText

 @param range 转化的范围
 @return 返回转化后的字符串
 */
-(NSString*)getStrContentInRange:(NSRange)range{
    NSMutableString *result = [[NSMutableString alloc]initWithCapacity:0];
    NSRange effectiveRange = NSMakeRange(range.location,0);
    NSUInteger length = NSMaxRange(range);
    while (NSMaxRange(effectiveRange)<length) {
        NSTextAttachment *attachment = [self.attributedText attribute:NSAttachmentAttributeName atIndex:NSMaxRange(effectiveRange) effectiveRange:&effectiveRange];
        if(attachment){
            if([attachment isKindOfClass:[EmojiTextAttachment class]]){
                EmojiTextAttachment *emojiAttachment = (EmojiTextAttachment*)attachment;
                [result appendString:emojiAttachment.showCopyStr];
            }
        }
        else{
            NSString *subStr = [self.text substringWithRange:effectiveRange];
            [result appendString:subStr];
        }
    }
    return [result copy];
}
-(Boolean)isSpecial:(NSString *)str{
  if(self.tags != nil && self.tags.count>0){
    __block Boolean isSp = NO;
    [self.tags enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
      if ([self.tags[idx] isEqualToString:str]) {
         isSp = YES;
      }
    }];
    return isSp;
  }else{
    return NO;
  }
}
#pragma mark layout
- (void)layoutSubviews
{
    [super layoutSubviews];
    [self resizePlaceholderFrame];
    [self invalidateIntrinsicContentSize];
  if (_onContentSizeChange) {
    CGSize size = [self sizeThatFits:CGSizeMake(CGRectGetWidth(self.bounds), CGFLOAT_MAX)];
    _onContentSizeChange(@{
      @"contentSize": @{
        @"height": @(size.height),
        @"width": @(size.width),
      },
    });
  }
    [self.superview setNeedsLayout];
}

- (CGSize)intrinsicContentSize
{
    CGSize size = [super intrinsicContentSize];
    size.height = self.contentSize.height;
    return size;
}
- (void)updateContentInset {
    NSLog(@"contentSize %@",NSStringFromCGSize(self.contentSize));
    CGFloat deadSpace = (CGRectGetHeight(self.bounds) - self.contentSize.height);
    CGFloat inset = MAX(0, deadSpace/2.0);
    self.contentInset = UIEdgeInsetsMake(inset, self.contentInset.left, inset, self.contentInset.right);
    self.contentOffset = CGPointMake(0, -inset);
    [self layoutSubviews];
}
- (void)setPaddingTop:(CGFloat)paddingTop
{
    _paddingTop = paddingTop;
    
    UIEdgeInsets insets = self.textContainerInset;
    [self setPaddingTop:paddingTop left:insets.left bottom:insets.bottom right:insets.right];
}

- (void)setPaddingLeft:(CGFloat)paddingLeft
{
    _paddingLeft = paddingLeft;
    
    UIEdgeInsets insets = self.textContainerInset;
    [self setPaddingTop:insets.top left:paddingLeft bottom:insets.bottom right:insets.right];
}

- (void)setPaddingBottom:(CGFloat)paddingBottom
{
    _paddingBottom = paddingBottom;
    
    UIEdgeInsets insets = self.textContainerInset;
    [self setPaddingTop:insets.top left:insets.left bottom:paddingBottom right:insets.right];
}

- (void)setPaddingRight:(CGFloat)paddingRight
{
    _paddingRight = paddingRight;
    
    UIEdgeInsets insets = self.textContainerInset;
    [self setPaddingTop:insets.top left:insets.left bottom:insets.bottom right:paddingRight];
}
- (void)setPaddingTop:(CGFloat)top left:(CGFloat)left bottom:(CGFloat)bottom right:(CGFloat)right
{
    UIEdgeInsets insets = UIEdgeInsetsMake(top, left, bottom, right);
    self.textContainerInset = insets;
}
- (void)setPadding:(CGFloat)padding
{
    _padding = padding;
    [self setPaddingTop:padding left:padding bottom:padding right:padding];
}
- (void)setPaddingHorizontal:(CGFloat)paddingHorizontal
{
    _paddingHorizontal = paddingHorizontal;
    UIEdgeInsets insets = self.textContainerInset;
    [self setPaddingTop:insets.top left:paddingHorizontal bottom:insets.bottom right:paddingHorizontal];
}
- (void)setPaddingVertical:(CGFloat)paddingVertical
{
    _paddingVertical = paddingVertical;
    UIEdgeInsets insets = self.textContainerInset;
    [self setPaddingTop:paddingVertical left:insets.left bottom:paddingVertical right:insets.right];
}
- (BOOL)textInputShouldReturn
{
  // We send `submit` event here, in `textInputShouldReturn`
  // (not in `textInputDidReturn)`, because of semantic of the event:
  // `onSubmitEditing` is called when "Submit" button
  // (the blue key on onscreen keyboard) did pressed
  // (no connection to any specific "submitting" process).
  if (self.onSubmitEditing) {
    self.onSubmitEditing(@{@"text": [self.textStorage getPlainString]});
  }
  return _blurOnSubmit;
}
@end
