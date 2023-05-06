"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VariableTextInputView = exports.ITextType = void 0;
var _reactNative = require("react-native");
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const VariableTextInputViewManager = _reactNative.NativeModules.VariableTextInputViewManager;
let ITextType = /*#__PURE__*/function (ITextType) {
  ITextType[ITextType["emoji"] = 1] = "emoji";
  ITextType[ITextType["normal"] = 0] = "normal";
  ITextType[ITextType["tagText"] = 2] = "tagText";
  return ITextType;
}({});
exports.ITextType = ITextType;
const VariableTextInputView = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  const [currentHeight, setCurrentHeight] = (0, _react.useState)(undefined);
  const nativeRef = (0, _react.useRef)(null);
  const _onChange = e => {
    props.onChangeText && props.onChangeText(e.nativeEvent.text);
    props.onChange && props.onChange(e);
  };
  const focus = () => {
    if (_reactNative.Platform.OS === 'android') {
      callNativeMethod('focus');
    } else {
      VariableTextInputViewManager.focus();
    }
  };
  const blur = () => {
    if (_reactNative.Platform.OS === 'android') {
      callNativeMethod('blur');
    } else {
      VariableTextInputViewManager.blur();
    }
  };
  const callNativeMethod = (methodName, data) => {
    const reactTag = (0, _reactNative.findNodeHandle)(nativeRef.current);
    const Commands = _reactNative.UIManager.getViewManagerConfig('VariableTextInputView').Commands;
    const commandId = Commands[methodName] || '';
    _reactNative.UIManager.dispatchViewManagerCommand(reactTag, commandId, !!data ? data : []);
  };
  const insertEmoji = data => {
    const sendData = {
      ...data,
      color: (0, _reactNative.processColor)(data.color)
    };
    if (_reactNative.Platform.OS === 'android') {
      callNativeMethod('insertEmoji', [sendData]);
    } else {
      VariableTextInputViewManager.insertEmoji(sendData);
    }
  };
  const insertMentions = data => {
    const sendData = {
      ...data,
      color: (0, _reactNative.processColor)(data.color)
    };
    if (_reactNative.Platform.OS === 'ios') {
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
          color: (0, _reactNative.processColor)(item.color)
        };
        sendData.push(newItem);
      });
    }
    if (_reactNative.Platform.OS === 'android') {
      callNativeMethod('changeAttributedText', sendData);
    } else {
      VariableTextInputViewManager.changeAttributedText(sendData);
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
  const onAndroidContentSizeChange = event => {
    const {
      style
    } = props;
    const styles = _reactNative.StyleSheet.flatten(style);
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
    if (_reactNative.Platform.OS === 'android') {
      callNativeMethod('dismissTag');
    } else {
      VariableTextInputViewManager.dismissTag();
    }
  };
  (0, _react.useImperativeHandle)(ref, () => {
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
  const style = _reactNative.StyleSheet.flatten([props.style, {
    height: currentHeight
  }]);
  return /*#__PURE__*/_react.default.createElement(RNTVariableTextInputView, _extends({
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
exports.VariableTextInputView = VariableTextInputView;
const RNTVariableTextInputView = (0, _reactNative.requireNativeComponent)('VariableTextInputView');
//# sourceMappingURL=VariableTextInputView.js.map