import React from 'react';
import {
  FlatList,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { EMOJIDATA, IEmojiDataType, IInputEmojiDataType } from './assets';
interface IProps {
  keyBoardHeight?: number;
  numColumns: number;
  onSelect?: (data: IInputEmojiDataType) => void;
}
const EMOJISIZE = 40;
const { width } = Dimensions.get('window');
const EmojiList: React.FC<IProps> = (props) => {
  const onPress = (data: IEmojiDataType) => () => {
    const assetSource = Image.resolveAssetSource(data.img);
    const item: IInputEmojiDataType = {
      emojiTag: data.emojiTag,
      img: assetSource,
      type: 1,
      emojiUri: assetSource.uri,
    };
    props.onSelect && props.onSelect(item);
  };
  const emoji_Item = ({ item }: { item: IEmojiDataType }) => {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress(item)}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: width / props.numColumns,
            height: width / props.numColumns,
          }}
        >
          <Image
            source={item.img}
            style={{ width: EMOJISIZE, height: EMOJISIZE }}
          />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ height: props.keyBoardHeight, width: '100%' }}>
      <FlatList
        data={EMOJIDATA}
        renderItem={emoji_Item}
        numColumns={props.numColumns}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        getItemLayout={(_data, index) => ({
          length: EMOJISIZE,
          offset: EMOJISIZE * index,
          index,
        })}
      />
    </View>
  );
};
export { EmojiList };
