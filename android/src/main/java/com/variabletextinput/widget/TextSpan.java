package com.variabletextinput.widget;

import android.content.Context;
import android.graphics.Bitmap;
import android.text.style.ImageSpan;

import androidx.annotation.NonNull;

import com.variabletextinput.bean.RichTextBean;

public class TextSpan extends ImageSpan {
  private Context mContext;
  private RichTextBean mRichTextBean;

  public TextSpan(@NonNull Context context, @NonNull Bitmap bitmap, RichTextBean richTextBean) {
    super(context, bitmap);
    this.mContext = context;
    this.mRichTextBean = richTextBean;
  }

  public Context getContext() {
    return mContext;
  }

  public RichTextBean getRichTextBean() {
    return mRichTextBean;
  }

}
