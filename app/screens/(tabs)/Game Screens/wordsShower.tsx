import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList} from 'react-native';
import { words, WordType } from '@/app/assets/data/words';
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';

export default function WordsShower() {
  const [allWords, setAllWords] = useState<WordType[]>([]);
  const [filteredWords, setFilteredWords] = useState<WordType[]>([]);
  const [level, setLevel] = useState<number>(1);
  const [filterEnabled, setFilterEnabled] = useState<boolean>(false);

  useEffect(() => {
    setAllWords(words.words);
    setFilteredWords(words.words);
  }, []);

  useEffect(() => {
    if (filterEnabled) {
      setFilteredWords(allWords.filter(word => word.level <= level));
    } else {
      setFilteredWords(allWords);
    }
  }, [level, filterEnabled, allWords]);

  const toggleFilter = () => {
    setFilterEnabled(!filterEnabled);
  };

  const renderWordItem = ({ item }: { item: WordType }) => (
    <View style={styles.wordItem}>
      <Text style={styles.wordsText}>{item.word}</Text>
      <Text style={styles.levelText}>Level: {item.level}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TextInput
          style={styles.levelInput}
          value={level.toString()}
          onChangeText={text => setLevel(Number(text) || 1)}
          keyboardType="numeric"
          placeholder="Enter level"
        />
        <TouchableOpacity
          style={[styles.filterButton, filterEnabled && styles.filterButtonActive]}
          onPress={toggleFilter}
        >
          <Text style={styles.filterButtonText}>
            {filterEnabled ? 'Disable Filter' : 'Enable Filter'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredWords}
        renderItem={renderWordItem}
        keyExtractor={(item) => item.word}
        contentContainerStyle={styles.listsContainer}
      />
    </View>
  );
}
