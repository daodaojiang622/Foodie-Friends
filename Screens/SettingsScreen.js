import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Colors, Padding, Margin, ContainerStyle, Font, Align, BorderRadius } from '../Utils/Style';
import { ThemeContext } from '../Components/ThemeContext';
import PressableButton from '../Components/PressableButtons/PressableButton';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../Firebase/firebaseSetup';
import { signOut } from 'firebase/auth';
import { cleanupListeners } from '../Firebase/firestoreHelper';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isGreenTheme } = useContext(ThemeContext);
  const navigation = useNavigation();

  // Handle navigation based on user's login status
  const handleNavigation = (screen) => {
    if (!auth.currentUser) {
      navigation.navigate('SignUpScreen');
    } else {
      navigation.navigate(screen);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              cleanupListeners(); // Stop all active Firestore listeners
              await signOut(auth); // Firebase sign out
              navigation.navigate('SignUpScreen'); // Redirect to login/signup screen
            } catch (error) {
              console.error("Error logging out:", error);
              Alert.alert("Logout Error", "There was a problem logging you out.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <PressableButton
        title="My Profile"
        onPress={() => handleNavigation('Profile')}
      />
      <PressableButton
        title="My Meet-ups"
        onPress={() => handleNavigation('MeetUp')}
        buttonStyle={{ marginTop: Margin.medium }}
      />
      <PressableButton
        title={isGreenTheme ? 'Change to Green Theme' : 'Change to Purple Theme'}
        onPress={toggleTheme}
      />
      <PressableButton
        title="Support"
        onPress={() => navigation.navigate('Support')}
        buttonStyle={{ marginTop: Margin.medium }}
      />
      {/* Logout Button */}
      <PressableButton
        title="Logout"
        onPress={handleLogout}
        buttonStyle={{ marginTop: Margin.medium }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: ContainerStyle.flex,
    padding: Padding.xlarge,
  },
  themeButtonText: {
    color: Colors.tertiary,
    fontSize: Font.sizeMedium,
    textAlign: Align.center,
    padding: Padding.medium,
  },
  themeButton: {
    marginTop: Margin.xxxxlarge,
    borderRadius: BorderRadius.medium,
    alignSelf: Align.center,
  },
});
