package com.variabletextinput;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.Spacing;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.annotations.ReactPropGroup;

import java.util.HashMap;
import java.util.Map;
public class VariableTextInputViewManager extends SimpleViewManager<VariableTextInput>  {
  private enum RNTONATIVEMETHOD {
    focus("focus"),
    blur("blur"),
    insertEmoji("insertEmoji"),
    insertMentions("insertMentions"),
    changeAttributedText("changeAttributedText");
    private String name;
    RNTONATIVEMETHOD(String name){
      this.name = name;
    }
    public String getName(){
      return name;
    }
  }
  private static final int[] PADDING_TYPES = {
    Spacing.ALL, Spacing.LEFT, Spacing.RIGHT, Spacing.TOP, Spacing.BOTTOM,
  };
  public static final String REACT_CLASS = "VariableTextInputView";
  ReactApplicationContext mCallerContext;
  VariableTextInput editText;
  public VariableTextInputViewManager(ReactApplicationContext reactContext){
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

  @ReactProp(name = "selectionColor", customType = "Color")
  public void setSelectionColor(VariableTextInput view, @Nullable Integer color) {
    if (color != null) {
      view.setHighlightColor(color);
    }
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
  public void setBorderColor(VariableTextInput view, int index, Integer padding) {
    view.setContentPadding(PADDING_TYPES[index], padding);
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

  @ReactProp(name="placeholder")
  public void setPlaceholder(VariableTextInput view, String placeholder){
    view.setPlaceholder(placeholder);
  }
  @ReactProp(name = "selectionColor", customType = "Color")
  public void setSelectionColor(EditText view, @Nullable Integer color) {
    if (color != null) {
      view.setHighlightColor(color);
    }
  }
  @ReactProp(name="underlineColorAndroid",customType ="Color" )
  public void setUnderLineColorAndroid(VariableTextInput view,@Nullable Integer color){
    view.setUnderLineColorAndroid(color);
  }
  @ReactProp(name = "keyboardType")
  public void setKeyboardType(VariableTextInput view, String keyboardType) {
    switch (keyboardType) {
      case "default":
      {
        view.setImeOptions(EditorInfo.IME_ACTION_NONE);
        view.setInputType(EditorInfo.TYPE_CLASS_TEXT);
      }
        break;
      case "numeric":
        view.setImeOptions(EditorInfo.IME_ACTION_NONE);
        view.setInputType(EditorInfo.TYPE_CLASS_NUMBER);
        break;
      case "email-address":
        view.setImeOptions(EditorInfo.IME_ACTION_NONE);
        view.setInputType(EditorInfo.TYPE_CLASS_TEXT | EditorInfo.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);
        break;
      case "phone-pad":
        view.setImeOptions(EditorInfo.IME_ACTION_NONE);
        view.setInputType(EditorInfo.TYPE_CLASS_PHONE);
        break;
      case "url":
        view.setImeOptions(EditorInfo.IME_ACTION_NONE);
        view.setInputType(EditorInfo.TYPE_CLASS_TEXT | EditorInfo.TYPE_TEXT_VARIATION_URI);
        break;
      default:
        view.setImeOptions(EditorInfo.IME_ACTION_NONE);
        view.setInputType(EditorInfo.TYPE_CLASS_TEXT);
        break;
    }
  }
  /**
   * 接受交互通知
   * @return
   * */
  @Nullable
  @Override
  public Map<String, Integer> getCommandsMap() {
    Map<String,Integer> map = new HashMap<>();
    map.put(RNTONATIVEMETHOD.focus.name,0);
    map.put(RNTONATIVEMETHOD.blur.name, 1);
    map.put(RNTONATIVEMETHOD.insertEmoji.name, 2);
    map.put(RNTONATIVEMETHOD.insertMentions.name, 3);
    map.put(RNTONATIVEMETHOD.changeAttributedText.name, 4);
    return map;
  }
  /**
   * 根据命令ID，处理对应任务
   * @param root
   * @param commandId
   * @param args
   * */
  @Override
  public void receiveCommand(VariableTextInput root, int commandId, @Nullable ReadableArray args) {

    switch (commandId){
      case 0:
        //focus打开键盘
        root.focus();
        break;
      case 1:
        root.blur();
        break;
      case 2:
        //插入emoji
        this.insertImage(args);
        break;
      case 3:
        //插入tag 或者@
        //todo
        break;
      case 4:
        //更改富文本
        //todo
        break;
      default:
        break;
    }
  }
  public void insertImage(ReadableArray args) {
    ReadableMap mapData = args.getMap(0);
    String uri = mapData.getMap("img").getString("uri");
    String tag = mapData.getString("tag");
    editText.insertImage(uri);
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
      MapBuilder.of("registrationName", "onAndroidChange")
    ).put( "onAndroidContentSizeChange",
      MapBuilder.of("registrationName", "onAndroidContentSizeChange")).build();
  }
}
