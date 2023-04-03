package com.variabletextinput;
import android.app.Activity;
import android.graphics.Rect;
import android.util.Log;
import android.view.View;
import android.view.ViewTreeObserver;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

public class VariableTextInputModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;
  private int keyboardHeight = 0;
  private View rootView;
  public VariableTextInputModule(ReactApplicationContext context){
    super(context);
    reactContext = context;
    Activity activity = getCurrentActivity();
    if (activity == null){
      return;
    }
    rootView = activity.findViewById(android.R.id.content).getRootView();
    rootView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
      @Override
      public void onGlobalLayout() {
        Rect rect = new Rect();
        rootView.getWindowVisibleDisplayFrame(rect);

        int screenHeight = rootView.getHeight();
        int keyboardHeight = screenHeight - rect.bottom;

        if (keyboardHeight > 0 && keyboardHeight != VariableTextInputModule.this.keyboardHeight) {
          VariableTextInputModule.this.keyboardHeight = keyboardHeight;
          // Notify JavaScript code about keyboard height change
          // ...
        }
      }
    });
  }
  @Override
  public String getName(){
    return "VariableTextInputViewManager";
  }
  @ReactMethod
  public void blur(){
//    viewManager.blur();
  }
  /**
   * release模式下 uri为图片名称,例如, 在rn项目的Images目录下有张icon_splash名称的图片
   * 那么 uri 为 images_icon_splash
   * 开发者模式下，图片格式为package server 地址，例如: http: // 192.xxx
   * @param param
   */
  @ReactMethod
  public void insertEmoji(ReadableMap param){
    //todo
    String uri = param.getMap("img").getString("uri");
    String tag = param.getString("tag");
  }
  @ReactMethod
  public void insertMentions(ReadableMap param){
    //todo
    Log.d("TagInfo", "changeAttributedText: "+param);

  }
  @ReactMethod
  public void changeAttributedText(ReadableArray param){
    //todo
    Log.d("TagInfo", "changeAttributedText: "+param);
  }
  @ReactMethod
  public void getKeyboardHeight(Callback callback) {

    callback.invoke(keyboardHeight);
  }
}
