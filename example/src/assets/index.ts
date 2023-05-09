import {
  Image,
  ImageResolvedAssetSource,
  ImageSourcePropType,
} from 'react-native';

interface IEmojiDataType {
  img: ImageSourcePropType;
  emojiTag: string;
}
interface IInputEmojiDataType {
  img: ImageResolvedAssetSource;
  emojiTag: string;
  type: 1;
  emojiUri: string;
}
const EMOJIDATA: IEmojiDataType[] = [
  {
    img: require('./a.png'),
    emojiTag: `[啊]`,
  },
  {
    img: require('./aoman.png'),
    emojiTag: `[傲慢]`,
  },
  {
    img: require('./bangqiu.png'),
    emojiTag: `[棒球]`,
  },
  {
    img: require('./baolingqiu.png'),
    emojiTag: `[保龄球]`,
  },
  {
    img: require('./baozhu.png'),
    emojiTag: `[爆竹]`,
  },
  {
    img: require('./bing.png'),
    emojiTag: `[兵]`,
  },
  {
    img: require('./bugaoxing.png'),
    emojiTag: `[不高兴]`,
  },
  {
    img: require('./caihonggou.png'),
    emojiTag: `[彩虹狗]`,
  },
  {
    img: require('./chengmo.png'),
    emojiTag: `[沉默]`,
  },
  {
    img: require('./chensi.png'),
    emojiTag: `[沉思]`,
  },
  {
    img: require('./cijing.png'),
    emojiTag: `[吃惊]`,
  },
  {
    img: require('./danxing.png'),
    emojiTag: `[担心]`,
  },
  {
    img: require('./danyantushe.png'),
    emojiTag: `[单眼吐舌]`,
  },
  {
    img: require('./daxiao.png'),
    emojiTag: `[大笑]`,
  },
  {
    img: require('./daxiaowang.png'),
    emojiTag: `[大小王]`,
  },
  {
    img: require('./deyi.png'),
    emojiTag: `[得意]`,
  },
  {
    img: require('./diaoyugan.png'),
    emojiTag: `[钓鱼竿]`,
  },
  {
    img: require('./emoweixiao.png'),
    emojiTag: `[恶魔微笑]`,
  },
  {
    img: require('./fangpian.png'),
    emojiTag: `[方片]`,
  },
  {
    img: require('./fangshengdaku.png'),
    emojiTag: `[放声大哭]`,
  },
  {
    img: require('./feibiao.png'),
    emojiTag: `[飞镖]`,
  },
  {
    img: require('./feiwen.png'),
    emojiTag: `[飞吻]`,
  },
  {
    img: require('./fengzheng.png'),
    emojiTag: `[风筝]`,
  },
  {
    img: require('./ganmao.png'),
    emojiTag: `[感冒]`,
  },
  {
    img: require('./gaoerfuqiu.png'),
    emojiTag: `[高尔夫球]`,
  },
  {
    img: require('./haha.png'),
    emojiTag: `[哈哈]`,
  },
  {
    img: require('./haipa.png'),
    emojiTag: `[害怕]`,
  },
  {
    img: require('./han.png'),
    emojiTag: `[汗]`,
  },
  {
    img: require('./haochi.png'),
    emojiTag: `[好吃]`,
  },
  {
    img: require('./hongbao.png'),
    emojiTag: `[红包]`,
  },
  {
    img: require('./hongzhong.png'),
    emojiTag: `[红中]`,
  },
  {
    img: require('./huabing.png'),
    emojiTag: `[滑冰]`,
  },
  {
    img: require('./huachi.png'),
    emojiTag: `[花痴]`,
  },
  {
    img: require('./huakuang.png'),
    emojiTag: `[画框]`,
  },
  {
    img: require('./hudiejie.png'),
    emojiTag: `[蝴蝶结]`,
  },
  {
    img: require('./jiangbei.png'),
    emojiTag: `[奖杯]`,
  },
  {
    img: require('./jiangpai.png'),
    emojiTag: `[奖牌]`,
  },
  {
    img: require('./jianmo.png'),
    emojiTag: `[缄默]`,
  },
  {
    img: require('./jianmo.png'),
    emojiTag: `[缄默]`,
  },
  {
    img: require('./jinpai.png'),
    emojiTag: `[金牌]`,
  },
  {
    img: require('./jungongzhang.png'),
    emojiTag: `[军功章]`,
  },
  {
    img: require('./ku.png'),
    emojiTag: `[哭]`,
  },
  {
    img: require('./kun.png'),
    emojiTag: `[困]`,
  },
  {
    img: require('./kunhuo.png'),
    emojiTag: `[困惑]`,
  },
  {
    img: require('./kunrao.png'),
    emojiTag: `[困扰]`,
  },
  {
    img: require('./kuxiao.png'),
    emojiTag: `[苦笑]`,
  },
  {
    img: require('./lanqiu.png'),
    emojiTag: `[篮球]`,
  },
  {
    img: require('./laohuji.png'),
    emojiTag: `[老虎机]`,
  },
  {
    img: require('./lapaocaidai.png'),
    emojiTag: `[拉炮彩带]`,
  },
  {
    img: require('./lei.png'),
    emojiTag: `[累]`,
  },
  {
    img: require('./leiqiu.png'),
    emojiTag: `[垒球]`,
  },
  {
    img: require('./leisile.png'),
    emojiTag: `[累死了]`,
  },
  {
    img: require('./lenghan.png'),
    emojiTag: `[冷汗]`,
  },
  {
    img: require('./lengmo.png'),
    emojiTag: `[冷漠]`,
  },
  {
    img: require('./lianhong.png'),
    emojiTag: `[脸红]`,
  },
  {
    img: require('./liyuqi.png'),
    emojiTag: `[鲤鱼旗]`,
  },
  {
    img: require('./maoxian.png'),
    emojiTag: `[毛线]`,
  },
  {
    img: require('./meishiganlanqiu.png'),
    emojiTag: `[美式橄榄球]`,
  },
  {
    img: require('./mensong.png'),
    emojiTag: `[门松]`,
  },
  {
    img: require('./miyantushe.png'),
    emojiTag: `[眯眼吐舌]`,
  },
  {
    img: require('./mofabang.png'),
    emojiTag: `[魔法棒]`,
  },
  {
    img: require('./mojingxiaolian.png'),
    emojiTag: `[墨镜笑脸]`,
  },
  {
    img: require('./nangua.png'),
    emojiTag: `[南瓜]`,
  },
  {
    img: require('./nuhuozhongshao.png'),
    emojiTag: `[怒火中烧]`,
  },
  {
    img: require('./paiqiu.png'),
    emojiTag: `[排球]`,
  },
  {
    img: require('./piao.png'),
    emojiTag: `[票]`,
  },
  {
    img: require('./pingpangqiu.png'),
    emojiTag: `[乒乓球]`,
  },
  {
    img: require('./pintu.png'),
    emojiTag: `[拼图]`,
  },
  {
    img: require('./qianshui.png'),
    emojiTag: `[潜水]`,
  },
  {
    img: require('./qinqin.png'),
    emojiTag: `[亲亲]`,
  },
  {
    img: require('./qixishu.png'),
    emojiTag: `[七夕树]`,
  },
  {
    img: require('./quanjishoutao.png'),
    emojiTag: `[拳击手套]`,
  },
  {
    img: require('./qixishu.png'),
    emojiTag: `[七夕树]`,
  },
  {
    img: require('./ruchangjuan.png'),
    emojiTag: `[入场券]`,
  },
  {
    img: require('./saizi.png'),
    emojiTag: `[骰子]`,
  },
  {
    img: require('./shanliang.png'),
    emojiTag: `[闪亮]`,
  },
  {
    img: require('./shengdanshu.png'),
    emojiTag: `[圣诞树]`,
  },
  {
    img: require('./shengqi.png'),
    emojiTag: `[生气]`,
  },
  {
    img: require('./shiwang.png'),
    emojiTag: `[失望]`,
  },
  {
    img: require('./shuijingqiu.png'),
    emojiTag: `[水晶球]`,
  },
  {
    img: require('./shuizhaole.png'),
    emojiTag: `[睡着了]`,
  },
  {
    img: require('./sidai.png'),
    emojiTag: `[丝带]`,
  },
  {
    img: require('./songleyikouqi.png'),
    emojiTag: `[松了一口气]`,
  },
  {
    img: require('./taidixiong.png'),
    emojiTag: `[泰迪熊]`,
  },
  {
    img: require('./taiqiu.png'),
    emojiTag: `[台球]`,
  },
  {
    img: require('./tanqi.png'),
    emojiTag: `[叹气]`,
  },
  {
    img: require('./taowa.png'),
    emojiTag: `[套娃]`,
  },
  {
    img: require('./tiaosepan.png'),
    emojiTag: `[调色盘]`,
  },
  {
    img: require('./tong.png'),
    emojiTag: `[痛]`,
  },
  {
    img: require('./tongku.png'),
    emojiTag: `[痛苦]`,
  },
  {
    img: require('./tongpai.png'),
    emojiTag: `[铜牌]`,
  },
  {
    img: require('./tuse.png'),
    emojiTag: `[吐舌]`,
  },
  {
    img: require('./weixiaodemao.png'),
    emojiTag: `[微笑的猫]`,
  },
  {
    img: require('./weixiaoqinqin.png'),
    emojiTag: `[微笑亲亲]`,
  },
  {
    img: require('./weixiaotianshi.png'),
    emojiTag: `[微笑天使]`,
  },
  {
    img: require('./wucaixiuqiu.png'),
    emojiTag: `[五彩绣球]`,
  },
  {
    img: require('./wuyu.png'),
    emojiTag: `[无语]`,
  },
  {
    img: require('./xian.png'),
    emojiTag: `[线]`,
  },
  {
    img: require('./xiaochuyanleidemao.png'),
    emojiTag: `[笑出眼泪的猫]`,
  },
  {
    img: require('./xiaokule.png'),
    emojiTag: `[笑哭了]`,
  },
  {
    img: require('./xiasile.png'),
    emojiTag: `[吓死了]`,
  },
  {
    img: require('./xieyanxiao.png'),
    emojiTag: `[斜眼笑]`,
  },
  {
    img: require('./xiusheqinqin.png'),
    emojiTag: `[羞涩亲亲]`,
  },
  {
    img: require('./xiusheweixiao.png'),
    emojiTag: `[羞涩微笑]`,
  },
  {
    img: require('./xixi.png'),
    emojiTag: `[嘻嘻]`,
  },
  {
    img: require('./xueqiao.png'),
    emojiTag: `[雪橇]`,
  },
  {
    img: require('./yanhua.png'),
    emojiTag: `[烟花]`,
  },
  {
    img: require('./yanhuo.png'),
    emojiTag: `[烟火]`,
  },
  {
    img: require('./yinpai.png'),
    emojiTag: `[银牌]`,
  },
  {
    img: require('./youxichaozuogan.png'),
    emojiTag: `[游戏操作杆]`,
  },
  {
    img: require('./youxishoubing.png'),
    emojiTag: `[游戏手柄]`,
  },
  {
    img: require('./youyouqiu.png'),
    emojiTag: `[悠悠球]`,
  },
  {
    img: require('./yumaoqiu.png'),
    emojiTag: `[羽毛球]`,
  },
  {
    img: require('./yun.png'),
    emojiTag: `[晕]`,
  },
  {
    img: require('./yundongbeixing.png'),
    emojiTag: `[运动背心]`,
  },
  {
    img: require('./yuntouzhuanxiang.png'),
    emojiTag: `[晕头转向]`,
  },
  {
    img: require('./zayan.png'),
    emojiTag: `[眨眼]`,
  },
  {
    img: require('./zhenjing.png'),
    emojiTag: `[震惊]`,
  },
  {
    img: require('./zuqiu.png'),
    emojiTag: `[足球]`,
  },
  {
    img: require('./zhiyaliezhui.png'),
    emojiTag: `[龇牙咧嘴]`,
  },
];
const INPUT_EMOJIDATA = () => {
  const input_emojiData = EMOJIDATA.filter((item) => {
    const assetSource = Image.resolveAssetSource(item.img);
    const inputEmojiDataItem: IInputEmojiDataType = {
      img: assetSource,
      emojiTag: item.emojiTag,
      type: 1,
      emojiUri: assetSource.uri,
    };
    return inputEmojiDataItem;
  });
  return input_emojiData;
};
const EMOJITAGS = () => {
  return EMOJIDATA.filter((item) => item.emojiTag);
};
const EMOJIREQUIRES = () => {
  return EMOJIDATA.filter((item) => item.emojiTag);
};
export {
  EMOJIDATA,
  INPUT_EMOJIDATA,
  EMOJITAGS,
  EMOJIREQUIRES,
  IEmojiDataType,
  IInputEmojiDataType,
};
