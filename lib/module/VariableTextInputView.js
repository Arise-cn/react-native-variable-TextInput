function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import { requireNativeComponent, StyleSheet, processColor, Platform } from 'react-native';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { UIManager } from 'react-native';
import { findNodeHandle } from 'react-native';
import { deletKeyBord, getAttributedTextArr } from './Util';
const VariableTextInputView = /*#__PURE__*/forwardRef((props, ref) => {
  const [currentHeight, setCurrentHeight] = useState(undefined);
  const nativeRef = useRef(null);
  const [mention, setMention] = useState('');
  const [keyWord, setKeyWord] = useState('');
  const [textValue, setTextValue] = useState('');
  const _onChange = e => {
    const text = e.nativeEvent.text;
    setTextValue(text);
    if (!!props.mentions && props.mentions.length > 0 && text.length > 0) {
      const lastStr = text.slice(-1);
      if (props.mentions.includes(lastStr)) {
        setMention(lastStr);
        props.onMention && props.onMention({
          mention: lastStr,
          keyWord: ''
        });
      }
      if (!!mention) {
        const result = text.split(mention).pop();
        const mentionData = {
          mention,
          keyWord: result || ''
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
  const callNativeMethod = (methodName, data) => {
    const reactTag = findNodeHandle(nativeRef.current);
    const Commands = UIManager.getViewManagerConfig('VariableTextInputView').Commands;
    const commandId = Commands[methodName];
    UIManager.dispatchViewManagerCommand(reactTag, commandId || 0, !!data ? data : []);
  };
  const insertEmoji = data => {
    const sendData = {
      ...data,
      color: processColor(data.color)
    };
    if (Platform.OS === 'android') {
      callNativeMethod('insertEmoji', [sendData]);
    } else {
      callNativeMethod('insertEmoji', [{
        data: [sendData]
      }]);
    }
  };
  const insertMentions = data => {
    const sendData = {
      ...data,
      color: processColor(data.color)
    };
    if (Platform.OS === 'ios') {
      callNativeMethod('insertMentions', [{
        data: sendData
      }]);
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
          color: processColor(item.color || '#000')
        };
        sendData.push(newItem);
      });
    }
    if (Platform.OS === 'android') {
      callNativeMethod('changeAttributedText', sendData);
    } else {
      callNativeMethod('changeAttributedText', [{
        data: sendData
      }]);
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
  const insertMentionAndDelateKeyword = data => {
    const item = {
      type: 2,
      ...data
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
      insertMentionAndDelateKeyword: insertMentionAndDelateKeyword
    };
  });
  const _onSubmitEditing = e => {
    props.onSubmitEditing && props.onSubmitEditing(e.nativeEvent.text);
  };
  const onAndroidSubmitEditing = e => {
    props.onSubmitEditing && props.onSubmitEditing(e.nativeEvent.text);
  };
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
    onAndroidChange: _onChange,
    onAndroidContentSizeChange: onContentSizeChange
  }, props, {
    onSubmitEditing: _onSubmitEditing,
    onAndroidSubmitEditing: onAndroidSubmitEditing,
    onAndroidTextInput: onAndroidTextInput,
    onAndroidBlur: props.onBlur,
    onAndroidFocus: props.onFocus,
    style: style
  }));
});
const RNTVariableTextInputView = requireNativeComponent('VariableTextInputView');
export { VariableTextInputView };
//# sourceMappingURL=VariableTextInputView.js.map