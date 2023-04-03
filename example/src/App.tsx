import * as React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageResolvedAssetSource,
  Image,
  NativeModules,
  View,
} from 'react-native';
import VariableTextInputView, {
  IATTextViewBase,
} from 'react-native-variable-text-input';
const VariableTextInputViewManager = NativeModules.VariableTextInputViewManager;
export const App = () => {
  const inPutRef = React.createRef<IATTextViewBase>();
  const onChangeText = (text: string) => {
    console.log('sdkljflksdjfl====>', text);
  };
  const testAction = () => {
    VariableTextInputViewManager.getKeyboardHeight((height: number) => {
      console.log('=====>', height);
    });
  };
  const insertEmoji = () => {
    const data: ImageResolvedAssetSource = Image.resolveAssetSource(
      require('./[苦笑].png')
    );
    inPutRef.current?.insertEmoji({ img: data, tag: '[苦笑]' });
  };
  const blur = () => {
    //todo
  };
  const insertMonthons = () => {
    //todo
  };
  const changeAttributedText = () => {
    //todo
  };
  const focus = () => {
    //todo
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
        <TouchableOpacity onPress={testAction} style={{ marginLeft: 20 }}>
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
