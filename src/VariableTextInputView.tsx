import {
  requireNativeComponent,
  StyleProp,
  TextStyle,
  ColorValue,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  StyleSheet,
  processColor,
  TextInputContentSizeChangeEventData,
  Platform,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  TextInputSelectionChangeEventData,
} from 'react-native';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { UIManager } from 'react-native';
import { findNodeHandle } from 'react-native';
import type {
  IATTextViewBase,
  IEmojiData,
  IInserTextAttachmentItem,
  IVSelection,
  IVTTextInputData,
  IonMentionData,
  MentionData,
  PrivateItemData,
} from './exTypes';
import { deletKeyBord, getAttributedTextArr } from './Util';
interface INativeProps {
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
  onContentSizeChange?: (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => void;
  underlineColorAndroid?: ColorValue;
  onAndroidChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  onAndroidContentSizeChange?: (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => void;
  keyboardType?: KeyboardTypeOptions | undefined;
  onSubmitEditing?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  onAndroidSubmitEditing?: (e: IVTTextInputData) => void;
  submitBehavior?: 'submit';
  onBlur?: () => void;
  onFocus?: () => void;
  onAndroidFocus?: () => void;
  onAndroidBlur?: () => void;
  returnKeyType?: ReturnKeyTypeOptions | undefined;
  onIOSSelectionChange?: (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => void;
  onAndroidSelectionChange?: (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => void;
}
interface IProps {
  style?: StyleProp<TextStyle> | undefined;
  placeholder?: string;
  placeholderTextColor?: ColorValue;
  keyboardAppearance?: 'default' | 'light' | 'dark'; //ios only
  onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  onChangeText?: (text: string) => void;
  maxTextLength?: number;
  text?: string;
  blurOnSubmit?: boolean;
  onTextInput?: (event: IVTTextInputData) => void;
  onContentSizeChange?: (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => void;
  underlineColorAndroid?: ColorValue;
  keyboardType?: KeyboardTypeOptions | undefined;
  onSubmitEditing?: (text: string) => void;
  submitBehavior?: 'submit';
  emojiData?: IEmojiData[];
  mentions?: string[]; //'@','#'
  onMention?: (data: IonMentionData) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  returnKeyType?: ReturnKeyTypeOptions | undefined;
  onSelectionChange?: (e: IVSelection) => void;
}
export type IATTextViewRef = React.ForwardedRef<IATTextViewBase>;

const VariableTextInputView = forwardRef(
  (props: IProps, ref: IATTextViewRef) => {
    const [currentHeight, setCurrentHeight] = useState<number | undefined>(
      undefined
    );
    const nativeRef = useRef(null);
    const [mention, setMention] = useState<string>('');
    const [keyWord, setKeyWord] = useState<string>('');
    const [textValue, setTextValue] = useState<string>('');
    const _onChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      const text = e.nativeEvent.text;
      setTextValue(text);
      if (!!props.mentions && props.mentions.length > 0 && text.length > 0) {
        const lastStr = text.slice(-1);
        if (props.mentions.includes(lastStr)) {
          setMention(lastStr);
          props.onMention && props.onMention({ mention: lastStr, keyWord: '' });
        }
        if (!!mention) {
          const result = text.split(mention).pop();
          const mentionData: IonMentionData = {
            mention,
            keyWord: result || '',
          };
          setKeyWord(result || '');
          props.onMention && props.onMention(mentionData);
        }
      }
      props.onChangeText && props.onChangeText(text);
      props.onChange && props.onChange(e);
    };
    const clearMention = () => {
      if (!!mention) {
        setMention('');
        setKeyWord('');
      }
    };
    const focus = () => {
      callNativeMethod('focus');
    };
    const blur = () => {
      callNativeMethod('blur');
      clearMention();
    };
    const callNativeMethod = (methodName: string, data?: any) => {
      const reactTag = findNodeHandle(nativeRef.current);
      const Commands = UIManager.getViewManagerConfig(
        'VariableTextInputView'
      ).Commands;
      const commandId = Commands[methodName];
      UIManager.dispatchViewManagerCommand(
        reactTag,
        commandId || 0,
        !!data ? data : []
      );
    };
    const insertEmoji = (data: IInserTextAttachmentItem) => {
      const sendData: PrivateItemData = {
        ...data,
        color: processColor(data.color),
      };
      if (Platform.OS === 'android') {
        callNativeMethod('insertEmoji', [sendData]);
      } else {
        callNativeMethod('insertEmoji', [{ data: [sendData] }]);
      }
    };
    const insertMentions = (data: IInserTextAttachmentItem) => {
      const sendData: PrivateItemData = {
        ...data,
        color: processColor(data.color),
      };
      if (Platform.OS === 'ios') {
        callNativeMethod('insertMentions', [{ data: sendData }]);
      } else {
        callNativeMethod('insertMentions', [sendData]);
      }
    };
    const changeAttributedText = (data: IInserTextAttachmentItem[]) => {
      const sendData: PrivateItemData[] = [];
      if (data.length > 0) {
        data.forEach((item) => {
          const newItem: PrivateItemData = {
            ...item,
            color: processColor(item.color || '#000'),
          };
          sendData.push(newItem);
        });
      }
      if (Platform.OS === 'android') {
        callNativeMethod('changeAttributedText', sendData);
      } else {
        callNativeMethod('changeAttributedText', [{ data: sendData }]);
      }
    };
    const onContentSizeChange = (event: any) => {
      const { style } = props;
      const styles = StyleSheet.flatten(style);
      if (styles.height === undefined) {
        const contentSizeHeight = event.nativeEvent.contentSize.height;
        if (!!styles.maxHeight && contentSizeHeight >= styles.maxHeight) {
          setCurrentHeight(parseFloat(`${styles.maxHeight}`));
          return;
        }
        if (!!styles.minHeight && contentSizeHeight <= styles.minHeight) {
          setCurrentHeight(parseFloat(`${styles.minHeight}`));
          return;
        }
        setCurrentHeight(event.nativeEvent.contentSize.height);
      }
    };
    const insertMentionAndDelateKeyword = (data: MentionData) => {
      const item: IInserTextAttachmentItem = {
        type: 2,
        ...data,
      };
      const str = deletKeyBord(textValue, `${mention}${keyWord}`);
      const arr = getAttributedTextArr(str, props.emojiData);
      const newAttArr = [...arr, item];
      changeAttributedText(newAttArr);
      clearMention();
    };
    useImperativeHandle(ref, () => {
      return {
        focus: focus,
        blur: blur,
        insertEmoji: insertEmoji,
        insertMentions: insertMentions,
        changeAttributedText: changeAttributedText,
        insertMentionAndDelateKeyword: insertMentionAndDelateKeyword,
      };
    });
    const _onSubmitEditing = (
      e: NativeSyntheticEvent<TextInputChangeEventData>
    ) => {
      props.onSubmitEditing && props.onSubmitEditing(e.nativeEvent.text);
    };
    const onAndroidSubmitEditing = (e: IVTTextInputData) => {
      props.onSubmitEditing && props.onSubmitEditing(e.nativeEvent.text);
    };
    const onAndroidTextInput = (e: IVTTextInputData) => {
      props.onTextInput && props.onTextInput(e);
    };
    const _onSelectionChange = (
      e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
    ) => {
      props.onSelectionChange &&
        props.onSelectionChange({ nativeEvent: e.nativeEvent.selection });
    };
    const style = StyleSheet.flatten([props.style, { height: currentHeight }]);
    return (
      <RNTVariableTextInputView
        ref={nativeRef}
        onChange={_onChange}
        onContentSizeChange={onContentSizeChange}
        onAndroidChange={_onChange}
        onAndroidContentSizeChange={onContentSizeChange}
        {...props}
        onSubmitEditing={_onSubmitEditing}
        onAndroidSubmitEditing={onAndroidSubmitEditing}
        onAndroidTextInput={onAndroidTextInput}
        onAndroidBlur={props.onBlur}
        onAndroidFocus={props.onFocus}
        onIOSSelectionChange={_onSelectionChange}
        onAndroidSelectionChange={_onSelectionChange}
        style={style}
      />
    );
  }
);
const RNTVariableTextInputView = requireNativeComponent<INativeProps>(
  'VariableTextInputView'
);
export { VariableTextInputView };
