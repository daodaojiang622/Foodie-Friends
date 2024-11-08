import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Margin, ContainerStyle, Font } from '../Utils/Style';

const SpecialItemApproval = ({ isApproved, setIsApproved, theme }) => {
  return (
    <View style={styles.checkboxContainer}>
      <Text style={[styles.label, { color: theme.headerColor }]}>
        *This item is marked as special. Select the checkbox if you would like to approve it.
      </Text>
      <Checkbox
        value={isApproved}
        onValueChange={() => setIsApproved(prev => !prev)}  // Toggle isApproved state
      />
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: ContainerStyle.flexDirection,
    alignItems: ContainerStyle.alignItems,
    marginHorizontal: Margin.medium,
  },
  label: {
    fontSize: Font.sizeMedium,
    marginRight: Margin.small,
    fontWeight: Font.weight,
  },
});

export default SpecialItemApproval;