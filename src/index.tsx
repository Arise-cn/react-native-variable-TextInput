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
interface PrivateItemData {
  type: ITextType;
  text?: string;
  color?: ProcessedColorValue | null | undefined;
  tag?: '@' | '#';
  name?: string;
  id?: string;
  img?: ImageResolvedAssetSource; //emoji图片
  emojiTag?: string; //[微笑] //emojitag
}
export interface IInserTextAttachmentItem {
  type: ITextType;
  text?: string;
  color?: ColorValue;
  tag?: '@' | '#';
  name?: string;
  id?: string;
  img?: ImageResolvedAssetSource; //emoji图片
  emojiTag?: string; //[微笑] //emojitag
  emojiUri?: string;
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
export type IATTextViewBase = {
  focus: () => void;
  blur: () => void;
  insertEmoji: (img: IInserTextAttachmentItem) => void;
  insertMentions: (data: IInserTextAttachmentItem) => void;
  changeAttributedText: (data: IInserTextAttachmentItem[]) => void;
};
export type IATTextViewRef = React.ForwardedRef<IATTextViewBase>;

const VariableTextInputView = forwardRef(
  (props: IProps, ref: IATTextViewRef) => {
    const [currentHeight, setCurrentHeight] = useState<number | undefined>(
      undefined
    );
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
      if (styles.height === undefined && styles.flex !== 1) {
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
    const onAndroidContentSizeChange = (event: any) => {
      const { style } = props;
      const styles = StyleSheet.flatten(style);
      if (styles.height === undefined && styles.flex !== 1) {
        const contentSizeHeight = event.nativeEvent.contentSize.height;
        if (!!styles.maxHeight && contentSizeHeight > styles.maxHeight) {
          setCurrentHeight(parseFloat(`${styles.maxHeight}`));
          return;
        }
        if (!!styles.minHeight && contentSizeHeight < styles.minHeight) {
          setCurrentHeight(parseFloat(`${styles.minHeight}`));
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
    const style = StyleSheet.flatten([props.style, { height: currentHeight }]);
    return (
      <RNTVariableTextInputView
        ref={nativeRef}
        onChange={_onChange}
        text={props.value}
        onContentSizeChange={onContentSizeChange}
        onAndroidChange={onAndroidChange}
        onAndroidContentSizeChange={onAndroidContentSizeChange}
        {...props}
        style={style}
      />
    );
  }
);
const RNTVariableTextInputView = requireNativeComponent<IProps>(
  'VariableTextInputView'
);
export default VariableTextInputView;
