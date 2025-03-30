import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { levels, WordType } from '@/app/assets/data/levels';
import { LevelContext } from '@/app/screens/Levels';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CHARACTER_WIDTH = 60;
const PROJECTILE_SPEED = 10;
const WORD_FALL_SPEED = 2;
const SPAWN_INTERVAL = 2000;

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

  // Initialize words from selected level
  useEffect(() => {
    if (selectedLevel) {
      const levelData = levels[selectedLevel.id];
      if (levelData) {
        setWords(levelData.words);
        startSpawningWords();
      }
    }
  }, [selectedLevel]);

  // Spawn new words at intervals
  const startSpawningWords = () => {
    const interval = setInterval(() => {
      if (words.length > 0) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setFallingWords(prev => [...prev, {
          ...randomWord,
          x: Math.random() * (SCREEN_WIDTH - 100),
          y: 0,
          speed: 1 + Math.random() * WORD_FALL_SPEED
        }]);
      }
    }, SPAWN_INTERVAL);

    return () => clearInterval(interval);
  };

  // Move character toward target
  useEffect(() => {
    if (targetX === null) return;

    const moveInterval = setInterval(() => {
      setCharacterPos(prev => {
        const diff = targetX - prev;
        if (Math.abs(diff) < 5) {
          setIsMoving(false);
          setTargetX(null);
          fireProjectile();
          return targetX;
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
    const projectileInterval = setInterval(() => {
      setProjectiles(prev => {
        const newProjectiles = prev.map(p => ({
          ...p,
          y: p.y - PROJECTILE_SPEED
        })).filter(p => p.y > 0);

        // Check collisions
        setFallingWords(prevWords => {
          return prevWords.filter(word => {
            return !newProjectiles.some(proj => {
              const hit = (
                proj.x > word.x - 30 && 
                proj.x < word.x + 30 && 
                proj.y < word.y + 20 && 
                proj.y > word.y - 20
              );
              if (hit) setScore(s => s + 1);
              return hit;
            });
          });
        });

        return newProjectiles;
      });
    }, 16);

    return () => clearInterval(projectileInterval);
  }, []);

  const handleWordPress = (word: FallingWord) => {
    setTargetX(word.x);
    setIsMoving(true);
  };

  const fireProjectile = () => {
    setProjectiles(prev => [...prev, {
      x: characterPos,
      y: SCREEN_HEIGHT - 100
    }]);
  };

  return (
    <View style={styles.container}>
      {/* Space background would go here */}
      
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
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 5,
  },
  wordText: {
    fontSize: 18,
    fontWeight: 'bold',
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
});
