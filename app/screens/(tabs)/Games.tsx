import React from 'react';
import { ThemedView } from '@/app/components/ThemedView';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootTabParamList } from '@/app/navigation/LevelStackNavigator';
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';

export default function Games() {
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();

  return (
    <ThemedView>
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
      <TouchableOpacity onPress={() => navigation.navigate('Invaders')}>
            <View pointerEvents='none'>
              <Text style={styles.mainText}>Invaders</Text>
            </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Rampage')}>
            <View pointerEvents='none'>
              <Text style={styles.mainText}>Rampage</Text>
            </View>
      </TouchableOpacity>
    </ThemedView>
  );
}
