import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Canvas } from '../../client/src/components/game/Canvas';

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
  const [gameRunning, setGameRunning] = useState(false);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    console.log('GameScreen - Initializing');
    initializeGame();
    return () => {
      console.log('GameScreen - Cleanup');
    };
  }, []);

  const initializeGame = async () => {
    try {
      const levelData = require('../../assets/data/words.json');
      const gameWords: GameWord[] = levelData.levels[0].words.map(word => ({
        ...word,
        completed: false
      }));
      setWords(gameWords);
      await loadScore();
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

  const handleGameStart = () => {
    setGameRunning(true);
    loadNextWord();
  };

  const handleCollision = () => {
    setGameRunning(false);
    setFeedback('incorrect');
    shakeAnimation();
    setTimeout(() => {
      setShowResults(true);
    }, 1000);
  };

  const handleObstacleClear = () => {
    const newScore = score + 1;
    setScore(newScore);
    setStreak(streak + 1);
    setFeedback('correct');
    saveScore(newScore);
    loadNextWord();
  };

  const resetGame = () => {
    setGameStats({ correct: 0, total: 0 });
    setShowResults(false);
    setStreak(0);
    setWords(prev => prev.map(w => ({ ...w, completed: false })));
    setGameRunning(false);
    setScore(0); // Reset score
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
        <Text style={styles.title}>Game Over!</Text>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultText}>Score: {score}</Text>
          <Text style={styles.resultText}>
            Obstacles Cleared: {score}
          </Text>
          <Text style={styles.streakText}>Best Streak: {streak}</Text>
        </View>
        <TouchableOpacity style={styles.playAgainButton} onPress={resetGame}>
          <Text style={styles.playAgainText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!gameRunning) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Word Runner</Text>
        <TouchableOpacity style={styles.startButton} onPress={handleGameStart}>
          <Text style={styles.startButtonText}>Start Game</Text>
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
        <View style={styles.wordContainer}>
          <Text style={styles.wordText}>{currentWord.word}</Text>
        </View>
      )}
      <Canvas
        width={width}
        height={height * 0.6}
        onCollision={handleCollision}
        onClear={handleObstacleClear}
      />
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
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
    zIndex: 1,
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
  startButton: {
    backgroundColor: '#6366f1',
    padding: 20,
    borderRadius: 10,
    marginTop: 40,
  },
  startButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});