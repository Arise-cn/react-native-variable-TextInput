package com.variabletextinput;

import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.text.InputFilter;
import android.text.InputType;
import android.text.Layout;
import android.util.Log;
import android.view.Gravity;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.Spacing;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.annotations.ReactPropGroup;
import com.facebook.yoga.YogaConstants;
import com.variabletextinput.view.VariableTextInput;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

public class VariableTextInputViewManager extends SimpleViewManager<VariableTextInput> {
  private enum RNTONATIVEMETHOD {
    focus("focus"),
    blur("blur"),
    insertEmoji("insertEmoji"),
    insertMentions("insertMentions"),
    changeAttributedText("changeAttributedText");

    private String name;

    RNTONATIVEMETHOD(String name) {
      this.name = name;
    }

    public String getName() {
      return name;
    }
  }

  private static final int[] PADDING_TYPES = {
      Spacing.ALL, Spacing.LEFT, Spacing.RIGHT, Spacing.TOP, Spacing.BOTTOM,
  };
  private static final int[] SPACING_TYPES = {
      Spacing.ALL, Spacing.LEFT, Spacing.RIGHT, Spacing.TOP, Spacing.BOTTOM,
  };
  public static final String REACT_CLASS = "VariableTextInputView";
  ReactApplicationContext mCallerContext;
  VariableTextInput editText;

  public VariableTextInputViewManager(ReactApplicationContext reactContext) {
    mCallerContext = reactContext;
  }

  @Override
  @NonNull
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  @NonNull
  public VariableTextInput createViewInstance(final ThemedReactContext reactContext) {
    editText = new VariableTextInput(reactContext);
    return editText;
  }

  @ReactProp(name = "text")
  public void setText(VariableTextInput view, String text) {
    view.setText(text);
  }

  @ReactProp(name = ViewProps.COLOR, customType = "Color")
  public void setColor(VariableTextInput view, @Nullable Integer color) {
    if (color != null) {
      view.setTextColor(color);
    }
  }

  @ReactProp(name = ViewProps.BACKGROUND_COLOR, customType = "Color")
  public void setBackGroundColor(VariableTextInput view, @Nullable Integer color) {
    if (color != null) {
      view.setBackGroundColor(color);
    }
  }

  @ReactProp(name = ViewProps.FONT_SIZE, customType = "FontColor")
  public void setFontSize(VariableTextInput view, @Nullable Integer fontSize) {
    if (fontSize != null) {
      view.setFontSize(fontSize);
    }
  }

  @ReactProp(name = ViewProps.FONT_FAMILY, customType = "FontFamily")
  public void setFontFontFamily(VariableTextInput view, @Nullable String fontFamily) {
    if (fontFamily != null) {
      view.setFontFamily(fontFamily);
    }
  }

  @ReactProp(name = "selectionColor", customType = "Color")
  public void setSelectionColor(VariableTextInput view, @Nullable Integer color) {
    if (color != null) {
      view.setHighlightColor(color);
    }
  }

  @ReactProp(name = "maxLength")
  public void setMaxLength(VariableTextInput view, @Nullable Integer maxLength) {
    view.setMaxLength(maxLength);
  }

  @ReactProp(name = "handlesColor", customType = "Color")
  public void setHandlesColor(VariableTextInput view, @Nullable Integer color) {
    if (color != null) {
      view.setHandlesColor(color);
    }
  }

  @ReactPropGroup(names = {
      "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"
  }, customType = "String")
  public void setPadding(VariableTextInput view, int index, Integer padding) {
    view.setContentPadding(PADDING_TYPES[index], padding);
  }

  @ReactPropGroup(names = {
      ViewProps.BORDER_RADIUS,
      ViewProps.BORDER_TOP_LEFT_RADIUS,
      ViewProps.BORDER_TOP_RIGHT_RADIUS,
      ViewProps.BORDER_BOTTOM_RIGHT_RADIUS,
      ViewProps.BORDER_BOTTOM_LEFT_RADIUS
  }, defaultFloat = YogaConstants.UNDEFINED)
  public void setBorderRadius(VariableTextInput view, int index, float borderRadius) {
    if (!YogaConstants.isUndefined(borderRadius)) {
      borderRadius = PixelUtil.toPixelFromDIP(borderRadius);
    }

    if (index == 0) {
      view.setBorderRadius(borderRadius);
    } else {
      view.setBorderRadius(borderRadius, index - 1);
    }
  }

