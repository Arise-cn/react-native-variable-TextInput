import {
  requireNativeComponent,
  StyleProp,
  TextStyle,
  ColorValue,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  NativeModules,
  ImageResolvedAssetSource,
  StyleSheet,
  processColor,
  ProcessedColorValue,
  TextInputContentSizeChangeEventData,
  Platform,
} from 'react-native';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { UIManager } from 'react-native';
import { findNodeHandle } from 'react-native';
const VariableTextInputViewManager = NativeModules.VariableTextInputViewManager;
export interface IVTTextInputData {
  nativeEvent: {
    previousText: string;
    range: { end: number; start: number };
    target: number;
    text: string;
  };
}
export enum ITextType {
  emoji = 1,
  normal = 0,
  tagText = 2,
}
export interface IInserTextAttachmentItem {
  type: ITextType;
  targData?: ISendTagMensage;
  emojiData?: IInsertEmojiConfig;
  text?: string;
}
interface IProps {
  onMention?: () => void;
  onTag?: () => void;
  style?: StyleProp<TextStyle> | undefined;
  placeholder?: string;
  placeholderTextColor?: ColorValue;
  onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  onChangeText?: (text: string) => void;
  value?: string;
  maxTextLength?: number;
  text?: string;
  tags?: string[];
  onTextInput?: (e: IVTTextInputData) => void;
  onContentSizeChange?: (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => void;
  underlineColorAndroid?: ColorValue;
  onAndroidChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  onAndroidContentSizeChange?: (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => void;
}
interface IInsertTagConfig {
  tag: '@' | '#';
  name: string;
  id: string;
  color: ColorValue;
}
interface ISendTagMensage {
  color: ProcessedColorValue | null | undefined;
  tag: '@' | '#';
  name: string;
  id: string;
}
interface IInsertEmojiConfig {
  img: ImageResolvedAssetSource;
  tag: string; //[微笑]
}
export type IATTextViewBase = {
  focus: () => void;
  blur: () => void;
  insertEmoji: (img: IInsertEmojiConfig) => void;
  insertMentions: (data: IInsertTagConfig) => void;
  changeAttributedText: (data: IInserTextAttachmentItem[]) => void;
};
export type IATTextViewRef = React.ForwardedRef<IATTextViewBase>;

const VariableTextInputView = forwardRef(
  (props: IProps, ref: IATTextViewRef) => {
    const [currentHeight, setCurrentHeight] = useState(undefined);
    const nativeRef = useRef(null);
    const _onChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      props.onChangeText && props.onChangeText(e.nativeEvent.text);
      props.onChange && props.onChange(e);
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
        !!data ? [data] : []
      );
    };
    const insertEmoji = (data: IInsertEmojiConfig) => {
      if (Platform.OS === 'android') {
        callNativeMethod('insertEmoji', data);
      } else {
        VariableTextInputViewManager.insertEmoji(data);
      }
    };
    const insertMentions = (data: IInsertTagConfig) => {
      const sendData: ISendTagMensage = {
        color: processColor(data.color),
        tag: data.tag,
        name: data.name,
        id: data.id,
      };
      if (Platform.OS === 'ios') {
        VariableTextInputViewManager.insertMentions(sendData);
      } else {
        callNativeMethod('insertMentions', sendData);
      }
    };
    const changeAttributedText = (data: IInserTextAttachmentItem[]) => {
      if (Platform.OS === 'android') {
        callNativeMethod('changeAttributedText', data);
      } else {
        VariableTextInputViewManager.changeAttributedText(data);
      }
    };
    const onContentSizeChange = (event: any) => {
      const { style } = props;
      const styles = StyleSheet.flatten(style);
      if (!styles.height && styles.flex !== 1) {
        const contentSizeHeight = event.nativeEvent.contentSize.height;
        if (!!styles.maxHeight && contentSizeHeight > styles.maxHeight) {
          return;
        }
        setCurrentHeight(event.nativeEvent.contentSize.height);
      }
    };
    const onAndroidContentSizeChange = (event: any) => {
      const { style } = props;
      const styles = StyleSheet.flatten(style);
      if (!styles.height && styles.flex !== 1) {
        const contentSizeHeight = event.nativeEvent.contentSize.height;
        if (!!styles.maxHeight && contentSizeHeight > styles.maxHeight) {
          return;
        }
        setCurrentHeight(event.nativeEvent.contentSize.height);
      }
    };
    useImperativeHandle(ref, () => {
      return {
        focus: focus,
        blur: blur,
        insertEmoji: insertEmoji,
        insertMentions: insertMentions,
        changeAttributedText: changeAttributedText,
      };
    });
    const onAndroidChange = (
      e: NativeSyntheticEvent<TextInputChangeEventData>
    ) => {
      props.onChangeText && props.onChangeText(e.nativeEvent.text);
      props.onChange && props.onChange(e);
    };
    const style = StyleSheet.flatten([{ height: currentHeight }, props.style]);
    return (
      <RNTVariableTextInputView
        ref={nativeRef}
        onChange={_onChange}
        style={style}
        text={props.value}
        onContentSizeChange={onContentSizeChange}
        onAndroidChange={onAndroidChange}
        onAndroidContentSizeChange={onAndroidContentSizeChange}
        {...props}
      />
    );
  }
);
const RNTVariableTextInputView = requireNativeComponent<IProps>(
  'VariableTextInputView'
);
export default VariableTextInputView;
