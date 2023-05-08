import * as React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageResolvedAssetSource,
  Image,
  View,
} from 'react-native';
import {
  IATTextViewBase,
  IInserTextAttachmentItem,
  ITextType,
  IonMentionData,
  VariableTextInputView,
} from 'react-native-variable-text-input';
export const App = () => {
  const inPutRef = React.createRef<IATTextViewBase>();
  const onChangeText = (text: string) => {
    console.log('====>', text);
  };
  const insertEmoji = () => {
    const data: ImageResolvedAssetSource = Image.resolveAssetSource(
      require('./kuxiao.png')
    );
    inPutRef.current?.insertEmoji({
      img: data,
      emojiTag: '[苦笑]',
      type: ITextType.emoji,
      emojiUri: data.uri,
    });
  };
  const blur = () => {
    inPutRef.current?.blur();
  };
  const insertMonthons = () => {
    inPutRef.current?.insertMentions({
      tag: '@',
      name: 'James Harden',
      color: '#CEDA39',
      id: '123344',
      type: ITextType.tagText,
    });
  };
  const changeAttributedText = () => {
    const imageData: ImageResolvedAssetSource = Image.resolveAssetSource(
      require('./kuxiao.png')
    );
    const emojiData: IInserTextAttachmentItem = {
      img: imageData,
      emojiTag: '[苦笑]',
      type: 1,
      emojiUri: imageData.uri,
    };
    const tagData: IInserTextAttachmentItem = {
      tag: '#',
      name: '测试tag',
      color: '#CEDA39',
      id: '123344',
      type: ITextType.tagText,
    };
    inPutRef.current?.changeAttributedText([
      { type: 0, text: '普通字符' },
      emojiData,
      tagData,
      { type: 0, text: '普通字符' },
      tagData,
      emojiData,
      { type: 0, text: '普通字符' },
      tagData,
      { type: 0, text: '普通字符' },
      tagData,
      emojiData,
      emojiData,
      emojiData,
    ]);
  };
  const focus = () => {
    inPutRef.current?.focus();
  };
  const sub = (e: any) => {
    console.log('rrrrr===>', e);
  };
  const onMention = (data: IonMentionData) => {
    //todo
    console.log('onMentions===>', data);
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <VariableTextInputView
        style={styles.box}
        ref={inPutRef}
        onChangeText={onChangeText}
        placeholder={'测试测试测试'}
        placeholderTextColor={'#fff'}
        underlineColorAndroid={'rgba(0,0,0,0)'}
        blurOnSubmit={true}
        onSubmitEditing={sub}
        mentions={['@', '#']}
        onMention={onMention}
        keyboardAppearance={'dark'}
      />
      <View style={{ flexDirection: 'row', marginTop: 40 }}>
        <TouchableOpacity onPress={blur} style={{ marginLeft: 20 }}>
          <Text style={{ backgroundColor: 'yellow', color: 'red' }}>
            {'blur'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={focus} style={{ marginLeft: 10 }}>
          <Text style={{ backgroundColor: 'yellow', color: 'red' }}>
            {'focus'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={insertMonthons} style={{ marginLeft: 10 }}>
          <Text style={{ backgroundColor: 'yellow', color: 'red' }}>
            {'insertMonthons'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={insertEmoji} style={{ marginLeft: 10 }}>
          <Text style={{ backgroundColor: 'yellow', color: 'red' }}>
            {'insertEmoji'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={changeAttributedText}
          style={{ marginLeft: 10 }}
        >
          <Text style={{ backgroundColor: 'yellow', color: 'red' }}>
            {'changeAttributedText'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: '#000',
    color: '#fff',
    fontSize: 14,
    width: '100%',
  },
});