  @ReactPropGroup(names = {
      ViewProps.BORDER_WIDTH,
      ViewProps.BORDER_LEFT_WIDTH,
      ViewProps.BORDER_RIGHT_WIDTH,
      ViewProps.BORDER_TOP_WIDTH,
      ViewProps.BORDER_BOTTOM_WIDTH,
  }, defaultFloat = YogaConstants.UNDEFINED)
  public void setBorderWidth(VariableTextInput view, int index, float width) {
    if (!YogaConstants.isUndefined(width)) {
      width = PixelUtil.toPixelFromDIP(width);
    }
    view.setBorderWidth(SPACING_TYPES[index], width);
  }

  @ReactPropGroup(names = {
      "borderColor",
      "borderLeftColor",
      "borderRightColor",
      "borderTopColor",
      "borderBottomColor"
  }, customType = "Color")
  public void setBorderColor(VariableTextInput view, int index, Integer color) {
    float rgbComponent = color == null ? YogaConstants.UNDEFINED : (float) ((int) color & 0x00FFFFFF);
    float alphaComponent = color == null ? YogaConstants.UNDEFINED : (float) ((int) color >>> 24);
    view.setBorderColor(SPACING_TYPES[index], rgbComponent, alphaComponent);
  }

  @ReactProp(name = "borderStyle")
  public void setBorderStyle(VariableTextInput view, @Nullable String borderStyle) {
    view.setBorderStyle(borderStyle);
  }

  @ReactProp(name = "autoFocus")
  public void setAutoFocus(VariableTextInput view, boolean autoFocus) {
    view.setAutoFocus(autoFocus);
  }

  @ReactProp(name = "editable")
  public void setEditable(VariableTextInput view, boolean editable) {
    view.setEditable(editable);
  }

  public void blur(VariableTextInput view) {
    view.blur();
  }

  @ReactProp(name = "placeholder")
  public void setPlaceholder(VariableTextInput view, String placeholder) {
    view.setPlaceholder(placeholder);
  }

  @ReactProp(name = "placeholderTextColor", customType = "Color")
  public void setPlaceholderTextColor(VariableTextInput view, @Nullable Integer placeholderColor) {
    view.setPlaceholderColor(placeholderColor);
  }

  @ReactProp(name = "selectionColor", customType = "Color")
  public void setSelectionColor(EditText view, @Nullable Integer color) {
    if (color != null) {
      view.setHighlightColor(color);
    }
  }

  @ReactProp(name = "disableFullscreenUI", defaultBoolean = false)
  public void setDisableFullscreenUI(VariableTextInput view, boolean disableFullscreenUI) {
    view.setDisableFullscreenUI(disableFullscreenUI);
  }

  @ReactProp(name = "returnKeyType")
  public void setReturnKeyType(VariableTextInput view, String returnKeyType) {
    view.setReturnKeyType(returnKeyType);
  }

  private static final int IME_ACTION_ID = 0x670;

  @ReactProp(name = "returnKeyLabel")
  public void setReturnKeyLabel(VariableTextInput view, String returnKeyLabel) {
    view.setImeActionLabel(returnKeyLabel, IME_ACTION_ID);
  }

  @ReactProp(name = "submitBehavior")
  public void setSubmitBehavior(VariableTextInput view, @Nullable String submitBehavior) {
    view.setSubmitBehavior(submitBehavior);
  }

