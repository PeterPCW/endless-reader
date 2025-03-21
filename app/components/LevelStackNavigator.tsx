// /app/components/LevelStackNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationIndependentTree } from '@react-navigation/core';
import Practice from '@/app/screens/(tabs)/Practice';
import Game from '@/app/screens/(tabs)/Game';
import ReadyToRead from '@/app/screens/(tabs)/ReadyToRead';
import Complete from '@/app/screens/(tabs)/Complete';

const Tab = createBottomTabNavigator();

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
          component={Practice}
          options={{ title: 'Practice' }}
        />

        {/* Endless Words game screen */}
        <Tab.Screen
          name="Game"
          component={Game}
          options={{ title: 'Game' }}
        />

        {/* ReadyToRead challenge screen */}
        <Tab.Screen
          name="ReadyToRead"
          component={ReadyToRead}
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
