import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Keyboard,
  KeyboardEvent,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {
  IATTextViewBase,
  IonMentionData,
  VariableTextInputView,
} from 'react-native-variable-text-input';
import { EmojiList } from './EmojiList';
export const App = () => {
  const inPutRef = React.createRef<IATTextViewBase>();
  const [keyBoardHeight, setKeyBoardHeight] = useState<number>(0);
  // const [showUser, setShowUser] = useState<boolean>(false);
  // const [showTags, setShowTags] = useState<boolean>(false);
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  // const [ setTextValue] = useState<string>('');
  React.useEffect(() => {
    const showListener = Keyboard.addListener(
      'keyboardDidShow',
      keyBoardDidShow
    );
    const hideListener = Keyboard.addListener(
      'keyboardDidHide',
      keyBoardDidHide
    );
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);
  const keyBoardDidShow = (event: KeyboardEvent) => {
    setKeyBoardHeight(event.endCoordinates.height);
  };
  const keyBoardDidHide = () => {
    // setKeyBoardHeight(0);
  };
  const onChangeText = (text: string) => {
    // setTextValue(text);
    console.log('text===>', text);
  };
  const sub = (e: any) => {
    console.log('rrrrr===>', e);
  };
  const onMention = (data: IonMentionData) => {
    //todo
    console.log('onMentions===>', data);
  };
  const onTouchEmView = () => {
    setKeyBoardHeight(0);
    inPutRef.current?.blur();
  };
  const onTouchContro = () => {
    !showEmoji && inPutRef.current?.blur();
    showEmoji && inPutRef.current?.focus();
    setShowEmoji(!showEmoji);
  };
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: '100%' }}>
        <TouchableOpacity
          onPress={onTouchEmView}
          activeOpacity={1}
          style={{ flex: 1 }}
        />
      </View>
      <View>
        <View style={styles.hor}>
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
          <TouchableOpacity
            activeOpacity={0.85}
            style={{ marginLeft: 10 }}
            onPress={onTouchContro}
          >
            <Image
              source={
                !showEmoji
                  ? require('./assets/icon/emoji_icon.png')
                  : require('./assets/icon/keyboard_icon.png')
              }
              style={styles.icon}
            />
          </TouchableOpacity>
          <View style={styles.sendButton}>
            <Text style={styles.sendText}>SEND</Text>
          </View>
        </View>
        <EmojiList numColumns={6} keyBoardHeight={keyBoardHeight} />
      </View>
    </View>
  );
};
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  box: {
    backgroundColor: '#000',
    color: '#fff',
    fontSize: 14,
    minHeight: 40,
    flex: 1,
  },
  hor: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
  },
  sendButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 15,
    width: 60,
    height: 30,
    marginHorizontal: 10,
  },
  sendText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  icon: {
    width: 30,
    height: 30,
  },
});
