import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WordPractice from '@/app/components/WordPractice';

type WordType = {
  word: string;
  syllables: [string];
};

export default function Practice() {
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
      const levelData = require('../../assets/data/level1.json');
      setWords(levelData.levels[0].words);

    } catch (error) {
      console.error('PracticeScreen - Error initializing:', error);
    }
  };

  const renderWord = ({ item }: { item: WordType }) => {
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