  @ReactProp(name = "underlineColorAndroid", customType = "Color")
  public void setUnderlineColor(VariableTextInput view, @Nullable Integer underlineColor) {
    // Drawable.mutate() can sometimes crash due to an AOSP bug:
    // See https://code.google.com/p/android/issues/detail?id=191754 for more info
    Drawable background = view.getBackground();
    Drawable drawableToMutate = background;

    if (background == null) {
      return;
    }

    if (background.getConstantState() != null) {
      try {
        drawableToMutate = background.mutate();
      } catch (NullPointerException e) {
        // FLog.e(TAG, "NullPointerException when setting underlineColorAndroid for
        // TextInput", e);
      }
    }

    if (underlineColor == null) {
      drawableToMutate.clearColorFilter();
    } else {
      // fixes underlineColor transparent not working on API 21
      // re-sets the TextInput underlineColor https://bit.ly/3M4alr6
      if (Build.VERSION.SDK_INT == Build.VERSION_CODES.LOLLIPOP) {
        int bottomBorderColor = view.getBorderColor(Spacing.BOTTOM);
        setBorderColor(view, Spacing.START, underlineColor);
        drawableToMutate.setColorFilter(underlineColor, PorterDuff.Mode.SRC_IN);
        setBorderColor(view, Spacing.START, bottomBorderColor);
      } else {
        drawableToMutate.setColorFilter(underlineColor, PorterDuff.Mode.SRC_IN);
      }
    }
  }

  @ReactProp(name = "onSelectionChange", defaultBoolean = false)
  public void setOnSelectionChange(final VariableTextInput view, boolean onSelectionChange) {
    // if (onSelectionChange) {
    // view.setSelectionWatcher(new ReactSelectionWatcher(view));
    // } else {
    // view.setSelectionWatcher(null);
    // }
  }

  @ReactProp(name = "keyboardType")
  public void setKeyboardType(VariableTextInput view, String keyboardType) {
    switch (keyboardType) {
      case "default": {
        view.setInputType(EditorInfo.TYPE_CLASS_TEXT);
      }
        break;
      case "numeric":
        view.setInputType(EditorInfo.TYPE_CLASS_NUMBER);
        break;
      case "email-address":
        view.setInputType(EditorInfo.TYPE_CLASS_TEXT | EditorInfo.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);
        break;
      case "phone-pad":
        view.setInputType(EditorInfo.TYPE_CLASS_PHONE);
        break;
      case "url":
        view.setInputType(EditorInfo.TYPE_CLASS_TEXT | EditorInfo.TYPE_TEXT_VARIATION_URI);
        break;
      default:
        view.setInputType(EditorInfo.TYPE_CLASS_TEXT);
        break;
    }
  }

  /**
   * 接受交互通知
   *
   * @return
   */
  @Nullable
  @Override
  public Map<String, Integer> getCommandsMap() {
    Map<String, Integer> map = new HashMap<>();
    map.put(RNTONATIVEMETHOD.focus.name, 5);
    map.put(RNTONATIVEMETHOD.blur.name, 1);
    map.put(RNTONATIVEMETHOD.insertEmoji.name, 2);
    map.put(RNTONATIVEMETHOD.insertMentions.name, 3);
    map.put(RNTONATIVEMETHOD.changeAttributedText.name, 4);
    return map;
  }

  /**
   * 根据命令ID，处理对应任务
   *
   * @param root
   * @param commandId
   * @param args
   */
  @Override
  public void receiveCommand(VariableTextInput root, int commandId, @Nullable ReadableArray args) {

    switch (commandId) {
      case 5:
        // focus打开键盘
        root.focus();
        break;
      case 1:
        root.blur();
        break;
      case 2:
      case 3:
        root.handleRichText(args);
        break;
      case 4:
        // 更改富文本
        root.clearText();
        root.handleRichText(args);
        break;
      default:
        break;
    }
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put("EVENT_NAME", "onChange");
    return constants;
  }

  @Override
  public @Nullable Map getExportedCustomDirectEventTypeConstants() {
    return MapBuilder.builder().put(
        "onAndroidChange",
        MapBuilder.of("registrationName", "onAndroidChange")).put("onAndroidContentSizeChange",
            MapBuilder.of("registrationName", "onAndroidContentSizeChange"))
        .put("onAndroidTextInput", MapBuilder.of("registrationName", "onAndroidTextInput")).put(
        "onAndroidBlur",
        MapBuilder.of("registrationName", "onAndroidBlur")).put(
      "onAndroidFocus",
      MapBuilder.of("registrationName", "onAndroidFocus")).build();
  }
}
