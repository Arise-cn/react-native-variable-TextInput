/**
 * {"@"}[userName](id)
 */
const regex = /({[^{}[\]()]*}\[[^[\]()]*]\([^(){}]*\))/g;
const singleRegex = /{([^\]}]*)}\[([^\]]*)]\(([^)]*)\)/;
const emojiPattern = /\[[^\]]*\]|(\w+)/g;

/**
 * Delete keyboard when inserting @ and #
 */
const deletKeyBord = (str, target) => {
  const regex1 = new RegExp(`${target}(?=[^${target}]*$)`);
  const result = str.replace(regex1, '');
  return result;
};
/**
 * handleText
 * example
 * any{"@"}[userName](id)any to ["any","{"@"}[userName](id)","any"]
 */
const handleText = str => {
  const result = str.split(regex).filter(Boolean);
  return result;
};
/**
 * singleArr
 * example
 * {"@"}[userName](id) to ["@","userName","id"]
 */
const singleArr = str => {
  var _str$match;
  const result = (_str$match = str.match(singleRegex)) === null || _str$match === void 0 ? void 0 : _str$match.slice(1);
  return result;
};
/**
 * getAttArr
 */
const getAttributedTextArr = (str, emojiData) => {
  const arr = handleText(str);
  const newAtt = [];
  arr.forEach(item => {
    const matchResult = singleArr(item);
    if (!!matchResult) {
      const attItem = {
        type: 2,
        tag: '@',
        name: matchResult[1],
        id: matchResult[2],
        color: '#CEDA39'
      };
      newAtt.push(attItem);
    } else {
      if (!!emojiData && emojiData.length > 1) {
        const emojiStrAr = getEmojiStrArr(item);
        const emojiTagArr = emojiData.map(emoji => emoji.emojiTag);
        emojiStrAr === null || emojiStrAr === void 0 ? void 0 : emojiStrAr.forEach(jItem => {
          if (emojiTagArr.includes(jItem)) {
            var _singleEmojiData$img;
            const mateArr = emojiData.filter(fi => fi.emojiTag === jItem);
            const singleEmojiData = mateArr[0];
            const emojiItem = {
              type: 1,
              emojiTag: singleEmojiData === null || singleEmojiData === void 0 ? void 0 : singleEmojiData.emojiTag,
              img: singleEmojiData === null || singleEmojiData === void 0 ? void 0 : singleEmojiData.img,
              emojiUri: singleEmojiData === null || singleEmojiData === void 0 ? void 0 : (_singleEmojiData$img = singleEmojiData.img) === null || _singleEmojiData$img === void 0 ? void 0 : _singleEmojiData$img.uri
            };
            newAtt.push(emojiItem);
          } else {
            const normalItem = {
              type: 0,
              text: jItem
            };
            newAtt.push(normalItem);
          }
        });
      }
    }
  });
  return newAtt;
};
const getEmojiStrArr = str => {
  var _str$match2;
  const arr = (_str$match2 = str.match(emojiPattern)) === null || _str$match2 === void 0 ? void 0 : _str$match2.filter(Boolean);
  return arr;
};
export { getAttributedTextArr, deletKeyBord, regex, singleRegex, emojiPattern };
//# sourceMappingURL=Util.js.map