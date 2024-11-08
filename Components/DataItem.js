import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Padding, BorderRadius, Margin, Align } from '../Utils/Style';

const DataItem = ({ data }) => {
  return (
    <View style={styles.dataContainer}>
      <Text style={styles.data}>{data}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    data: {
        textAlign: Align.center,
    },
    dataContainer: {
        backgroundColor: Colors.tertiary,
        borderRadius: BorderRadius.small,
        padding: Padding.small,
        marginHorizontal: Margin.xsmall,
        paddingHorizontal: Padding.large,
    },
});

export default DataItem;