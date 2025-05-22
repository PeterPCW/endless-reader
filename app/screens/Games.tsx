import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootTabParamList } from '@/app/navigation/LevelStackNavigator';
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';

export type RootStackParamList = {
  ProfileSelection: undefined;
  Games: undefined;
  Explore: undefined;
  LevelStack: undefined;
  Profile: undefined;
  GamesNavigator: { screen: 'Runner' | 'Snake' | 'Invaders' | 'Rampage' };
};

export default function Games() {
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('Runner')}>
            <View pointerEvents='none'>
              <Text style={styles.mainText}>Runner</Text>
            </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Snake')}>
            <View pointerEvents='none'>
              <Text style={styles.mainText}>Snake</Text>
            </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('WordsShower')}>
            <View pointerEvents='none'>
              <Text style={styles.mainText}>WordsShower</Text>
            </View>
      </TouchableOpacity>
      {/*<TouchableOpacity onPress={() => navigation.navigate('Rampage')}>
            <View pointerEvents='none'>
              <Text style={styles.mainText}>Rampage</Text>
            </View>
      </TouchableOpacity>*/}
    </View>
  );
}
