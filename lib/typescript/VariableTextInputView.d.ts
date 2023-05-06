import { StyleProp, TextStyle, ColorValue, NativeSyntheticEvent, TextInputChangeEventData, ImageResolvedAssetSource, TextInputContentSizeChangeEventData, KeyboardTypeOptions } from 'react-native';
import React from 'react';
export interface IVTTextInputData {
    nativeEvent: {
        text: string;
    };
}
export declare enum ITextType {
    emoji = 1,
    normal = 0,
    tagText = 2
}
export interface IInserTextAttachmentItem {
    type: ITextType;
    text?: string;
    color?: ColorValue;
    tag?: '@' | '#';
    name?: string;
    id?: string;
    img?: ImageResolvedAssetSource;
    emojiTag?: string;
    emojiUri?: string;
}
export interface IOnTagsType {
    tag: string;
    keyWord: string;
}
interface IProps {
    onMention?: () => void;
    style?: StyleProp<TextStyle> | undefined;
    placeholder?: string;
    placeholderTextColor?: ColorValue;
    keyboardAppearance?: 'default' | 'light' | 'dark';
    onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
    onChangeText?: (text: string) => void;
    value?: string;
    maxTextLength?: number;
    text?: string;
    blurOnSubmit?: boolean;
    onTextInput?: (event: IVTTextInputData) => void;
    onAndroidTextInput?: (event: IVTTextInputData) => void;
    onContentSizeChange?: (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => void;
    underlineColorAndroid?: ColorValue;
    onAndroidChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
    onAndroidContentSizeChange?: (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => void;
    keyboardType?: KeyboardTypeOptions | undefined;
    onSubmitEditing?: (text: string) => void;
    onAndroidSubmitEditing?: (text: string) => void;
    submitBehavior?: 'submit';
}
export type IATTextViewBase = {
    focus: () => void;
    blur: () => void;
    insertEmoji: (img: IInserTextAttachmentItem) => void;
    insertMentions: (data: IInserTextAttachmentItem) => void;
    changeAttributedText: (data: IInserTextAttachmentItem[]) => void;
    dismissTag: () => void;
};
export type IATTextViewRef = React.ForwardedRef<IATTextViewBase>;
declare const VariableTextInputView: React.ForwardRefExoticComponent<IProps & React.RefAttributes<IATTextViewBase>>;
export { VariableTextInputView };
//# sourceMappingURL=VariableTextInputView.d.ts.map