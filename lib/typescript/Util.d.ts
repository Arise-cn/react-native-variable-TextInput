import type { IEmojiData, IInserTextAttachmentItem } from './exTypes';
/**
 * {"@"}[userName](id)
 */
declare const regex: RegExp;
declare const singleRegex: RegExp;
declare const emojiPattern: RegExp;
/**
 * Delete keyboard when inserting @ and #
 */
declare const deletKeyBord: (str: string, target: string) => string;
/**
 * getAttArr
 */
declare const getAttributedTextArr: (str: string, emojiData?: IEmojiData[]) => IInserTextAttachmentItem[];
export { getAttributedTextArr, deletKeyBord, regex, singleRegex, emojiPattern };
//# sourceMappingURL=Util.d.ts.map