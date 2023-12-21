package com.variabletextinput.view;

import android.content.Context;
import android.util.AttributeSet;

import androidx.annotation.Nullable;
import androidx.appcompat.widget.AppCompatEditText;

public class VariableEditText extends AppCompatEditText {

  private OnMenuItemCallBack mOnMenuItemCallBack;

  private @Nullable
  String mSubmitBehavior = null;

  public VariableEditText(Context context) {
    super(context);
  }

  public VariableEditText(Context context, AttributeSet attrs) {
    super(context, attrs);
  }

  public VariableEditText(Context context, AttributeSet attrs, int defStyleAttr) {
    super(context, attrs, defStyleAttr);
  }
  public boolean shouldSubmitOnReturn() {
    String submitBehavior = getSubmitBehavior();
    boolean shouldSubmit;

    // Default shouldSubmit
    if (submitBehavior == null) {
      shouldSubmit = false;
    } else {
      shouldSubmit = submitBehavior.equals("submit") || submitBehavior.equals("blurAndSubmit");
    }

    return shouldSubmit;
  }
  public void setSubmitBehavior(String submitBehavior) {
    mSubmitBehavior = submitBehavior;
  }
  public boolean shouldBlurOnReturn() {
    String submitBehavior = getSubmitBehavior();
    boolean shouldBlur;

    // Default shouldBlur
    if (submitBehavior == null) {
      shouldBlur = false;
    } else {
      shouldBlur = submitBehavior.equals("blurAndSubmit");
    }

    return shouldBlur;
  }
  public String getSubmitBehavior() {
    return mSubmitBehavior;
  }
  @Override
  public boolean isLayoutRequested() {
    // If we are watching and updating container height based on content size
    // then we don't want to scroll right away. This isn't perfect -- you might
    // want to limit the height the text input can grow to. Possible solution
    // is to add another prop that determines whether we should scroll to end
    // of text.
    return false;
  }

  @Override
  public boolean onTextContextMenuItem(int id) {
    switch (id) {
      case android.R.id.cut:
        mOnMenuItemCallBack.onCut();
        return true;
      case android.R.id.copy:
        mOnMenuItemCallBack.onCopy();
        return true;
      case android.R.id.paste:
        mOnMenuItemCallBack.onPaste();
        return true;
    }
    return super.onTextContextMenuItem(id);
  }

  public void setOnMenuItemCallBack(OnMenuItemCallBack onMenuItemCallBack) {
    mOnMenuItemCallBack = onMenuItemCallBack;
  }

  public interface OnMenuItemCallBack {
    void onCut();

    void onCopy();

    void onPaste();
  }
}
