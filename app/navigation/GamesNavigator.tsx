import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationIndependentTree } from '@react-navigation/core';
import Games from '@/app/screens/(tabs)/Games';
import Runner from '@/app/screens/(tabs)/Game Screens/Runner';
import Snake from '@/app/screens/(tabs)/Game Screens/Snake';
import Invaders from '@/app/screens/(tabs)/Game Screens/Invaders';
import Rampage from '@/app/screens/(tabs)/Game Screens/Rampage';

const Stack = createNativeStackNavigator();

export default function GamesNavigator() {
  return (
    <NavigationIndependentTree>
      <Stack.Navigator initialRouteName="Games">
        <Stack.Screen name="Games" component={Games} options={{ headerShown: true }} />
        <Stack.Screen name="Runner" component={Runner} options={{ headerShown: true }} />
        <Stack.Screen name="Snake" component={Snake} options={{ headerShown: true }} />
        <Stack.Screen name="Invaders" component={Invaders} options={{ headerShown: true }} />
        <Stack.Screen name="Rampage" component={Rampage} options={{ headerShown: true }} />
      </Stack.Navigator>
    </NavigationIndependentTree>
  );
}
