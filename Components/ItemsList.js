import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors, Padding, Font, BorderRadius, ContainerStyle, Width, Margin, Align } from '../Utils/Style';
import { ThemeContext } from './ThemeContext';
import SpecialIndicator from './SpecialIndicator';
import DataItem from './DataItem';
import { collection, onSnapshot } from 'firebase/firestore';
import { database } from '../Firebase/firebaseSetup';
import { useNavigation } from '@react-navigation/native';

const ItemsList = ({ type }) => {
  const { theme } = useContext(ThemeContext);
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const collectionName = type === 'activity' ? 'activity' : 'diet';
    const unsubscribe = onSnapshot(collection(database, collectionName), (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      setData(items);
    });
    console.log('Unsubscribed from collection:', collectionName);
    return () => unsubscribe();
  }, [type]);

  console.log('ItemsList data:', data);

  const filteredData = data.filter(item => item.type === type);

  const renderItem = ({ item }) => {
    const handlePress = () => {
      if (item.type === 'activity') {
        navigation.navigate('AddActivity', { item, isEdit: true });
      } else if (item.type === 'diet') {
        navigation.navigate('AddDiet', { item, isEdit: true });
      }
    };

    return (
      <TouchableOpacity onPress={handlePress}>
        <View style={[styles.activityContainer, {backgroundColor: theme.headerColor}]}>
          <Text style={styles.name}>{item.name}</Text>

          {item.isSpecial === true && item.isApproved === false && <SpecialIndicator />}

          <DataItem data={item.date} />
          <DataItem data={item.otherData} />
        </View>
    </TouchableOpacity>
  );} 

  return (
    <FlatList
      data={filteredData}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  activityContainer: {
    flexDirection: ContainerStyle.flexDirection,
    justifyContent: ContainerStyle.justifyContent,
    padding: Padding.large,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.small,
    width: Width.medium,
    alignSelf: Align.center,
    marginTop: Margin.medium,
  },
  name: {
    flex: ContainerStyle.flex,
    textAlign: Align.left,
    color: Colors.tertiary,
    fontWeight: Font.weight,
  },
  special: {
    color: Colors.secondary,
    fontWeight: Font.weight,
    fontSize: Font.sizeLarge,
    marginRight: Margin.xsmall,
  },
});

export default ItemsList;