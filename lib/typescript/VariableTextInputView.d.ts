import { StyleProp, TextStyle, ColorValue, NativeSyntheticEvent, TextInputChangeEventData, ImageResolvedAssetSource, TextInputContentSizeChangeEventData, KeyboardTypeOptions } from 'react-native';
import React from 'react';
export interface IVTTextInputData {
    nativeEvent: {
        previousText: string;
        range: {
            end: number;
            start: number;
        };
        target: number;
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
interface IProps {
    onMention?: () => void;
    onTag?: () => void;
    style?: StyleProp<TextStyle> | undefined;
    placeholder?: string;
    placeholderTextColor?: ColorValue;
    keyboardAppearance?: 'default' | 'light' | 'dark';
    onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
    onChangeText?: (text: string) => void;
    value?: string;
    maxTextLength?: number;
    text?: string;
    tags?: string[];
    blurOnSubmit?: boolean;
    onTextInput?: (e: IVTTextInputData) => void;
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
};
export type IATTextViewRef = React.ForwardedRef<IATTextViewBase>;
declare const VariableTextInputView: React.ForwardRefExoticComponent<IProps & React.RefAttributes<IATTextViewBase>>;
export { VariableTextInputView };
//# sourceMappingURL=VariableTextInputView.d.ts.map