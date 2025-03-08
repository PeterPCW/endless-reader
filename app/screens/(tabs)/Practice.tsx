import { View, Text, TouchableOpacity, FlatList, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WordPractice from '@/app/components/WordPractice';

type WordType = {
  word: string;
  syllables: [string];
};

export default function Practice() {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [words, setWords] = useState<WordType[]>([]);

  useEffect(() => {
    console.log('PracticeScreen - Initializing');
    initializePractice();
    return () => {
      console.log('PracticeScreen - Cleanup');
    };
  }, []);

  const initializePractice = async () => {
    try {
      console.log('PracticeScreen - Loading words from assets');
      const levelData = require('../../assets/data/words.json');
      setWords(levelData.levels[0].words);

      // Load progress from storage
      const savedProgress = await AsyncStorage.getItem('@word_progress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
        console.log('PracticeScreen - Loaded progress:', savedProgress);
      }
    } catch (error) {
      console.error('PracticeScreen - Error initializing:', error);
    }
  };

  const renderWord = ({ item }: { item: WordType }) => {
    const timesPressed = progress[item.word] || 0;
    const opacity = new Animated.Value(timesPressed > 0 ? 0.6 : 1);

    return (
      <TouchableOpacity 
        style={[styles.wordCard, styles.selectedCard]}
        onPress={() => <WordPractice visible={true} word={item.word} onClose={() => {}} />}
      >  
        <Text style={styles.wordText}>{item.word}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.practiceContainer}>
      <Text style={styles.title}>Practice Words</Text>
      <FlatList
        data={words}
        renderItem={renderWord}
        keyExtractor={item => item.word}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}
