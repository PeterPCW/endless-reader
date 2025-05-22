import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';
import { levels } from '@/app/assets/data/levels';
import { LevelContext } from '@/app/screens/Levels'; 

type SentenceType = {
  sentence: string;
};

type ReadyToReadRouteParams = {
  params: {
    level: number;
  };
};

type WordType = {
  word: string;
  parts: string[];
  voiced: string[];
};

interface LevelData {
  id: string;
  words: WordType[];
  sentences: string[];
}

export default function ReadyToRead() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [sentences, setSentences] = useState<SentenceType[]>([]);
  const [sentence, setSentence] = useState('');
  const { selectedLevel } = useContext(LevelContext);

  useEffect(() => {
      if (selectedLevel) {
        initialize(selectedLevel.id);
      }
    }, [selectedLevel]);
  
    const initialize = async (levelId: string) => {
      try {
        const levelData: LevelData | undefined = levels[levelId];
        if (levelData) {
          setSentences(levelData?.sentences.map((sentence) => ({ sentence })));
          setSentence(levelData?.sentences[0] || '');
        } else {
          console.error(`Level data not found for id: ${levelId}`);
          setSentences([]);
          setSentence('');
        }
      } catch (error) {
        console.error('Error loading level data:', error);
        setSentences([]);
        setSentence('');
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
      <Text style={{ fontSize: 48 }}>
        {sentence.split(' ').map((word, wordIndex) => (
          <Text
            key={wordIndex}
            style={[
              styles.sentence,
              {
                fontSize: wordIndex === currentWordIndex ? 36 : 24
              },
            ]}
          >
            {word}{' '}
          </Text>
        ))}
      </Text>
    </TouchableOpacity>
  );
}
