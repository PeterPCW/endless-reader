import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type WordType = {
  id: string;
  word: string;
  dots: number;
  audioFile: string;
};

type GameWord = WordType & {
  completed: boolean;
};

export default function GameScreen() {
  const [currentWord, setCurrentWord] = useState<GameWord | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shake] = useState(new Animated.Value(0));
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [gameStats, setGameStats] = useState({
    correct: 0,
    total: 0,
  });
  const [words, setWords] = useState<GameWord[]>([]);

  useEffect(() => {
    console.log('GameScreen - Initializing');
    initializeGame();
    return () => {
      console.log('GameScreen - Cleanup');
    };
  }, []);

  const initializeGame = async () => {
    try {
      // Load words from assets
      const levelData = require('../../assets/data/words.json');
      const gameWords: GameWord[] = levelData.levels[0].words.map(word => ({
        ...word,
        completed: false
      }));
      setWords(gameWords);
      await loadScore();
      loadNextWord();
    } catch (error) {
      console.error('GameScreen - Error initializing game:', error);
    }
  };

  const loadScore = async () => {
    try {
      console.log('GameScreen - Loading score from storage');
      const savedScore = await AsyncStorage.getItem('@game_score');
      if (savedScore) {
        const parsedScore = parseInt(savedScore);
        console.log('GameScreen - Loaded score:', parsedScore);
        setScore(parsedScore);
      }
    } catch (error) {
      console.error('GameScreen - Error loading score:', error);
    }
  };

  const saveScore = async (newScore: number) => {
    try {
      console.log('GameScreen - Saving score:', newScore);
      await AsyncStorage.setItem('@game_score', newScore.toString());
    } catch (error) {
      console.error('GameScreen - Error saving score:', error);
    }
  };

  const loadNextWord = () => {
    // Filter out completed words and get a random one
    const availableWords = words.filter(w => !w.completed);
    if (availableWords.length === 0) {
      setShowResults(true);
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const word = availableWords[randomIndex];
    console.log('GameScreen - Loading next word:', word.word);
    setCurrentWord(word);
    setFeedback(null);
  };

  const handleWordPress = async () => {
    if (!currentWord) return;

    // Simulate correct answer for now - will be replaced with actual logic
    const isCorrect = Math.random() > 0.3; // 70% chance of correct for testing
    if (isCorrect) {
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      await saveScore(newScore);
      setFeedback('correct');
      setGameStats(prev => ({
        correct: prev.correct + 1,
        total: prev.total + 1,
      }));

      // Mark word as completed
      setWords(prev =>
        prev.map(w =>
          w.id === currentWord.id ? { ...w, completed: true } : w
        )
      );

      console.log('GameScreen - Correct answer:', {
        word: currentWord.word,
        newScore,
        newStreak,
        remainingWords: words.filter(w => !w.completed).length
      });
    } else {
      shakeAnimation();
      setStreak(0);
      setFeedback('incorrect');
      setGameStats(prev => ({
        ...prev,
        total: prev.total + 1,
      }));
      console.log('GameScreen - Incorrect answer:', {
        word: currentWord.word,
        resetStreak: true,
        remainingWords: words.filter(w => !w.completed).length
      });
    }

    // Load next word after a delay
    setTimeout(loadNextWord, 1000);
  };

  const resetGame = () => {
    setGameStats({ correct: 0, total: 0 });
    setShowResults(false);
    setStreak(0);
    setWords(prev => prev.map(w => ({ ...w, completed: false })));
    loadNextWord();
  };

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shake, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (showResults) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Round Complete!</Text>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultText}>Score: {score}</Text>
          <Text style={styles.resultText}>
            Accuracy: {Math.round((gameStats.correct / gameStats.total) * 100)}%
          </Text>
          <Text style={styles.streakText}>Best Streak: {streak}</Text>
        </View>
        <TouchableOpacity style={styles.playAgainButton} onPress={resetGame}>
          <Text style={styles.playAgainText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.streakText}>Streak: {streak}</Text>
      </View>
      {currentWord && (
        <>
          <Animated.View
            style={[
              styles.wordContainer,
              {
                transform: [{ translateX: shake }],
                backgroundColor: feedback === 'correct' ? '#dcfce7' :
                  feedback === 'incorrect' ? '#fee2e2' :
                    '#f3f4f6'
              },
            ]}
          >
            <TouchableOpacity onPress={handleWordPress}>
              <Text style={styles.wordText}>{currentWord.word}</Text>
            </TouchableOpacity>
            <View style={styles.dotContainer}>
              {[...Array(currentWord.dots)].map((_, i) => (
                <View
                  key={i}
                  style={styles.dot}
                />
              ))}
            </View>
          </Animated.View>
          <TouchableOpacity
            style={styles.audioButton}
            onPress={() => console.log('GameScreen - Audio button pressed')}
          >
            <MaterialCommunityIcons name="volume-high" size={24} color="#6366f1" />
          </TouchableOpacity>
        </>
      )}
      {feedback && (
        <Text style={[
          styles.feedbackText,
          feedback === 'correct' ? styles.correctText : styles.incorrectText
        ]}>
          {feedback === 'correct' ? 'Correct!' : 'Try Again!'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  scoreText: {
    fontSize: 24,
  },
  streakText: {
    fontSize: 24,
    color: '#6366f1',
  },
  wordContainer: {
    padding: 20,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center'
  },
  wordText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  dotContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#6366f1',
    borderRadius: 5,
  },
  audioButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e0e7ff',
    borderRadius: 25,
  },
  feedbackText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  correctText: {
    color: '#059669',
  },
  incorrectText: {
    color: '#dc2626',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultsContainer: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  resultText: {
    fontSize: 24,
    marginVertical: 10,
  },
  playAgainButton: {
    backgroundColor: '#6366f1',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  playAgainText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});