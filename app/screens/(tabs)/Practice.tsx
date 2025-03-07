import { View, Text, TouchableOpacity, StyleSheet, FlatList, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WordType = {
  id: string;
  word: string;
  dots: number;
  audioFile: string;
};

export default function PracticeScreen() {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
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

  const handleWordSelect = async (word: string) => {
    console.log('PracticeScreen - Word selected:', word);
    setSelectedWord(word);

    const newProgress = {
      ...progress,
      [word]: (progress[word] || 0) + 1
    };
    setProgress(newProgress);

    try {
      await AsyncStorage.setItem('@word_progress', JSON.stringify(newProgress));
      console.log('PracticeScreen - Progress saved:', {
        word,
        attempts: newProgress[word],
        totalProgress: Object.keys(newProgress).length
      });
    } catch (error) {
      console.error('PracticeScreen - Error saving progress:', error);
    }
  };

  const renderWord = ({ item }: { item: WordType }) => {
    const timesPressed = progress[item.word] || 0;
    const opacity = new Animated.Value(timesPressed > 0 ? 0.6 : 1);

    console.log('PracticeScreen - Rendering word:', {
      word: item.word,
      attempts: timesPressed
    });

    return (
      <TouchableOpacity 
        style={[styles.wordCard, selectedWord === item.word && styles.selectedCard]}
        onPress={() => handleWordSelect(item.word)}
      >
        <Text style={styles.wordText}>{item.word}</Text>
        <View style={styles.dotContainer}>
          {[...Array(item.dots)].map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.dot,
                i < timesPressed && styles.completedDot
              ]} 
            />
          ))}
        </View>
        <TouchableOpacity 
          style={styles.audioButton}
          onPress={() => console.log('PracticeScreen - Audio button pressed for word:', item.word)}
        >
          <MaterialCommunityIcons name="volume-high" size={24} color="#6366f1" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice Words</Text>
      <FlatList
        data={words}
        renderItem={renderWord}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        onScrollBeginDrag={() => console.log('PracticeScreen - List scroll started')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    gap: 15,
  },
  wordCard: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: '#e0e7ff',
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  wordText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  dotContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#d1d5db',
    borderRadius: 5,
  },
  completedDot: {
    backgroundColor: '#6366f1',
  },
  audioButton: {
    padding: 10,
    backgroundColor: '#e0e7ff',
    borderRadius: 25,
  },
});