"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VariableTextInputView = void 0;
var _reactNative = require("react-native");
var _react = _interopRequireWildcard(require("react"));
var _Util = require("./Util");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const VariableTextInputView = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  const [currentHeight, setCurrentHeight] = (0, _react.useState)(undefined);
  const nativeRef = (0, _react.useRef)(null);
  const [mention, setMention] = (0, _react.useState)('');
  const [keyWord, setKeyWord] = (0, _react.useState)('');
  const [textValue, setTextValue] = (0, _react.useState)('');
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
    const reactTag = (0, _reactNative.findNodeHandle)(nativeRef.current);
    const Commands = _reactNative.UIManager.getViewManagerConfig('VariableTextInputView').Commands;
    const commandId = Commands[methodName];
    _reactNative.UIManager.dispatchViewManagerCommand(reactTag, commandId || 0, !!data ? data : []);
  };
  const insertEmoji = data => {
    const sendData = {
      ...data,
      color: (0, _reactNative.processColor)(data.color)
    };
    if (_reactNative.Platform.OS === 'android') {
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
      color: (0, _reactNative.processColor)(data.color)
    };
    if (_reactNative.Platform.OS === 'ios') {
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
          color: (0, _reactNative.processColor)(item.color || '#000')
        };
        sendData.push(newItem);
      });
    }
    if (_reactNative.Platform.OS === 'android') {
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
    const styles = _reactNative.StyleSheet.flatten(style);
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
    const str = (0, _Util.deletKeyBord)(textValue, `${mention}${keyWord}`);
    const arr = (0, _Util.getAttributedTextArr)(str, props.emojiData);
    const newAttArr = [...arr, item];
    changeAttributedText(newAttArr);
    clearMention();
  };
  (0, _react.useImperativeHandle)(ref, () => {
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
  const style = _reactNative.StyleSheet.flatten([props.style, {
    height: currentHeight
  }]);
  return /*#__PURE__*/_react.default.createElement(RNTVariableTextInputView, _extends({
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
exports.VariableTextInputView = VariableTextInputView;
const RNTVariableTextInputView = (0, _reactNative.requireNativeComponent)('VariableTextInputView');
//# sourceMappingURL=VariableTextInputView.js.map