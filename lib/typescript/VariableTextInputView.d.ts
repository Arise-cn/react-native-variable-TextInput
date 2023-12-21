import { StyleProp, TextStyle, ColorValue, NativeSyntheticEvent, TextInputChangeEventData, TextInputContentSizeChangeEventData, KeyboardTypeOptions, ReturnKeyTypeOptions } from 'react-native';
import React from 'react';
import type { IATTextViewBase, IEmojiData, IVTTextInputData, IonMentionData } from './exTypes';
interface IProps {
    style?: StyleProp<TextStyle> | undefined;
    placeholder?: string;
    placeholderTextColor?: ColorValue;
    keyboardAppearance?: 'default' | 'light' | 'dark';
    onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
    onChangeText?: (text: string) => void;
    maxTextLength?: number;
    text?: string;
    blurOnSubmit?: boolean;
    onTextInput?: (event: IVTTextInputData) => void;
    onContentSizeChange?: (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => void;
    underlineColorAndroid?: ColorValue;
    keyboardType?: KeyboardTypeOptions | undefined;
    onSubmitEditing?: (text: string) => void;
    submitBehavior?: 'submit';
    emojiData?: IEmojiData[];
    mentions?: string[];
    onMention?: (data: IonMentionData) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    returnKeyType?: ReturnKeyTypeOptions | undefined;
}
export type IATTextViewRef = React.ForwardedRef<IATTextViewBase>;
declare const VariableTextInputView: React.ForwardRefExoticComponent<IProps & React.RefAttributes<IATTextViewBase>>;
export { VariableTextInputView };
//# sourceMappingURL=VariableTextInputView.d.ts.map