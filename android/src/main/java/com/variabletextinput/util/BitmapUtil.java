package com.variabletextinput.util;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Typeface;

public class BitmapUtil {
  private static int height = 60;
  private static int baseLine = 48;

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
    final Bitmap bmp = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
    Canvas canvas = new Canvas(bmp);
    canvas.drawText(name, rect.left, baseLine, paint);
    return bmp;
  }

  public static Bitmap setBitmapSize(Bitmap bitmap, float size) {
    int width = bitmap.getWidth();
    int height = bitmap.getHeight();
    float scaleWidth = ((float) size) / width;
    float scaleHeight = ((float) size) / height;
    Matrix matrix = new Matrix();
    matrix.postScale(scaleWidth, scaleHeight);
    return Bitmap.createBitmap(bitmap, 0, 0, width, height, matrix, true);
  }

//  private static int getBaseLine(Paint paint) {
//    if (baseLine == 0) {
//      Paint.FontMetricsInt fontMetrics = paint.getFontMetricsInt();
//      int dy = (fontMetrics.bottom - fontMetrics.top) / 2 - fontMetrics.bottom;
//      baseLine = dy;
//      return height / 2 + dy;
//    }
//    return baseLine;
//  }
}
