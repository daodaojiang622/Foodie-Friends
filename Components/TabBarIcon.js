import React from 'react';
import { StyleSheet } from 'react-native';
import { Font, Icon } from '../Utils/Style';

const TabBarIcon = ({ routeName, iconStyle }) => {
  let iconName;
  let IconComponent;

  if (routeName === 'Activities') {
    IconComponent = Icon.activityIconComponent;
    iconName = Icon.activityIconName;
  } else if (routeName === 'Diet') {
    IconComponent = Icon.dietIconComponent;
    iconName = Icon.dietIconName;
  } else if (routeName === 'Settings') {
    IconComponent = Icon.settingsIconComponent;
    iconName = Icon.settingsIconName;
  }

  return <IconComponent name={iconName} style={[styles.icon, iconStyle]} />;
};

const styles = StyleSheet.create({
  icon: {
    fontSize: Font.SizeLarge,
  },
});

export default TabBarIcon;