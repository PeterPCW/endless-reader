import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const OBSTACLE_WIDTH = 100; // Match text width roughly
const OBSTACLE_HEIGHT = 100;
const BASE_SPAWN_DELAY = 2000; // Minimum spawn delay in ms
const RANDOM_EXTRA_DELAY = 2000; // Extra random delay in ms
const BASE_OBSTACLE_SPEED = 4; // Pixels per frame
const JUMP_HEIGHT = 200;
const GRAVITY = 5;
const GROUND_LEVEL = SCREEN_HEIGHT - 150;

// Load sprite sheet
const SPRITE_SHEET = require('@/app/assets/images/runner-sprite.png');
const FRAME_WIDTH = 100;
const FRAME_HEIGHT = 100;

// Animation frames
const RUN_FRAMES = [0, 1, 2]; // Running animation
const JUMP_FRAMES = [3, 4, 5]; // Jump start, mid-air, and landing

// Example word list
const wordList = ["Jump", "Run", "Dodge", "Hop", "Leap", "Skip", "Bound", "Avoid"];

export default function Game() {
  // Character movement
  const [runnerY, setRunnerY] = useState(GROUND_LEVEL);
  const [isJumping, setIsJumping] = useState(false);
  const wordClicked = useRef(false);
  const [frameIndex, setFrameIndex] = useState(0);

  // Obstacle movement
  const [obstacleX, setObstacleX] = useState<number | null>(null);
  const [isObstacleActive, setIsObstacleActive] = useState(false);
  const [currentWord, setCurrentWord] = useState<string>("CLICK ME");
  const [isGameOver, setIsGameOver] = useState(false);

  // Runner Animation
  useEffect(() => {
    let animInterval: NodeJS.Timeout;
    
    if (!isJumping) {
      animInterval = setInterval(() => {
        setFrameIndex(prev => (prev + 1) % RUN_FRAMES.length);
      }, 200);
    } else {
      setFrameIndex(JUMP_FRAMES[0]); // Set jump start frame
    }

    return () => clearInterval(animInterval);
  }, [isJumping]);

  // Handle Jumping
  useEffect(() => {
    if (isJumping) {
      let jumpInterval = setInterval(() => {
        setFrameIndex(JUMP_FRAMES[1]); // Mid-air frame
        setRunnerY(prevY => {
          if (prevY > GROUND_LEVEL - JUMP_HEIGHT) {
            return prevY - GRAVITY * 4; // Jump up
          } else {
            clearInterval(jumpInterval);
            let fallInterval = setInterval(() => {
              setRunnerY(prevY => {
                if (prevY < GROUND_LEVEL) {
                  return prevY + GRAVITY; // Fall down
                } else {
                  clearInterval(fallInterval);
                  setFrameIndex(JUMP_FRAMES[2]); // Landing frame
                  setTimeout(() => setIsJumping(false), 100);
                  return GROUND_LEVEL;
                }
              });
            }, 16);
            return prevY;
          }
        });
      }, 16);
    }
  }, [isJumping]);

  // Spawning Obstacles & Words
  useEffect(() => {
    let moveInterval: NodeJS.Timeout;
    let spawnTimeout: NodeJS.Timeout;
    let speed: number;

    const spawnObstacle = () => {
      setObstacleX(SCREEN_WIDTH);
      setIsObstacleActive(true);
      setCurrentWord(wordList[Math.floor(Math.random() * wordList.length)]);
      wordClicked.current = false; // Reset word click on new obstacle

      moveInterval = setInterval(() => {
        setObstacleX(prevX => {
          if (prevX === null) return null;
          if (prevX <= -OBSTACLE_WIDTH) {
            clearInterval(moveInterval);
            setIsObstacleActive(false);
            setObstacleX(null);
            setIsJumping(false);
            scheduleNextSpawn();
            return null;
          }
          const newX = prevX - speed;
          if (newX <= (100 + 30 * speed) && wordClicked.current) {
            handleJump();
          }
          return newX;
        });
      }, 16);
    };

    const scheduleNextSpawn = () => {
      const delay = BASE_SPAWN_DELAY + Math.random() * RANDOM_EXTRA_DELAY;
      speed = (1 + Math.random()) * BASE_OBSTACLE_SPEED;
      spawnTimeout = setTimeout(spawnObstacle, delay);
      wordClicked.current = false;
    };

    scheduleNextSpawn();

    return () => {
      clearInterval(moveInterval);
      clearTimeout(spawnTimeout);
    };
  }, []);

  const handleJump = () => {
    if (!isJumping && wordClicked.current) {
      setIsJumping(true);
    }
  };

  const handleWordClick = () => {
    wordClicked.current = true;
  };

  useEffect(() => {
    if (obstacleX !== null && obstacleX - 100 <= 0 && !isJumping) {
      setIsGameOver(true);
      Alert.alert('Game Over', 'You lost! Do you want to play again?', [
        { text: 'Yes', onPress: () => {
          setIsGameOver(false);
          setObstacleX(null);
          setIsObstacleActive(false);
          setRunnerY(GROUND_LEVEL);
          setIsJumping(false);
        } },
        { text: 'No', onPress: () => console.log('No') },
      ]);
    }
  }, [obstacleX, isJumping, isGameOver]);

  return (
    <View style={styles.gameContainer}>
      {/* Clickable word in the corner */}
      <TouchableOpacity onPress={handleWordClick} style={styles.wordContainer}>
        <Text style={styles.gameWord}>{currentWord}</Text>
      </TouchableOpacity>

      {/* Runner sprite using a sprite sheet. The style marginLeft simulates the cropping effect. */}
      <Image
        source={require('@/app/assets/images/character_sprite.png')}
        style={{
          position: "absolute",
          left: 100,
          top: runnerY,
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
          resizeMode: "cover",
          backgroundColor: "transparent",
          marginLeft: -frameIndex * FRAME_WIDTH,
        }}
      />

      {/* Obstacle (Word as Text) */}
      {isObstacleActive && obstacleX !== null && (
        <Text
          style={{
            position: 'absolute',
            left: obstacleX,
            bottom: 100,
            fontSize: 40,
            fontWeight: 'bold',
            color: 'red',
          }}>
          {currentWord}
        </Text>
      )}

      {isGameOver && <Text style={{ fontSize: 50, color: 'red' }}>Game Over</Text>}
    </View>
  );
};
