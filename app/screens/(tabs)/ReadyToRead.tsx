import React, { useState, useEffect } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ThemedText } from '@/app/components/ThemedText';
import { TouchableOpacity } from 'react-native';
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';
import { levels } from '@/app/assets/data/levels';

type SentenceType = {
  sentence: string;
};

type ReadyToReadRouteParams = {
  params: {
    level: number;
  };
};

export default function ReadyToRead() {
  const route = useRoute<RouteProp<ReadyToReadRouteParams>>();
  const levelNumber = route.params?.level || 1; // Default to level 1

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [sentences, setSentences] = useState<SentenceType[]>([]);
  const [sentence, setSentence] = useState('');

  useEffect(() => {
    initializeReadyToRead();
  }, [levelNumber]);

  const initializeReadyToRead = async () => {
    try {
      const levelData: { id: string; words: { word: string; parts: string[], voiced: string[] }[]; sentences: string[] } | undefined = levels[levelNumber.toString()];
      setSentences(levelData?.sentences.map((sentence) => ({ sentence })));
      setSentence(levelData?.sentences[0] || '');
    } catch (error) {
      console.error('Error loading level data:', error);
    }
  };

  const handleSentenceClick = () => {
    const words = sentence.split(' ');
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      setCurrentWordIndex(0);
      if (currentSentenceIndex < sentences.length - 1) {
        setCurrentSentenceIndex(currentSentenceIndex + 1);
        setSentence(sentences[currentSentenceIndex + 1].sentence);
      } else {
        setCurrentSentenceIndex(0);
        setSentence(sentences[0].sentence);
      }
    }
  };

  return (
    <TouchableOpacity onPress={handleSentenceClick} style={styles.sentenceContainer}>
      <ThemedText style={{ fontSize: 24 }}>
        {sentence.split(' ').map((word, wordIndex) => (
          <ThemedText
            key={wordIndex}
            style={[
              styles.sentence,
              {
                fontWeight: wordIndex === currentWordIndex ? 'bold' : 'normal',
                fontSize: wordIndex === currentWordIndex ? 36 : 24, // Increase font size for the current word
              },
            ]}
          >
            {word}{' '}
          </ThemedText>
        ))}
      </ThemedText>
    </TouchableOpacity>
  );
}
