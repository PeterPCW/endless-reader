import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_HEIGHT = 50;
const BASE_SPAWN_DELAY = 2000; // Minimum spawn delay in ms
const RANDOM_EXTRA_DELAY = 2000; // Extra random delay in ms
const BASE_OBSTACLE_SPEED = 4; // Pixels per frame
const JUMP_HEIGHT = 200;
const GRAVITY = 5;
const GROUND_LEVEL = SCREEN_HEIGHT - 150;

// Example word list
const wordList = ["Jump", "Run", "Dodge", "Hop", "Leap", "Skip", "Bound", "Avoid"];

export default function Game() {
  // Character movement
  const [runnerY, setRunnerY] = useState(GROUND_LEVEL);
  const [isJumping, setIsJumping] = useState(false);
  const wordClicked = useRef(false);

  // Obstacle movement
  const [obstacleX, setObstacleX] = useState<number | null>(null);
  const [isObstacleActive, setIsObstacleActive] = useState(false);
  const [currentWord, setCurrentWord] = useState<string>("CLICK ME");
  const [isGameOver, setIsGameOver] = useState(false);

  // Handle Jumping
  useEffect(() => {
    if (isJumping) {
      let jumpInterval = setInterval(() => {
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
          const newX = prevX - speed
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
  }

  useEffect(() => {
    if (obstacleX !== null && obstacleX - (styles.runner.left + styles.runner.width) <= 0 && !isJumping) {
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

      {/* Runner (Character) */}
      <View style={[styles.runner, { top: runnerY }]} />

      {/* Obstacle (Only Render if Active) */}
      {isObstacleActive && obstacleX !== null && (
        <View style={[styles.obstacle, { left: obstacleX }]} />
      )}
      {isGameOver && <Text style={{ fontSize: 50, color: 'red' }}>Game Over</Text>}
    </View>
  );
};
