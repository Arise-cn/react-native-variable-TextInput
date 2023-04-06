import * as React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageResolvedAssetSource,
  Image,
  View,
  processColor,
} from 'react-native';
import VariableTextInputView, {
  IATTextViewBase,
} from 'react-native-variable-text-input';
export const App = () => {
  const inPutRef = React.createRef<IATTextViewBase>();
  const onChangeText = (text: string) => {
    console.log('sdkljflksdjfl====>', text);
  };
  const insertEmoji = () => {
    const data: ImageResolvedAssetSource = Image.resolveAssetSource(
      require('./[苦笑].png')
    );
    inPutRef.current?.insertEmoji({ img: data, tag: '[苦笑]' });
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
    });
  };
  const changeAttributedText = () => {
    const imageData: ImageResolvedAssetSource = Image.resolveAssetSource(
      require('./[苦笑].png')
    );
    const emojiData = { img: imageData, tag: '[苦笑]' };
    inPutRef.current?.changeAttributedText([
      { type: 0, text: '普通字符' },
      { type: 1, emojiData },
      {
        type: 2,
        targData: {
          tag: '#',
          name: '测试tag',
          color: processColor('red'),
          id: '123344',
        },
      },
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
        <TouchableOpacity onPress={focus} style={{ marginLeft: 20 }}>
          <Text style={{ backgroundColor: 'yellow', color: 'red' }}>
            {'focus'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={insertMonthons} style={{ marginLeft: 20 }}>
          <Text style={{ backgroundColor: 'yellow', color: 'red' }}>
            {'insertMonthons'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={insertEmoji} style={{ marginLeft: 20 }}>
          <Text style={{ backgroundColor: 'yellow', color: 'red' }}>
            {'insertEmoji'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={changeAttributedText}
          style={{ marginLeft: 20 }}
        >
          <Text style={{ backgroundColor: 'yellow', color: 'red' }}>
            {'insertEmoji'}
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
    fontSize: 18,
    width: '100%',
    minHeight: 100,
    padding: 0,
  },
});
