package com.variabletextinput.widget;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.text.style.DynamicDrawableSpan;

import com.variabletextinput.bean.RichTextBean;

public class TextSpan extends DynamicDrawableSpan {

  private Context mContext;
  private RichTextBean mRichTextBean;

  private Bitmap bitmap;

  public TextSpan(Context context, RichTextBean richTextBean) {
    this.mContext = context;
    this.mRichTextBean = richTextBean;
    this.bitmap = getNameBitmap(richTextBean.tag + richTextBean.name);
  }

  @Override
  public Drawable getDrawable() {
    BitmapDrawable drawable = new BitmapDrawable(mContext.getResources(), bitmap);
    drawable.setBounds(0, 0, bitmap.getWidth(), bitmap.getHeight());
    return drawable;
  }


  public RichTextBean getRichTextBean() {
    return mRichTextBean;
  }

  public void setRichTextBean(RichTextBean richTextBean) {
    this.mRichTextBean = richTextBean;
  }

  /**
   * @param name
   * @return
   */
  private Bitmap getNameBitmap(String name) {
    /* 把@相关的字符串转换成bitmap 然后使用DynamicDrawableSpan加入输入框中 */
    Paint paint = new Paint();
    paint.setAntiAlias(true);
    //设置字体画笔的颜色
    paint.setColor(mRichTextBean.color);
    //设置字体的大小
    paint.setTextSize(50);
    Rect rect = new Rect();
    paint.getTextBounds(name, 0, name.length(), rect);
    // 获取字符串在屏幕上的长度
    int width = (int) (paint.measureText(name));
    final Bitmap bmp = Bitmap.createBitmap(width, rect.height(), Bitmap.Config.ARGB_8888);
    Canvas canvas = new Canvas(bmp);
    canvas.drawText(name, rect.left, rect.height() - rect.bottom, paint);
    return bmp;
  }

}

