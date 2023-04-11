package com.variabletextinput.bean;

public class RichTextBean {
  public String name;//插入@用户名称或#话题
  public String id;//插入@用户id或#话题id
  public String tag;//富文本标识符
  public int color;//插入内容颜色
  public String content;//传给RN提交的内容
  public String text;//普通文本字符
  public int type;//0普通文本字符、1插入自定义表情、2插入@或者#话题

}
