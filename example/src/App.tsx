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
import VariableTextInputView, {
  IATTextViewBase,
  IInserTextAttachmentItem,
  ITextType,
} from 'react-native-variable-text-input';
export const App = () => {
  const inPutRef = React.createRef<IATTextViewBase>();
  const onChangeText = (text: string) => {
    const triggerRegEx = /({([^{^}]*)}\[([^[]*)]\(([^(^)]*)\))/gi;
    const singleGroupTriggerRegEx = /({[^{^}]*}\[[^[]*]\([^(^)]*\))/gi;
    const matchStr = text.match(triggerRegEx);
    if (matchStr !== null) {
      const subStrArr = text.split(triggerRegEx);
      subStrArr.forEach((item) => {
        const arr = item.match(singleGroupTriggerRegEx);
        console.log('====>', arr);
      });
    }
  };
  const insertEmoji = () => {
    const data: ImageResolvedAssetSource = Image.resolveAssetSource(
      require('./[苦笑].png')
    );
    inPutRef.current?.insertEmoji({
      img: data,
      emojiTag: '[苦笑]',
      type: ITextType.emoji,
    });
  };
  const blur = () => {
    inPutRef.current?.blur();
  };
  const insertMonthons = () => {
    inPutRef.current?.insertMentions({
      tag: '#',
      name: '测试tag',
      color: 'red',
      id: '123344',
      type: ITextType.tagText,
    });
  };
  const changeAttributedText = () => {
    const imageData: ImageResolvedAssetSource = Image.resolveAssetSource(
      require('./[苦笑].png')
    );
    const emojiData = { img: imageData, emojiTag: '[苦笑]' };
    const tagData: IInserTextAttachmentItem = {
      tag: '#',
      name: '测试tag',
      color: 'red',
      id: '123344',
      type: ITextType.tagText,
    };
    inPutRef.current?.changeAttributedText([
      { type: 0, text: '普通字符' },
      { type: 1, ...emojiData },
      tagData,
    ]);
  };
  const focus = () => {
    inPutRef.current?.focus();
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <VariableTextInputView
        style={styles.box}
        ref={inPutRef}
        onChangeText={onChangeText}
        placeholder={'测试测试测试'}
        underlineColorAndroid={'rgba(0,0,0,0)'}
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
    backgroundColor: 'blue',
    color: '#fff',
    fontSize: 14,
    width: '100%',
    minHeight: 100,
  },
});
