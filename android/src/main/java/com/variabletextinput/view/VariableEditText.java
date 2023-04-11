package com.variabletextinput.view;
import android.content.Context;
import android.util.AttributeSet;

public class VariableEditText extends androidx.appcompat.widget.AppCompatEditText {
  public VariableEditText(Context context) {
    super(context);
  }
  public VariableEditText(Context context, AttributeSet attrs){
    super(context,attrs);
  }
  public VariableEditText(Context context,AttributeSet attrs,int defStyleAttr){
    super(context,attrs,defStyleAttr);
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
}
