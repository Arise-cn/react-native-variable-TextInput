function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import { requireNativeComponent, NativeModules, StyleSheet, processColor, Platform } from 'react-native';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { UIManager } from 'react-native';
import { findNodeHandle } from 'react-native';
const VariableTextInputViewManager = NativeModules.VariableTextInputViewManager;
export let ITextType = /*#__PURE__*/function (ITextType) {
  ITextType[ITextType["emoji"] = 1] = "emoji";
  ITextType[ITextType["normal"] = 0] = "normal";
  ITextType[ITextType["tagText"] = 2] = "tagText";
  return ITextType;
}({});
const VariableTextInputView = /*#__PURE__*/forwardRef((props, ref) => {
  const [currentHeight, setCurrentHeight] = useState(undefined);
  const nativeRef = useRef(null);
  const _onChange = e => {
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
  const callNativeMethod = (methodName, data) => {
    const reactTag = findNodeHandle(nativeRef.current);
    const Commands = UIManager.getViewManagerConfig('VariableTextInputView').Commands;
    const commandId = Commands[methodName] || '';
    UIManager.dispatchViewManagerCommand(reactTag, commandId, !!data ? data : []);
  };
  const insertEmoji = data => {
    const sendData = {
      ...data,
      color: processColor(data.color)
    };
    if (Platform.OS === 'android') {
      callNativeMethod('insertEmoji', [sendData]);
    } else {
      VariableTextInputViewManager.insertEmoji(sendData);
    }
  };
  const insertMentions = data => {
    const sendData = {
      ...data,
      color: processColor(data.color)
    };
    if (Platform.OS === 'ios') {
      VariableTextInputViewManager.insertMentions(sendData);
    } else {
      callNativeMethod('insertMentions', [sendData]);
    }
  };
  const changeAttributedText = data => {
    const sendData = [];
    if (data.length > 0) {
      data.forEach(item => {
        const newItem = {
          ...item,
          color: processColor(item.color)
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
  const onContentSizeChange = event => {
    const {
      style
    } = props;
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
  const onAndroidContentSizeChange = event => {
    const {
      style
    } = props;
    const styles = StyleSheet.flatten(style);
    if (styles.height === undefined) {
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
  const dismissTag = () => {
    if (Platform.OS === 'android') {
      callNativeMethod('dismissTag');
    } else {
      VariableTextInputViewManager.dismissTag();
    }
  };
  useImperativeHandle(ref, () => {
    return {
      focus: focus,
      blur: blur,
      insertEmoji: insertEmoji,
      insertMentions: insertMentions,
      changeAttributedText: changeAttributedText,
      dismissTag: dismissTag
    };
  });
  const onAndroidChange = e => {
    props.onChangeText && props.onChangeText(e.nativeEvent.text);
    props.onChange && props.onChange(e);
  };
  const onAndroidSubmitEditing = () => {};
  const onAndroidTextInput = e => {
    props.onTextInput && props.onTextInput(e);
  };
  const style = StyleSheet.flatten([props.style, {
    height: currentHeight
  }]);
  return /*#__PURE__*/React.createElement(RNTVariableTextInputView, _extends({
    ref: nativeRef,
    onChange: _onChange,
    onContentSizeChange: onContentSizeChange,
    onAndroidChange: onAndroidChange,
    onAndroidContentSizeChange: onAndroidContentSizeChange
  }, props, {
    onAndroidSubmitEditing: onAndroidSubmitEditing,
    onAndroidTextInput: onAndroidTextInput,
    style: style
  }));
});
const RNTVariableTextInputView = requireNativeComponent('VariableTextInputView');
export { VariableTextInputView };
//# sourceMappingURL=VariableTextInputView.js.map