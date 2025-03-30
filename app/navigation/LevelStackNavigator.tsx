// /app/components/LevelStackNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationIndependentTree } from '@react-navigation/core';
import { NavigationProp } from '@react-navigation/native';

export type RootTabParamList = {
  Practice: undefined;
  Games: undefined;
  ReadyToRead: undefined;
  Complete: undefined;
  Runner: undefined;
  Snake: undefined;
  Invaders: undefined;
  Rampage: undefined;
};
import Practice from '@/app/screens/(tabs)/Practice';
import Games from '@/app/screens/(tabs)/Games';
import ReadyToRead from '@/app/screens/(tabs)/ReadyToRead';
import Complete from '@/app/screens/(tabs)/Complete';

const Tab = createBottomTabNavigator();

interface Level {
  id: string;
  title: string;
  thumbnail: string;
  // other properties can be added as needed
}

export default function LevelStackNavigator() {
  
  return (
    <NavigationIndependentTree>
      <Tab.Navigator initialRouteName="Practice">
        {/* Landing screen for the level with aggregated info and navigation buttons
            - if desired later change initialRouteName
        <Tab.Screen
          name="LevelDetail"
          component={LevelDetail}
          options={{ title: 'Level Detail' }}
        />*/}

        {/* Practice Words screen */}
        <Tab.Screen
          name="Practice"
          component={() => <Practice />}
          options={{ title: 'Practice' }}
        />

        {/* Endless Words game screen */}
        <Tab.Screen
          name="Games"
          component={() => <Games />}
          options={{ title: 'Games' }}
        />

        {/* ReadyToRead challenge screen */}
        <Tab.Screen
          name="ReadyToRead"
          component={() => <ReadyToRead />}
          options={{ title: 'Ready to Read' }}
        />

        {/* Completion reward screen*/}
        <Tab.Screen
          name="Complete"
          component={Complete}
          options={{ title: 'Complete' }}
        />
      </Tab.Navigator>
    </NavigationIndependentTree>
  );
}
