import {
  requireNativeComponent,
  StyleProp,
  TextStyle,
  ColorValue,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  NativeModules,
  StyleSheet,
  processColor,
  TextInputContentSizeChangeEventData,
  Platform,
  KeyboardTypeOptions,
} from 'react-native';
import React, {
  forwardRef,
  useEffect,
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
  IMentionData,
  IVTTextInputData,
  IonMentionData,
  MentionData,
  PrivateItemData,
} from './exTypes';
import {
  deletKeyBord,
  getAttributedTextArr,
  getMentionColor,
  setUTilEmojiData,
  setUTilMention,
} from './Util';
const VariableTextInputViewManager = NativeModules.VariableTextInputViewManager;
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
  onSubmitEditing?: (text: string) => void;
  onAndroidSubmitEditing?: (text: string) => void;
  submitBehavior?: 'submit';
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
  mentions?: IMentionData[]; //'@','#'
  onMention?: (data: IonMentionData) => void;
  onEndMention?: () => void;
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
    const [hasKeyWord, setHasKeyWord] = useState<boolean>(false);
    const _onChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      const text = e.nativeEvent.text;
      setTextValue(text);
      if (!!props.mentions && props.mentions.length > 0 && text.length > 0) {
        const lastStr = text.slice(-1);
        const isMention = props.mentions.filter((item) => item.tag === lastStr);
        if (isMention.length > 0) {
          setMention(lastStr);
          setKeyWord('');
          setHasKeyWord(true);
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
      if (textValue.length > text.length) {
        const lastStr = text.slice(-1);
        const isMention = !!props.mentions
          ? props.mentions?.filter((item) => item.tag === lastStr)
          : [];
        if (isMention.length > 0) {
          setKeyWord('');
          setMention('');
          setHasKeyWord(false);
          props.onEndMention && props.onEndMention();
        }
      }
      props.onChangeText && props.onChangeText(text);
      props.onChange && props.onChange(e);
    };
    useEffect(() => {
      if (!!props.mentions) {
        setUTilMention(props.mentions);
      }
    }, [props.mentions]);
    useEffect(() => {
      if (!!props.emojiData) {
        setUTilEmojiData(props.emojiData);
      }
    }, [props.emojiData]);
    const clearMention = () => {
      if (!!mention) {
        setMention('');
        setKeyWord('');
        setHasKeyWord(false);
      }
    };
    const focus = () => {
      if (Platform.OS === 'android') {
        callNativeMethod('focus');
      } else {
        VariableTextInputViewManager.focus();
      }
    };
    const blur = () => {
      if (Platform.OS === 'android') {
        callNativeMethod('blur');
      } else {
        VariableTextInputViewManager.blur();
      }
      clearMention();
    };
    const callNativeMethod = (methodName: string, data?: any) => {
      const reactTag = findNodeHandle(nativeRef.current);
      const Commands = UIManager.getViewManagerConfig(
        'VariableTextInputView'
      ).Commands;
      const commandId = Commands[methodName] || '';
      UIManager.dispatchViewManagerCommand(
        reactTag,
        commandId,
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
        VariableTextInputViewManager.insertEmoji(sendData);
      }
    };
    const insertMentions = (data: IInserTextAttachmentItem) => {
      const sendData: PrivateItemData = {
        ...data,
        color: processColor(data.color),
      };
      if (Platform.OS === 'ios') {
        VariableTextInputViewManager.insertMentions(sendData);
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
            color: processColor(item.color),
          };
          sendData.push(newItem);
        });
      }
      if (Platform.OS === 'android') {
        callNativeMethod('changeAttributedText', sendData);
      } else {
        VariableTextInputViewManager.changeAttributedText(sendData);
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
        tag: mention,
        color: getMentionColor(mention),
      };
      const str = hasKeyWord
        ? deletKeyBord(textValue, `${mention}${keyWord}`)
        : textValue;
      if (str.length === 0) {
        changeAttributedText([item]);
        clearMention();
        return;
      }
      const arr = getAttributedTextArr(str);
      const fiArr = arr.filter(
        (fItem) =>
          `${fItem.tag}${fItem.name}${fItem.id}` !==
          `${mention}${data.name}${data.id}`
      );
      const newAttArr = [...fiArr, item];
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
    const onAndroidSubmitEditing = () => {};
    const onAndroidTextInput = (e: IVTTextInputData) => {
      props.onTextInput && props.onTextInput(e);
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
        onAndroidSubmitEditing={onAndroidSubmitEditing}
        onAndroidTextInput={onAndroidTextInput}
        style={style}
      />
    );
  }
);
const RNTVariableTextInputView = requireNativeComponent<INativeProps>(
  'VariableTextInputView'
);
export { VariableTextInputView };
