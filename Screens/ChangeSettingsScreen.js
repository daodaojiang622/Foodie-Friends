import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '../Components/ThemeContext';
import { Margin, ContainerStyle, Padding } from '../Utils/Style';
import PressableButton from '../Components/PressableButtons/PressableButton';

export default function ChangeSettingsScreen() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    // const navigation = useNavigation();
  
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>

        <PressableButton
            title="Change Theme Color"
            onPress={toggleTheme}
        />
        <PressableButton
            title="Log Out"
            // onPress={toggleTheme}
            buttonStyle={{marginTop: Margin.medium}}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: ContainerStyle.flex,
        padding: Padding.xlarge,
      },
})