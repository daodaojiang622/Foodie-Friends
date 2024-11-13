import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarIcon from './Components/TabBarIcon';
import ScreenWrapper from './Components/ScreenWrapper';

import ProfileScreen from './Screens/ProfileScreen';
import MeetUpScreen from './Screens/MeetUpScreen';
import SettingsScreen from './Screens/SettingsScreen';
import MapScreen from './Screens/MapScreen';
import HomeScreen from './Screens/HomeScreen';
import EditMeetUpScreen from './Screens/EditMeetUpScreen';
import SignUpScreen from './Screens/SignUpScreen'; 

import { Colors, Padding, Font, Icon, ContainerStyle } from './Utils/Style';
import { ThemeProvider, ThemeContext } from './Components/ThemeContext';
import SupportScreen from './Screens/SupportScreen';
import EditPostScreen from './Screens/EditPostScreen';
import FoodGalleryScreen from './Screens/FoodGalleryScreen';
import ReviewDetailScreen from './Screens/ReviewDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MapScreenWrapper() {
  return (
    <ScreenWrapper>
      <MapScreen />
    </ScreenWrapper>
  );
}

function HomeScreenWrapper() {
  return (
    <ScreenWrapper>
      <HomeScreen />
    </ScreenWrapper>
  );
}

function SettingsScreenWrapper() {
  return (
    <ScreenWrapper>
      <SettingsScreen />
    </ScreenWrapper>
  );
}

function BottomTabs() {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            routeName={route.name}
            iconStyle={{ color: focused ? Colors.secondary : Colors.tertiary }}
          />
        ),
        tabBarStyle: {
          backgroundColor: theme.headerColor,
        },
        headerShown: false,
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.tertiary,
      })}
    >
      <Tab.Screen
        name="Map"
        component={MapScreenWrapper}
        options={() => ({
          headerTintColor: Colors.tertiary,
        })}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreenWrapper}
        options={({ navigation }) => ({
          headerTintColor: Colors.tertiary,
        })}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreenWrapper}
        options={{
          headerTintColor: Colors.tertiary,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useContext(ThemeContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.headerColor,
          },
        }}
      >
        <Stack.Screen
          name="Back"
          component={BottomTabs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'My Profile',
            headerTintColor: Colors.tertiary,
          }}
        />
        <Stack.Screen
          name="FoodGallery"
          component={FoodGalleryScreen}
          options={{
            title: 'My Food Gallery',
            headerTintColor: Colors.tertiary,
          }}
        />
        <Stack.Screen
          name="ReviewDetailScreen"
          component={ReviewDetailScreen}
          options={{
            title: 'Review Detail',
            headerTintColor: Colors.tertiary,
          }}
        />
        <Stack.Screen
          name="MeetUp"
          component={MeetUpScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('EditMeetUp')}
                style={styles.addIconContainer}
              >
                <Icon.addIconComponent
                  name={Icon.addIconName}
                  style={styles.addIcon}
                />
              </TouchableOpacity>
            ),
            headerTintColor: Colors.tertiary,
            title: 'My Meet-ups',
          })}
        />
        <Stack.Screen
          name="EditMeetUp"
          component={EditMeetUpScreen}
          options={{
            headerTintColor: Colors.tertiary,
            title: "Create a Meet-Up",
          }}
        />
        <Stack.Screen
          name="Support"
          component={SupportScreen}
          options={{
            headerTintColor: Colors.tertiary,
          }}
        />
        <Stack.Screen
          name="EditPost"
          component={EditPostScreen}
          options={{
            headerTintColor: Colors.tertiary,
          }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{
            title: 'Sign Up',
            headerTintColor: Colors.tertiary,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  addIcon: {
    color: Colors.tertiary,
    fontSize: Font.SizeLarge,
  },
  addIconContainer: {
    flexDirection: ContainerStyle.flexDirection,
    paddingRight: Padding.xxlarge,
  },
});
