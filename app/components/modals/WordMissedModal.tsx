import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WordType } from '@/app/assets/data/words';
import { words } from '@/app/assets/data/words'; 
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';

interface WordMissedModalProps {
  visible: boolean;
  word: string;
  onContinue: () => void;
}

export default function WordMissedModal({
  visible,
  word,
  onContinue
}: WordMissedModalProps) {
  if (!visible) return null;

  const [foundWord, setFoundWord] = useState<WordType | null>(null);

  useEffect(() => {
    setFoundWord(words.words.find((w: WordType) => w.word === word) || null);
  }, [word]);

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Word Missed!</Text>
        
        <View style={styles.wordContainer}>
          {foundWord ? (
            <>
              <Text style={styles.wordText}>{foundWord.word}</Text>
              <Text style={styles.detailText}>Level: {foundWord.level}</Text>
            </>
          ) : (
            <Text style={styles.detailText}>Word not found</Text>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={onContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
