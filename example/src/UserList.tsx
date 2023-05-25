import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
interface IProps {
  keyWord: string;
  onSelect: (data: IUserDataType) => void;
}
export interface IUserDataType {
  userName: string;
  userId: string;
}
const UserList: React.FC<IProps> = (props) => {
  const [data, setData] = useState<IUserDataType[]>([]);
  const sjsz = (num: number) => {
    const ary = []; //创建一个空数组用来保存随机数组
    for (var i = 0; i < num; i++) {
      //按照正常排序填充数组
      ary[i] = i + 1;
    }
    ary.sort(function () {
      return 0.5 - Math.random(); //返回随机正负值
    });

    return ary; //返回数组
  };
  useEffect(() => {
    if (props.keyWord !== undefined) {
      const arr = sjsz(10);
      const newData: IUserDataType[] = [];
      arr.filter((item) => {
        const newItem: IUserDataType = {
          userName: `n+${item}`,
          userId: `${item}`,
        };
        newData.push(newItem);
      });

      setData(newData);
    }
  }, [props.keyWord]);
  const select = (item: IUserDataType) => () => {
    props.onSelect(item);
  };
  const user_renderItem = ({ item }: { item: IUserDataType }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={select(item)}
        style={{
          alignItems: 'center',
          marginLeft: 10,
        }}
      >
        <View
          style={{
            backgroundColor: 'blue',
            width: 50,
            height: 50,
            borderRadius: 25,
          }}
        ></View>
        <Text style={{ fontSize: 15, color: '#fff' }}>{item.userName}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ height: 100, backgroundColor: '#000' }}>
      <FlatList data={data} horizontal={true} renderItem={user_renderItem} />
    </View>
  );
};
export { UserList };
