package com.variabletextinput.view;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.PorterDuff;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.text.Editable;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Gravity;
import android.view.inputmethod.InputMethodManager;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.text.InputType;
import android.widget.TextView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.Spacing;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.text.ReactFontManager;
import com.variabletextinput.R;
import com.variabletextinput.bean.RichTextBean;
import com.variabletextinput.util.ActivityConst;
import com.variabletextinput.util.BitmapUtil;
import com.variabletextinput.widget.TextSpan;

import static android.view.ViewGroup.LayoutParams.MATCH_PARENT;
import static android.view.ViewGroup.LayoutParams.WRAP_CONTENT;

import androidx.core.content.ContextCompat;

import java.lang.reflect.Field;

public class VariableTextInput extends LinearLayout {
  private VariableEditText editText;
  private ScrollView scrollView;
  private Boolean ignoreNextLocalTextChange = false;

  private Context mContext;
  private SpannableString mSpannableString;

  public VariableTextInput(Context context) {
    super(context);
    this.mContext = context;
    scrollView = new ScrollView(context);
    scrollView.setLayoutParams(new LinearLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT));
    scrollView.setClipToPadding(false);
    scrollView.setFillViewport(true);
    editText = new VariableEditText(context);
    editText.setLayoutParams(new ScrollView.LayoutParams(MATCH_PARENT, WRAP_CONTENT));
    editText.setGravity(Gravity.TOP);
    editText.setInputType(editText.getInputType() | InputType.TYPE_TEXT_FLAG_CAP_SENTENCES | InputType.TYPE_TEXT_FLAG_AUTO_CORRECT | InputType.TYPE_TEXT_FLAG_MULTI_LINE);
    editText.setPadding(0, 0, 0, 0);
    // This was used in conjunction with setting raw input type for selecting lock notes.
    // However, it causes the keyboard to not come up for editing existing notes.
    // Tested while offline using brand new installation on Android 6 emulator, but a user with Android 7 also reported it.
    // editText.setTextIsSelectable(true);
    scrollView.addView(editText);
    this.addView(scrollView);
    // 添加 TextWatcher 监听器
    editText.addTextChangedListener(new TextWatcher() {
      private int oldHeight = editText.getHeight(); // 保存旧的高度
      private int oldWidth = editText.getWidth(); // 保存旧的宽度
      private String mPreviousText;
      private int mSpanLength = -1;

      @Override
      public void beforeTextChanged(CharSequence s, int start, int count, int after) {
        mPreviousText = s.toString();
        if (start == 0 || editText.getText() == null) return;
        if (count > after) {
          TextSpan[] spans = editText.getText().getSpans(start + count, start + count, TextSpan.class);
          if (spans == null || spans.length == 0) return;
          for (TextSpan span : spans) {
            int endSpanIndex = editText.getText().getSpanEnd(span);
            if (endSpanIndex != start + count) continue;
            mSpanLength = span.getRichTextBean().content.length() - 1;
            editText.getText().removeSpan(span);
          }
        }
      }

      @Override
      public void onTextChanged(CharSequence s, int start, int before, int count) {
        // Rearranging the text (i.e. changing between singleline and multiline attributes) can
        // also trigger onTextChanged, call the event in JS only when the text actually changed
        if (count == 0 && before == 0) {
          return;
        }
        String newText = s.toString().substring(start, start + count);
        String oldText = mPreviousText.substring(start, start + before);
        // Don't send same text changes
        if (count == before && newText.equals(oldText)) {
          return;
        }
        if (ignoreNextLocalTextChange) {
          ignoreNextLocalTextChange = false;
          return;
        }
        if (before == 1 && count == 0 && editText.getText() != null && mSpanLength > -1) {
          int length = mSpanLength;
          mSpanLength = -1;
          editText.getText().replace(start - length, start, "");
        }
        WritableMap event = Arguments.createMap();
        event.putString("text", s.toString());
        final Context context = getContext();
        if (context instanceof ReactContext) {
          ((ReactContext) context).getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "onAndroidChange", event);
        }
      }

      @Override
      public void afterTextChanged(Editable s) {
        // 文本变化之后的处理
        int newHeight = editText.getLineCount() * editText.getLineHeight();
        if (newHeight != oldHeight) {
          // 高度发生变化，执行其他操作
          // ...
          oldHeight = newHeight; // 更新旧的高度
          WritableMap contentSize = Arguments.createMap();
          int pdHeight = pxToDp(newHeight);
          int pdWidth = pxToDp(editText.getWidth());
          contentSize.putDouble("height", pdHeight);
          contentSize.putDouble("width", pdWidth);
          WritableMap event = Arguments.createMap();
          event.putMap("contentSize", contentSize);
          final Context context = getContext();
          if (context instanceof ReactContext) {
            Log.d("输入框高度", "afterTextChanged: " + event);
            ((ReactContext) context).getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "onAndroidContentSizeChange", event);
          }
        }
      }
    });
    editText.setOnMenuItemCallBack(new VariableEditText.OnMenuItemCallBack() {
      @Override
      public void onCut() {
        handleClipBoardData();
      }

      @Override
      public void onCopy() {
        handleClipBoardData();
      }

      @Override
      public void onPaste() {
        Log.e("onPaste", "执行onPaste方法");
      }
    });
  }

  //处理粘贴板数据
  private void handleClipBoardData() {
    ClipboardManager clipboardManager = (ClipboardManager) mContext.getSystemService(Context.CLIPBOARD_SERVICE);
    if (clipboardManager != null && editText.getText() != null) {
      Editable editable = Editable.Factory.getInstance().newEditable(editText.getText().subSequence(editText.getSelectionStart(), editText.getSelectionEnd()));
      TextSpan[] spans = editable.getSpans(0, editable.length(), TextSpan.class);
      if (spans == null || spans.length == 0) return;
      for (TextSpan span : spans) {
        String text = span.getRichTextBean().tag;
        if (!TextUtils.isEmpty(span.getRichTextBean().name)) {
          text = span.getRichTextBean().tag + span.getRichTextBean().name;
        }
        int startIndex = editable.getSpanStart(span);
        int endIndex = editable.getSpanEnd(span);
        editable.replace(startIndex, endIndex, text);
      }
      ClipData clipData = ClipData.newPlainText("text", editable);
      clipboardManager.setPrimaryClip(clipData);
    }
  }

  public int pxToDp(int px) {
    DisplayMetrics displayMetrics = getContext().getResources().getDisplayMetrics();
    int dpi = displayMetrics.densityDpi;
    return Math.round(px / (dpi / 160f));
  }

  @Override
  protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
    super.onLayout(changed, left, top, right, bottom);
  }

  public void setText(String text) {
    // Fix for issue where first character typed does not trigger save event.
    // setText is called with an empty string originally as soon as the text view is initialized.
    // Thus, ignoreNextLocalTextChange would be set to true, and would ignore the first character typed.
    boolean isEmpty = text == null || text.trim().length() == 0;
    ignoreNextLocalTextChange = !isEmpty;
    editText.setText(text);
  }

  public void setAutoFocus(boolean autoFocus) {
    if (autoFocus) {
      editText.requestFocus();
      InputMethodManager imm = (InputMethodManager) getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
      imm.toggleSoftInput(InputMethodManager.SHOW_FORCED, InputMethodManager.HIDE_IMPLICIT_ONLY);
    }
  }

  public void setEditable(boolean editable) {
        /*
            setRawInputType is the only solution that works for keeping the text selectable while disabled
            previously we used setEnabled(false), but this would make text unselectable when the note is locked.
            setInputType(null) also doesn't work because it removes the multiline functionality.
            With setRawInputType, the keyboard doesn't come up, but if you're using a hardware keyboard,
            changes will still be received. So we combine the below with javascript side lock checking to decline
            any physical changes.
            editText.setTextIsSelectable is also required for this to work, which is set at setup
            Update: setTextIsSelectable causes keyboard to not come up. Go back to setEnabled
            until we can determine a different solution
            Previous solution for selecting locked notes:
            if(!editable) {
              editText.setRawInputType(InputType.TYPE_NULL);
            } else {
            editText.setRawInputType(editText.getInputType() | InputType.TYPE_TEXT_FLAG_CAP_SENTENCES | InputType.TYPE_TEXT_FLAG_AUTO_CORRECT | InputType.TYPE_TEXT_FLAG_MULTI_LINE);
            }
         */
    editText.setEnabled(editable);

  }

  public void focus() {
    editText.requestFocus();
  }

  public void blur() {
    editText.clearFocus();

    // this does the actual keyboard dismissal
    InputMethodManager imm = null;
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
      imm = (InputMethodManager) this.getContext().getSystemService(Activity.INPUT_METHOD_SERVICE);
    }
    imm.hideSoftInputFromWindow(editText.getWindowToken(), 0);
  }

  public void setImeOptions(int info) {
    editText.setImeOptions(info);
  }

  public void setInputType(int type) {
    editText.setInputType(type);
  }

  public void setContentPadding(int position, Integer padding) {
    float scale = getResources().getDisplayMetrics().density;
    int pixels = (int) (padding * scale + 0.5f);

    if (position == Spacing.ALL) {
      editText.setPadding(pixels, pixels, pixels, pixels);
    } else if (position == Spacing.LEFT) {
      editText.setPadding(pixels, editText.getTotalPaddingTop(), editText.getPaddingRight(), editText.getPaddingBottom());
    } else if (position == Spacing.TOP) {
      editText.setPadding(editText.getPaddingLeft(), pixels, editText.getPaddingRight(), editText.getPaddingBottom());
    } else if (position == Spacing.RIGHT) {
      editText.setPadding(editText.getPaddingLeft(), editText.getTotalPaddingTop(), pixels, editText.getPaddingBottom());
    } else if (position == Spacing.BOTTOM) {
      editText.setPadding(editText.getPaddingLeft(), editText.getTotalPaddingTop(), editText.getPaddingRight(), pixels);
    }
  }

  public void setTextColor(Integer color) {
    editText.setTextColor(color);
  }

  public void setHighlightColor(Integer color) {
    editText.setHighlightColor(color);

    try {
      // Get the cursor resource id
      Field field = TextView.class.getDeclaredField("mCursorDrawableRes");
      field.setAccessible(true);
      int drawableResId = field.getInt(editText);

      // Get the editor
      field = TextView.class.getDeclaredField("mEditor");
      field.setAccessible(true);
      Object editor = field.get(editText);

      // Get the drawable and set a color filter
      Drawable drawable = ContextCompat.getDrawable(editText.getContext(), drawableResId);
      drawable.setColorFilter(color, PorterDuff.Mode.SRC_IN);
      Drawable[] drawables = {drawable, drawable};

      // Set the drawables
      field = editor.getClass().getDeclaredField("mCursorDrawable");
      field.setAccessible(true);
      field.set(editor, drawables);
    } catch (Exception ignored) {
    }
  }

  public void setHandlesColor(int color) {
    try {

      Field editorField = TextView.class.getDeclaredField("mEditor");
      if (!editorField.isAccessible()) {
        editorField.setAccessible(true);
      }

      Object editor = editorField.get(editText);
      Class<?> editorClass = editor.getClass();

      String[] handleNames = {"mSelectHandleLeft", "mSelectHandleRight", "mSelectHandleCenter"};
      String[] resNames = {"mTextSelectHandleLeftRes", "mTextSelectHandleRightRes", "mTextSelectHandleRes"};

      for (int i = 0; i < handleNames.length; i++) {
        Field handleField = editorClass.getDeclaredField(handleNames[i]);
        if (!handleField.isAccessible()) {
          handleField.setAccessible(true);
        }

        Drawable handleDrawable = (Drawable) handleField.get(editor);

        if (handleDrawable == null) {
          Field resField = TextView.class.getDeclaredField(resNames[i]);
          if (!resField.isAccessible()) {
            resField.setAccessible(true);
          }
          int resId = resField.getInt(editText);
          handleDrawable = ContextCompat.getDrawable(editText.getContext(), resId);
        }

        if (handleDrawable != null) {
          Drawable drawable = handleDrawable.mutate();
          drawable.setColorFilter(color, PorterDuff.Mode.SRC_IN);
          handleField.set(editor, drawable);
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void setPlaceholder(String placeholder) {
    editText.setHint(placeholder);
  }

  public void setUnderLineColorAndroid(Integer color) {
    editText.setBackgroundTintList(ColorStateList.valueOf(color));
  }

  public void setFontSize(Integer fontSize) {
    editText.setTextSize(fontSize);
  }

  public void setFontFamily(String fontFamily) {
    int style = Typeface.NORMAL;
    if (editText.getTypeface() != null) {
      style = editText.getTypeface().getStyle();
    }
    Typeface newTypeFace = ReactFontManager.getInstance().getTypeface(fontFamily, style, editText.getContext().getAssets());
    editText.setTypeface(newTypeFace);
  }

  public void handleRichText(ReadableArray args) {
    if (args != null && args.size() > 0) {
      for (int i = 0; i < args.size(); i++) {
        RichTextBean richTextBean = handleParams(args.getMap(i));
        switch (richTextBean.type) {
          case 0:
            //普通文本
            if (!TextUtils.isEmpty(richTextBean.text)) {
              editText.setText(richTextBean.text);
              editText.setSelection(richTextBean.text.length());
            }
            break;
          case 1:
            //自定义表情
            insertEmoji(richTextBean);
            break;
          case 2:
            //@或者#话题
            insertMentions(richTextBean);
            break;
          default:
            break;
        }
      }
    }
  }

  private RichTextBean handleParams(ReadableMap map) {
    RichTextBean richTextBean = new RichTextBean();
    if (map.hasKey(ActivityConst.TYPE)) {
      richTextBean.type = map.getInt(ActivityConst.TYPE);
    }
    if (map.hasKey(ActivityConst.ID)) {
      richTextBean.id = map.getString(ActivityConst.ID);
    }
    if (map.hasKey(ActivityConst.TAG)) {
      richTextBean.tag = map.getString(ActivityConst.TAG);
    }
    if (map.hasKey(ActivityConst.EMOJI_TAG) && richTextBean.type == 1) {
      richTextBean.tag = map.getString(ActivityConst.EMOJI_TAG);
      richTextBean.content = richTextBean.tag;
    }
    if (map.hasKey(ActivityConst.NAME)) {
      String name = map.getString(ActivityConst.NAME);
      richTextBean.name = name + " ";
      //插入@或者#
      if (richTextBean.type == 2) {
        richTextBean.content = String.format(mContext.getString(R.string.insert_mention), richTextBean.tag, name, richTextBean.id);
      }
    }
    if (map.hasKey(ActivityConst.COLOR)) {
      richTextBean.color = map.getInt(ActivityConst.COLOR);
    }
    if (map.hasKey(ActivityConst.TEXT)) {
      richTextBean.text = map.getString(ActivityConst.TEXT);
    }
    return richTextBean;
  }

  public void insertEmoji(RichTextBean richTextBean) {
    int startIndex = editText.getSelectionStart();
    Log.e("startIndex", startIndex + "");
    int endIndex = startIndex + richTextBean.tag.length();
    Log.e("endIndex", endIndex + "");
    if (editText.getText() != null) {
      editText.getText().insert(startIndex, richTextBean.tag);
    }
    Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.kuxiao);
    TextSpan imageSpan = new TextSpan(mContext, BitmapUtil.setBitmapSize(bitmap, editText.getTextSize()), richTextBean);
    mSpannableString = SpannableString.valueOf(editText.getText());
    mSpannableString.setSpan(imageSpan, startIndex, endIndex, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    editText.setText(mSpannableString);
    editText.setSelection(endIndex);
    editText.getText().replace(startIndex, endIndex, richTextBean.content);
  }

  private void insertMentions(RichTextBean richTextBean) {
    int startIndex = editText.getSelectionStart();
    Log.e("startIndex", startIndex + "");
    int endIndex = startIndex + richTextBean.tag.length() + richTextBean.name.length();
    Log.e("endIndex", endIndex + "");
    if (editText.getText() != null) {
      editText.getText().insert(startIndex, richTextBean.tag + richTextBean.name);
    }
    Bitmap bitmap = BitmapUtil.getTextBitmap(richTextBean.tag + richTextBean.name, editText.getTypeface(), editText.getTextSize(), richTextBean.color);
    TextSpan textSpan = new TextSpan(mContext, bitmap, richTextBean);
    mSpannableString = SpannableString.valueOf(editText.getText());
    mSpannableString.setSpan(textSpan, startIndex, endIndex, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    editText.setText(mSpannableString);
    editText.setSelection(endIndex);
    editText.getText().replace(startIndex, endIndex, richTextBean.content);
  }
}

