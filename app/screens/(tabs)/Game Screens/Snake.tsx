import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { levels, WordType } from '@/app/assets/data/levels';
import { LevelContext } from '@/app/screens/Levels';

const GRID_SIZE = 6;
const CELL_SIZE = Dimensions.get('window').width / GRID_SIZE;
const MOVE_INTERVAL = 300; // ms between moves
const WORD_TIMEOUT = 5000; // ms before timeout

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export default function Snake() {
  const [snakePos, setSnakePos] = useState<Position>({ x: 3, y: 3 });
  const [foodPos, setFoodPos] = useState<Position>({ x: 5, y: 0 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [currentWord, setCurrentWord] = useState<string>('Start');
  const [moveQueue, setMoveQueue] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameState, setGameState] = useState<'WAITING' | 'MOVING' | 'TIMEOUT'>('WAITING');
  const [words, setWords] = useState<WordType[]>([]);
  const { selectedLevel } = useContext(LevelContext);

  // Initialize words from selected level
  useEffect(() => {
    if (selectedLevel) {
      const levelData = levels[selectedLevel.id];
      if (levelData) {
        setWords(levelData.words);
        if (currentWord === 'Start') {
          spawnNewWord();
        }
      }
    }
  }, [selectedLevel]);

  // Game loop for movement
  useEffect(() => {
    if (gameState !== 'MOVING') return;

    const moveInterval = setInterval(() => {
      if (moveQueue > 0) {
        moveSnake();
        setMoveQueue(prev => prev - 1);
      } else {
        setGameState('WAITING');
        spawnNewWord();
        clearInterval(moveInterval);
      }
    }, MOVE_INTERVAL);

    return () => clearInterval(moveInterval);
  }, [gameState, moveQueue, snakePos]);

  // Word timeout handler
  useEffect(() => {
    if (gameState !== 'WAITING') return;

    const timeout = setTimeout(() => {
      setGameState('TIMEOUT');
      setMoveQueue(1); // Single move on timeout
    }, WORD_TIMEOUT);

    return () => clearTimeout(timeout);
  }, [gameState, currentWord]);

  const spawnNewWord = () => {
    if (words.length === 0) return;
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord.word);
  };

  const spawnNewFood = () => {
    setFoodPos({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    });
  };

  const moveSnake = () => {
    const newPos = calculateNextMove();
    setSnakePos(newPos);

    // Check if snake reached food
    if (newPos.x === foodPos.x && newPos.y === foodPos.y) {
      setScore(prev => prev + 1);
      spawnNewFood();
    }
  };

  const calculateNextMove = (): Position => {
    // Simple greedy pathfinding - move toward food
    const dx = foodPos.x - snakePos.x;
    const dy = foodPos.y - snakePos.y;

    // Prefer current direction when possible
    if (direction === 'RIGHT' && dx > 0) return { x: snakePos.x + 1, y: snakePos.y };
    if (direction === 'LEFT' && dx < 0) return { x: snakePos.x - 1, y: snakePos.y };
    if (direction === 'UP' && dy < 0) return { x: snakePos.x, y: snakePos.y - 1 };
    if (direction === 'DOWN' && dy > 0) return { x: snakePos.x, y: snakePos.y + 1 };

    // Otherwise pick best available move
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        setDirection('RIGHT');
        return { x: snakePos.x + 1, y: snakePos.y }
      } else {
        setDirection('LEFT');
        return { x: snakePos.x - 1, y: snakePos.y }
      }
    } else {
      if (dy < 0) {
        setDirection('UP');
        return { x: snakePos.x, y: snakePos.y - 1 }
      } else { 
        setDirection('DOWN');
        return { x: snakePos.x, y: snakePos.y + 1 }
      }
    }
  };

  const handleWordClick = () => {
    if (gameState !== 'WAITING') return;
    
    // Handle initial "Start" click
    if (currentWord === 'Start') {
      spawnNewWord();
      return;
    }
    
    // Count syllables (using parts length as proxy)
    const currentWordData = words.find(w => w.word === currentWord);
    const syllables = currentWordData?.syllables || 1;
    
    setMoveQueue(syllables);
    setGameState('MOVING');
  };

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnake = snakePos.x === x && snakePos.y === y;
        const isFood = foodPos.x === x && foodPos.y === y;
        
        grid.push(
          <View 
            key={`${x}-${y}`}
            style={[
              styles.cell,
              isSnake && styles.snakeCell,
              isFood && styles.foodCell,
              {
                left: x * CELL_SIZE,
                top: y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }
            ]}
          />
        );
      }
    }
    return grid;
  };

  return (
    <View style={styles.gameContainer}>
      <View style={styles.gridContainer}>
        {renderGrid()}
      </View>
      
      <TouchableOpacity onPress={handleWordClick} style={styles.wordContainer}>
        <Text style={styles.gameWord}>{currentWord}</Text>
      </TouchableOpacity>
      
      <Text style={styles.score}>Score: {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    position: 'relative',
  },
  cell: {
    position: 'absolute',
    backgroundColor: '#ddd',
    borderWidth: 1,
    borderColor: '#fff',
  },
  snakeCell: {
    backgroundColor: 'green',
  },
  foodCell: {
    backgroundColor: 'red',
    borderRadius: CELL_SIZE / 2,
  },
  wordContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  gameWord: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 20,
    marginTop: 10,
  },
});
