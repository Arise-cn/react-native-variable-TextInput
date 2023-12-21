import type {
  ColorValue,
  ImageResolvedAssetSource,
  ProcessedColorValue,
} from 'react-native';
export type IATTextViewBase = {
  focus: () => void;
  blur: () => void;
  insertEmoji: (img: IInserTextAttachmentItem) => void;
  insertMentions: (data: IInserTextAttachmentItem) => void;
  changeAttributedText: (data: IInserTextAttachmentItem[]) => void;
  insertMentionAndDelateKeyword: (data: MentionData) => void;
};
export type MentionData = {
  color: ColorValue;
  name: string;
  id: string;
};
export interface IVTTextInputData {
  nativeEvent: {
    text: string;
  };
}
export enum ITextType {
  emoji = 1,
  normal = 0,
  tagText = 2,
}
export type IEmojiData = {
  img?: ImageResolvedAssetSource; //emoji图片
  emojiTag?: string; //[微笑] //emojitag
};
export interface PrivateItemData {
  type: ITextType;
  text?: string;
  color?: ProcessedColorValue | null | undefined;
  tag?: '@' | '#';
  name?: string;
  id?: string;
  img?: ImageResolvedAssetSource; //emoji图片
  emojiTag?: string; //[微笑] //emojitag
}
export interface IInserTextAttachmentItem {
  type: ITextType;
  text?: string;
  color?: ColorValue;
  tag?: '@' | '#';
  name?: string;
  id?: string;
  img?: ImageResolvedAssetSource; //emoji图片
  emojiTag?: string; //[微笑] //emojitag
  emojiUri?: string;
}
export interface IOnTagsType {
  tag: string;
  keyWord: string;
}
export interface IonMentionData {
  mention: string;
  keyWord: string;
}
