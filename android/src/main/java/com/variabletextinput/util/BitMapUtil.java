package com.variabletextinput.util;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Typeface;

public class BitMapUtil {

  public static Bitmap getTextBitmap(String name, Typeface typeface, float fontSize, int color) {
    Paint paint = new Paint();
    paint.setAntiAlias(true);
    //设置字体画笔的颜色
    paint.setColor(color);
    //设置字体的大小
    paint.setTextSize(fontSize);
    //设置字体
    if (typeface != null) {
      paint.setTypeface(typeface);
    }
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