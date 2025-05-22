import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { levels, WordType } from '@/app/assets/data/levels';
import { LevelContext } from '@/app/screens/Levels';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CHARACTER_WIDTH = 60;
const PROJECTILE_SPEED = 50; // Reduced speed for smoother movement
const WORD_FONT_SIZE = 48;
const WORD_FALL_SPEED = 1;
const WORD_PADDING = 15;
const SPAWN_INTERVAL = 3000;

type Position = { x: number; y: number };
type FallingWord = WordType & Position & { speed: number };

export default function Invaders() {
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
  const [characterPos, setCharacterPos] = useState<number>(SCREEN_WIDTH / 2);
  const [projectiles, setProjectiles] = useState<Position[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [targetX, setTargetX] = useState<number | null>(null);
  const [words, setWords] = useState<WordType[]>([]);
  const { selectedLevel } = useContext(LevelContext);
  const animationFrameId = useRef<number>();
  const lastUpdateTime = useRef<number>(0);

  // Initialize words from selected level
  useEffect(() => {
    
    if (selectedLevel) {
      const levelData = levels[selectedLevel.id];

      if (levelData) {
        setWords(levelData.words);
        const cleanup = startSpawningWords();
        return () => {
          cleanup();
        };
      }
    } else {
      console.log('No level selected');
    }
  }, [selectedLevel]);

  // Spawn new words at intervals
  const wordsRef = useRef(words);
  wordsRef.current = words;

  const startSpawningWords = () => {
    const interval = setInterval(() => {
      const currentWords = wordsRef.current;
      
      if (currentWords.length > 0) {
        const randomWord = currentWords[Math.floor(Math.random() * currentWords.length)];
        
        setFallingWords(prev => {
          const newWord = {
            ...randomWord,
            x: Math.random() * (SCREEN_WIDTH - 100),
            y: 0,
            speed: 1 + Math.random() * WORD_FALL_SPEED
          };
          const newWords = [...prev, newWord];
          return newWords;
        });
      } else {
      }
    }, SPAWN_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  };

  // Move character toward target
  useEffect(() => {
    if (targetX === null) return;

    const moveInterval = setInterval(() => {
      setCharacterPos(prev => {
        const diff = targetX - prev;
        if (Math.abs(diff) < 70) {
          setIsMoving(false);
          setTargetX(null);
          fireProjectile(targetX + 70);
          return targetX + 70;
        }
        return prev + diff * 0.1;
      });
    }, 16);

    return () => clearInterval(moveInterval);
  }, [targetX]);

  // Update falling words positions
  useEffect(() => {
    const fallInterval = setInterval(() => {
      setFallingWords(prev => 
        prev.map(word => ({
          ...word,
          y: word.y + word.speed
        })).filter(word => word.y < SCREEN_HEIGHT - 100)
      );
    }, 16);

    return () => clearInterval(fallInterval);
  }, []);

  // Update projectile positions and check collisions
  useEffect(() => {
    const updateProjectiles = (timestamp: number) => {
      if (!lastUpdateTime.current) {
        lastUpdateTime.current = timestamp;
      }
      
      const deltaTime = timestamp - lastUpdateTime.current;
      lastUpdateTime.current = timestamp;

      setProjectiles(prev => {
        const newProjectiles = prev.map(p => ({
          ...p,
          y: p.y - (PROJECTILE_SPEED * deltaTime * 0.01) // Time-based movement
        })).filter(p => p.y > 0);

        // Check collisions
        const hitProjectiles = new Set<number>();
        const newFallingWords = fallingWords.filter((word, wordIndex) => {
          return !newProjectiles.some((proj, projIndex) => {
            const hit = (
              proj.x > word.x + 40 && 
              proj.x < word.x + 100 && 
              proj.y < word.y + 20 && 
              proj.y > word.y - 20
            );
            if (hit) {
              hitProjectiles.add(projIndex);
              setScore(s => s + 1);
            }
            return hit;
          });
        });
        
        setFallingWords(newFallingWords);
        return newProjectiles.filter((_, i) => !hitProjectiles.has(i));
      });

      animationFrameId.current = requestAnimationFrame(updateProjectiles);
    };

    animationFrameId.current = requestAnimationFrame(updateProjectiles);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [fallingWords]);

  const handleWordPress = (word: FallingWord) => {
    setTargetX(word.x);
    setIsMoving(true);
  };

  const fireProjectile = useCallback((pos: number) => {
    setProjectiles(prev => [...prev, {
      x: pos,
      y: SCREEN_HEIGHT * .9
    }]);
  }, [characterPos]);

  return (
    <View style={styles.container}>
      {/* Falling words */}
      {fallingWords.map((word, i) => (
        <TouchableOpacity 
          key={i}
          style={[styles.word, { left: word.x, top: word.y }]}
          onPress={() => handleWordPress(word)}
        >
          <Text style={styles.wordText}>{word.word}</Text>
        </TouchableOpacity>
      ))}

      {/* Projectiles */}
      {projectiles.map((proj, i) => (
        <View 
          key={i}
          style={[styles.projectile, { left: proj.x, top: proj.y }]}
        />
      ))}

      {/* Character */}
      <View style={[styles.character, { left: characterPos - CHARACTER_WIDTH/2 }]}>
        <Text style={styles.characterText}>^</Text>
      </View>

      <Text style={styles.score}>Score: {score}</Text>
      <View style={styles.debugPanel}>
        <Text style={styles.debugText}>Level: {selectedLevel?.id || 'none'}</Text>
        <Text style={styles.debugText}>Words: {words.length}</Text>
        <Text style={styles.debugText}>Falling: {fallingWords.length}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  word: {
    position: 'absolute',
    padding: WORD_PADDING,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 5,
    alignContent: 'center',
    justifyContent: 'center',
  },
  wordText: {
    fontSize: WORD_FONT_SIZE,
    fontWeight: 'bold',
    alignContent: 'center',
    justifyContent: 'center',
  },
  character: {
    position: 'absolute',
    bottom: 30,
    width: CHARACTER_WIDTH,
    height: 60,
    alignItems: 'center',
  },
  characterText: {
    fontSize: 30,
    color: '#fff',
  },
  projectile: {
    position: 'absolute',
    width: 5,
    height: 15,
    backgroundColor: 'yellow',
  },
  score: {
    position: 'absolute',
    top: 30,
    right: 20,
    color: '#fff',
    fontSize: 20,
  },
  debugPanel: {
    position: 'absolute',
    top: 30,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  debugText: {
    color: '#fff',
    fontSize: 14,
  },
});
