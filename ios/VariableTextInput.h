//
//  VariableTextInput.h
//  react-native-variable-text-input
//
//  Created by duom青源 on 2023/3/20.
//

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

NS_ASSUME_NONNULL_BEGIN
//@class VariableTextInput;
//@protocol VariableTextInputDelegate <NSObject>

//@optional
//- (void)atTextViewDidChange:(VariableTextInput *)textView;
//
//- (void)atTextViewDidBeginEditing:(VariableTextInput *)textView;
//
//- (void)atTextViewDidEndEditing:(VariableTextInput *)textView;
//
///// 检查到输入特殊文本的回调
//- (void)atTextViewDidInputSpecialText:(VariableTextInput *)textView type:(VariableTextInput *)type;
//
//@end
@interface VariableTextInput : UITextView
/// 特殊文本【艾特、话题】列表，内容可自定义
@property(copy, nonatomic) NSArray<VariableTextInput *> *atUserList;
/// 是否为特殊文本【艾特、话题】
@property(assign, nonatomic, getter=isSpecialText) BOOL bSpecialText;

@property(copy, nonatomic) IBInspectable NSString *placeholder;
@property(nonatomic) IBInspectable double fadeTime;
@property(copy, nonatomic) NSAttributedString *attributedPlaceholder;
@property(strong, nonatomic) UIColor *placeholderTextColor UI_APPEARANCE_SELECTOR;

/// 最大长度设置，默认1000
@property(assign, nonatomic) NSInteger maxTextLength;
@property(strong, nonatomic) UIColor *attributedTextColor;
/// 默认特殊文本高亮颜色，默认UIColor.redColor
@property(strong, nonatomic) UIColor *hightTextColor;
@property(assign, nonatomic) NSInteger lineSpacing;
/// 支持自动检测特殊文本【艾特、话题】，默认YES
@property(assign, nonatomic, getter=isSupport) BOOL bSupport;
@property(nonatomic, copy) RCTBubblingEventBlock onChange;
@property (nonatomic, copy, nullable) RCTDirectEventBlock onContentSizeChange;
@property(nonatomic, copy, nullable) RCTDirectEventBlock onSubmitEditing;
@property(nonatomic,copy, nullable)RCTDirectEventBlock onTag;
@property(nonatomic, copy, nullable) RCTDirectEventBlock onTextInput;
@property(nonatomic, copy, nullable) RCTDirectEventBlock onBlur;
@property(nonatomic, copy, nullable) RCTDirectEventBlock onFocus;
@property(nonatomic, copy, nullable) RCTDirectEventBlock onIOSSelectionChange;
@property(nonatomic, strong) NSDictionary *defultTypingAttributes;
@property(nonatomic, strong) NSArray *tags;
@property(nonatomic, strong) NSString *keyWord;
@property(nonatomic,strong)NSString *tagStr;
@property(nonatomic, assign) Boolean startKeyWord;
@property (nonatomic, strong) NSLayoutConstraint *heightConstraint;
@property (nonatomic, assign) CGFloat paddingTop;
@property (nonatomic, assign) CGFloat paddingLeft;
@property (nonatomic, assign) CGFloat paddingRight;
@property (nonatomic, assign) CGFloat paddingBottom;
@property (nonatomic, assign) CGFloat paddingHorizontal;
@property (nonatomic, assign) CGFloat paddingVertical;
@property (nonatomic, assign) CGFloat padding;
@property (nonatomic, assign) BOOL blurOnSubmit;
- (void)setPlaceholderVisibleForText:(NSString *)str;
- (NSString *)getStrContentInRange:(NSRange)range;
@end

NS_ASSUME_NONNULL_END
