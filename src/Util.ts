import type {
  IEmojiData,
  IInserTextAttachmentItem,
  IMentionData,
} from './exTypes';

/**
 * {"@"}[userName](id)
 */
const regex = /({[^{}[\]()]*}\[[^[\]()]*]\([^(){}]*\))/g;
const singleRegex = /{([^\]}]*)}\[([^\]]*)]\(([^)]*)\)/;
const emojiPattern = /\[[^\]]*\]|(\w+)/g;
let mentions: IMentionData[] = [];
let emojiData: IEmojiData[] = [];
const setUTilMention = (data: IMentionData[]) => {
  mentions = data;
};
const setUTilEmojiData = (data: IEmojiData[]) => {
  emojiData = data;
};
/**
 * Delete keyboard when inserting @ and #
 */
const deletKeyBord = (str: string, target: string) => {
  const regex1 = new RegExp(`${target}(?=[^${target}]*$)`);
  const result = str.replace(regex1, '');
  return result;
};
/**
 * handleText
 * example
 * any{"@"}[userName](id)any to ["any","{"@"}[userName](id)","any"]
 */
const handleText = (str: string) => {
  const result = str.split(regex).filter(Boolean);
  return result;
};
/**
 * singleArr
 * example
 * {"@"}[userName](id) to ["@","userName","id"]
 */
const singleArr = (str: string) => {
  const result = str.match(singleRegex)?.slice(1);
  return result;
};
const getMentionColor = (tag: string) => {
  const colorArr = mentions.filter((mItem) => mItem.tag === tag);
  const mentionData = colorArr[0];
  const color = !!mentionData ? mentionData.color : 'red';
  return color;
};
/**
 * getAttArr
 */
const getAttributedTextArr = (str: string) => {
  const arr = handleText(str);
  const newAtt: IInserTextAttachmentItem[] = [];
  arr.forEach((item) => {
    const matchResult = singleArr(item);
    if (!!matchResult) {
      const tag = matchResult[0];
      const name = matchResult[1];
      const id = matchResult[2];
      const color = getMentionColor(tag || '');
      const attItem: IInserTextAttachmentItem = {
        type: 2,
        tag,
        name,
        id,
        color,
      };
      newAtt.push(attItem);
    } else {
      if (!!emojiData && emojiData.length > 1) {
        const emojiStrAr = getEmojiStrArr(item);
        const emojiTagArr = emojiData.map((emoji) => emoji.emojiTag);
        emojiStrAr?.forEach((jItem) => {
          if (emojiTagArr.includes(jItem)) {
            const mateArr = emojiData.filter((fi) => fi.emojiTag === jItem);
            const singleEmojiData = mateArr[0];
            const emojiItem: IInserTextAttachmentItem = {
              type: 1,
              emojiTag: singleEmojiData?.emojiTag,
              img: singleEmojiData?.img,
              emojiUri: singleEmojiData?.img?.uri,
            };
            newAtt.push(emojiItem);
          } else {
            const normalItem: IInserTextAttachmentItem = {
              type: 0,
              text: jItem,
            };
            newAtt.push(normalItem);
          }
        });
      } else {
        const normalItem: IInserTextAttachmentItem = {
          type: 0,
          text: item,
        };
        newAtt.push(normalItem);
      }
    }
  });
  return newAtt;
};
const getEmojiStrArr = (str: string) => {
  const arr = str.match(emojiPattern)?.filter(Boolean);
  return arr;
};
export {
  getAttributedTextArr,
  deletKeyBord,
  regex,
  singleRegex,
  emojiPattern,
  setUTilMention,
  setUTilEmojiData,
  getMentionColor,
};
