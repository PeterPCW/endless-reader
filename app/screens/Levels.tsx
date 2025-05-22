import React, { useEffect, useState, useContext, createContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { levelsData, LevelMetaData, LevelData } from '@/app/assets/data/levels';
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';
import type { RootStackParamList } from '@/app/screens/Games';
export interface Level extends LevelMetaData {
  title: string;
}

type LevelContextType = {
  selectedLevel: LevelData | null;
  setSelectedLevel: (level: LevelMetaData) => void;
};

export const LevelContext = createContext<LevelContextType>({
  selectedLevel: null,
  setSelectedLevel: () => {},
});

export default function Levels() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { setSelectedLevel } = useContext(LevelContext);
  const [levels, setLevels] = useState<Level[]>([]);

  useEffect(() => {
    // Load levels from the JSON file (assumed to be an array of level objects)
    setLevels(levelsData.levels.map(level => ({
      ...level,
      title: level.name,
    })));
  }, []);

  const onSelectLevel = (level: Level) => {
    setSelectedLevel(level); // Ensure this updates the context
    navigation.navigate('LevelStack');
  };

  const renderLevelItem = ({ item }: { item: Level }) => (
    <TouchableOpacity style={styles.levelButton} onPress={() => onSelectLevel(item)}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.levelTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.levelsContainer}>
      <FlatList
        data={levels}
        renderItem={renderLevelItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.levelsListContainer}
        // FlatList already supports lazy loading via windowing
        initialNumToRender={5}
      />
    </View>
  );
}
