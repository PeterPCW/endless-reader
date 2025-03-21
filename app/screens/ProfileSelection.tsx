import React from 'react';
import { ThemedView } from '@/app/components/ThemedView';
import { Button } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import NewProfile from '@/app/components/NewProfile';


type RootStackParamList = {
  // other routes
  Profile: undefined;
  Levels: undefined;
  Explore: undefined;
  Complete: undefined;
};

export default function ProfileSelection() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <ThemedView>
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
      <Button title="Levels" onPress={() => navigation.navigate('Levels')} />
      <Button title="Explore" onPress={() => navigation.navigate('Explore')} />
      <Button title="New Profile" onPress={() => <NewProfile visible={true} onClose={() => {}} />} />
    </ThemedView>
  );
}
