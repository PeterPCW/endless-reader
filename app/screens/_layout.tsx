import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import ProfileSelection from '@/app/screens/ProfileSelection';
import Profile from '@/app/screens/Profile';
import Levels from '@/app/screens/Levels';
import Explore from '@/app/screens/Explore';
import LevelStackNavigator from '@/app/components/LevelStackNavigator';
import Complete from '@/app/screens/Complete';

export default function RootLayout() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="ProfileSelection">
      {/* 1. Profile Selection */}
      <Stack.Screen
        name="ProfileSelection"
        component={ProfileSelection}
        options={{ headerShown: true }}
      />

      {/* 2. Level Selection */}
      <Stack.Screen
        name="Levels"
        component={Levels}
        options={{ headerShown: true }}
      />

      {/* 3. Explore Expo Screen */}
      <Stack.Screen
        name="explore"
        component={Explore}
        options={{ headerShown: true}}
      />

      {/* 4. In-Level Experience (Tabs for Level Detail, Practice, Game, ReadyToRead) */}
      <Stack.Screen
        name="LevelStack"
        component={LevelStackNavigator}
        options={{ headerShown: true }}
      />

      {/* 5. Completion Screen (outside of tabs) */}
      <Stack.Screen
        name="Complete"
        component={Complete}
        options={{ headerShown: true }}
      />

      {/* 2. Profile Settings */}
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}
