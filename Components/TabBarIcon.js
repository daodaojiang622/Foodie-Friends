import React from 'react';
import { StyleSheet } from 'react-native';
import { Font, Icon } from '../Utils/Style';
import { Ionicons } from '@expo/vector-icons';

const TabBarIcon = ({ routeName, iconStyle }) => {
  let iconName;

  if (routeName === 'Map') {
    iconName = "map";
  } else if (routeName === 'Home') {
    iconName = "home";
  } else if (routeName === 'Settings') {
    iconName = Icon.settingsIconName;
  }

  return <Ionicons name={iconName} style={[styles.icon, iconStyle]} />;
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
});

export default TabBarIcon;