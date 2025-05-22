import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { levels, WordType } from '@/app/assets/data/levels';
import { LevelContext } from '@/app/screens/Levels';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CHARACTER_WIDTH = 60;
const BUILDING_WIDTH = 100;
const BUILDING_HEIGHT = 150;
const BASE_SPEED = 2;
const FAST_SPEED = 5;
const ATTACK_THRESHOLD = 3; // Speed up when queue reaches this size

type Building = {
  id: string;
  word: string;
  x: number;
  health: number;
  damageState: number;
};

export default function Rampage() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [characterX, setCharacterX] = useState(0);
  const [isMovingRight, setIsMovingRight] = useState(true);
  const [isJumping, setIsJumping] = useState(false);
  const [attackQueue, setAttackQueue] = useState<string[]>([]);
  const [speed, setSpeed] = useState(BASE_SPEED);
  const [gameComplete, setGameComplete] = useState(false);
  const [words, setWords] = useState<WordType[]>([]);
  const { selectedLevel } = useContext(LevelContext);

  // Initialize buildings from selected level
  useEffect(() => {
    if (selectedLevel) {
      const levelData = levels[selectedLevel.id];
      if (levelData) {
        setWords(levelData.words);
        initializeBuildings(levelData.words);
      }
    }
  }, [selectedLevel]);

  const initializeBuildings = (words: WordType[]) => {
    const buildingCount = words.length;
    const newBuildings = Array.from({ length: buildingCount }, (_, i) => ({
      id: `building-${i}`,
      word: words[i].word,
      x: (i + 1) * (SCREEN_WIDTH / (buildingCount + 1)) - BUILDING_WIDTH/2,
      health: 3,
      damageState: 0
    }));
    setBuildings(newBuildings);
    setGameComplete(false);
  };

  // Character movement
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setCharacterX(prev => {
        let newX = prev + (isMovingRight ? speed : -speed);
        
        // Reverse direction at screen edges
        if (newX > SCREEN_WIDTH - CHARACTER_WIDTH) {
          setIsMovingRight(false);
          return SCREEN_WIDTH - CHARACTER_WIDTH;
        } else if (newX < 0) {
          setIsMovingRight(true);
          return 0;
        }
        
        // Check for attack alignment
        if (!isJumping && attackQueue.length > 0) {
          const targetBuilding = buildings.find(b => b.id === attackQueue[0]);
          if (targetBuilding && Math.abs(newX - targetBuilding.x) < 5) {
            attackBuilding(targetBuilding.id);
            return prev; // Pause movement during attack
          }
        }
        
        return newX;
      });
    }, 16);

    return () => clearInterval(moveInterval);
  }, [isMovingRight, speed, isJumping, attackQueue, buildings]);

  // Adjust speed based on queue size
  useEffect(() => {
    setSpeed(attackQueue.length >= ATTACK_THRESHOLD ? FAST_SPEED : BASE_SPEED);
  }, [attackQueue.length]);

  const attackBuilding = (buildingId: string) => {
    setIsJumping(true);
    
    // Attack animation
    setTimeout(() => {
      setIsJumping(false);
      applyDamage(buildingId);
      
      // Remove from queue after attack
      setAttackQueue(prev => prev.filter(id => id !== buildingId));
    }, 500);
  };

  const applyDamage = (buildingId: string) => {
    setBuildings(prev => {
      const newBuildings = prev.map(building => {
        if (building.id === buildingId) {
          const newHealth = building.health - 1;
          return {
            ...building,
            health: newHealth,
            damageState: 3 - newHealth // 0=healthy, 1=damaged, 2=very damaged
          };
        }
        return building;
      }).filter(b => b.health > 0);
      
      // Check for game completion
      if (newBuildings.length === 0) {
        setGameComplete(true);
      }
      
      return newBuildings;
    });
  };

  const handleBuildingClick = (buildingId: string) => {
    if (!attackQueue.includes(buildingId)) {
      setAttackQueue(prev => [...prev, buildingId]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background would go here */}
      
      {/* Buildings */}
      {buildings.map(building => (
        <TouchableOpacity 
          key={building.id}
          style={[
            styles.building, 
            { 
              left: building.x,
              opacity: 1 - (building.damageState * 0.2) // Visual damage indicator
            }
          ]}
          onPress={() => handleBuildingClick(building.id)}
        >
          <Text style={styles.buildingWord}>{building.word}</Text>
          <View style={[
            styles.healthBar,
            { width: `${(building.health / 3) * 100}%` }
          ]} />
        </TouchableOpacity>
      ))}
      
      {/* Character */}
      <View style={[
        styles.character, 
        { 
          left: characterX,
          transform: [{ scaleY: isJumping ? 0.8 : 1 }] // Simple jump effect
        }
      ]}>
        <Text style={styles.characterText}>
          {isJumping ? '^' : isMovingRight ? '>' : '<'}
        </Text>
      </View>
      
      {/* Attack Queue */}
      <View style={styles.queueContainer}>
        {attackQueue.map((id, index) => (
          <View key={index} style={styles.queueItem} />
        ))}
      </View>
      
      {/* Game Complete Overlay */}
      {gameComplete && (
        <View style={styles.completeOverlay}>
          <Text style={styles.completeText}>Level Complete!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
  },
  building: {
    position: 'absolute',
    bottom: 50,
    width: BUILDING_WIDTH,
    height: BUILDING_HEIGHT,
    backgroundColor: '#888',
    alignItems: 'center',
    paddingTop: 10,
    borderWidth: 2,
    borderColor: '#555',
  },
  buildingWord: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  healthBar: {
    position: 'absolute',
    bottom: 0,
    height: 5,
    backgroundColor: 'red',
  },
  character: {
    position: 'absolute',
    bottom: 50 + BUILDING_HEIGHT,
    width: CHARACTER_WIDTH,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  queueContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
  },
  queueItem: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    marginLeft: 2,
  },
  completeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
});
