import React, { useEffect, useState, useContext, createContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import levelData from '@/app/assets/data/levels.json';
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';

interface Level {
  id: string;
  title: string;
  thumbnail: string;
  // other properties can be added as needed
}

type RootStackParamList = {
  // other routes
  LevelStack: undefined;
};

type LevelContextType = {
  setSelectedLevel: (level: Level) => void;
};

const LevelContext = createContext<LevelContextType>({ setSelectedLevel: () => {} });


export default function Levels() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { setSelectedLevel } = useContext(LevelContext);
  const [levels, setLevels] = useState<Level[]>([]);

  useEffect(() => {
    // Load levels from the JSON file (assumed to be an array of level objects)
    setLevels(levelData.levels.map(level => ({
      id: level.id,
      title: level.name,
      thumbnail: level.thumbnail,
      // map other properties as needed
    })));
  }, []);

  const onSelectLevel = (level: Level) => {
    // Set the global level selection so that other screens can use it
    setSelectedLevel(level);
    // Navigate to the in-level tab navigator (registered as "LevelStack")
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
