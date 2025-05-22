import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import NewProfile from '@/app/components/NewProfile';
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';

type RootStackParamList = {
  // other routes
  Profile: undefined;
  Games: undefined;
};

export default function ProfileSelection() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <View pointerEvents='none'>
          <Text style={styles.mainText}>Profile</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Games')}>
        <View pointerEvents='none'>
          <Text style={styles.mainText}>Games</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => <NewProfile visible={true} onClose={() => {}} />}>
        <View pointerEvents='none'>
          <Text style={styles.mainText}>New Profile</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
