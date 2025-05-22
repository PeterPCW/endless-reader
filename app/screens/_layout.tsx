import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationIndependentTree } from '@react-navigation/core';
import ProfileSelection from '@/app/screens/ProfileSelection';
import Games from '@/app/screens/Games';
import LevelStackNavigator from '@/app/navigation/LevelStackNavigator';
import WordsShower from '@/app/screens/(tabs)/Game Screens/wordsShower';
import Profile from '@/app/screens/Profile';
import GamesNavigator from '@/app/navigation/GamesNavigator';
import Runner from '@/app/screens/(tabs)/Game Screens/Runner';
import Snake from '@/app/screens/(tabs)/Game Screens/Snake';
import Invaders from '@/app/screens/(tabs)/Game Screens/Invaders';
import Rampage from '@/app/screens/(tabs)/Game Screens/Rampage';

export function RootLayout() {
  return (
    <NavigationIndependentTree>
      <AppNavigator />
    </NavigationIndependentTree>
  );
}

export function GamesLayout() {
  return (
    <NavigationIndependentTree>
      <GamesNavigator />
    </NavigationIndependentTree>
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
        name="Games"
        component={Games}
        options={{ headerShown: true }}
      />

      {/* 3. In-Level Experience (Tabs for Level Detail, Practice, Game, ReadyToRead) */}
      <Stack.Screen
        name="LevelStack"
        component={LevelStackNavigator}
        options={{ headerShown: true }}
      />

      {/* 4. Profile Screen */}
      {/* This screen is not part of the main navigation flow but can be accessed from other screens */}
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: true }}
      />
      
      {/* 5. Games Navigator */}
      <Stack.Screen
        name="GamesNavigator"
        component={GamesNavigator}
        options={{ headerShown: false }}
      />

      {/* Game screens */}
      <Stack.Screen
        name="Runner"
        component={() => <Runner />}
        options={{ title: 'Runner' }}
      />
      <Stack.Screen
        name="Snake"
        component={() => <Snake />}
        options={{ title: 'Snake' }}
      />
      <Stack.Screen
        name="Invaders"
        component={() => <Invaders />}
        options={{ title: 'Invaders' }}
      />
      <Stack.Screen
        name="Rampage"
        component={() => <Rampage />}
        options={{ title: 'Rampage' }}
      />
      <Stack.Screen
        name="WordsShower"
        component={() => <WordsShower />}
        options={{ title: 'WordsShower' }}
      />
    </Stack.Navigator>
  );
}
