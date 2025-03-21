import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const WORD_WIDTH = 100;
const WORD_HEIGHT = 100;
const BASE_SPAWN_DELAY = 2000;
const RANDOM_EXTRA_DELAY = 2000;
const BASE_WORD_SPEED = 4;
const JUMP_HEIGHT = 300;
const GRAVITY = 5;
const GROUND_LEVEL = SCREEN_HEIGHT * .75;

const SPRITE_SHEET = require('@/app/assets/images/runner-sprite.png');
const FRAME_WIDTH = 100;
const FRAME_HEIGHT = 100;

const RUN_FRAMES = [0, 1, 2];
const JUMP_FRAMES = [3, 4];
const SPEED_CHANGE_FRAME = 5;

const BACKGROUND_IMAGE = require('@/app/assets/images/background.png');
const FOREGROUND_IMAGE = require('@/app/assets/images/foreground.png');

const wordList = ["Jump", "Run", "Dodge", "Hop", "Leap", "Skip", "Bound", "Avoid"];

export default function Game() {
  const [runnerY, setRunnerY] = useState(GROUND_LEVEL);
  const [isJumping, setIsJumping] = useState(false);
  const wordClicked = useRef(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [wordX, setWordX] = useState<number | null>(null);
  const [isWordActive, setIsWordActive] = useState(false);
  const [currentWord, setCurrentWord] = useState<string>("CLICK ME");
  const [score, setScore] = useState(0);
  const [backgroundX, setBackgroundX] = useState(0);
  const [foregroundX, setForegroundX] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(BASE_WORD_SPEED);
  const [speedChanging, setSpeedChanging] = useState(false);

  useEffect(() => {
    let animInterval: NodeJS.Timeout;
    if (!isJumping && !speedChanging) {
      animInterval = setInterval(() => {
        setFrameIndex(prev => (prev + 1) % RUN_FRAMES.length);
      }, 200);
    } else if (speedChanging) {
      setFrameIndex(SPEED_CHANGE_FRAME);
      setTimeout(() => setSpeedChanging(false), 200);
    } else {
      setFrameIndex(JUMP_FRAMES[0]);
    }
    return () => clearInterval(animInterval);
  }, [isJumping, speedChanging]);

  useEffect(() => {
    if (isJumping) {
      let jumpInterval = setInterval(() => {
        setFrameIndex(JUMP_FRAMES[1]);
        setRunnerY(prevY => {
          if (prevY > GROUND_LEVEL - JUMP_HEIGHT) {
            return prevY - GRAVITY * 4;
          } else {
            clearInterval(jumpInterval);
            let fallInterval = setInterval(() => {
              setRunnerY(prevY => {
                if (prevY < GROUND_LEVEL) {
                  return prevY + GRAVITY;
                } else {
                  clearInterval(fallInterval);
                  setFrameIndex(JUMP_FRAMES[0]);
                  setScore(prevScore => prevScore + 1);
                  setTimeout(() => setIsJumping(false), 1000);
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

  useEffect(() => {
    let moveInterval: NodeJS.Timeout;
    let spawnTimeout: NodeJS.Timeout;
    let speed: number;

    const spawnWord = () => {
      setWordX(SCREEN_WIDTH);
      setIsWordActive(true);
      setCurrentWord(wordList[Math.floor(Math.random() * wordList.length)]);
      wordClicked.current = false;
      speed = (1 + Math.random()) * BASE_WORD_SPEED;
      setGameSpeed(speed);
      setSpeedChanging(true);

      moveInterval = setInterval(() => {
        setWordX(prevX => {
          if (prevX === null) return null;
          if (prevX <= -WORD_WIDTH) {
            clearInterval(moveInterval);
            setIsWordActive(false);
            setWordX(null);
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
      spawnTimeout = setTimeout(spawnWord, delay);
      wordClicked.current = false;
    };

    scheduleNextSpawn();

    return () => {
      clearInterval(moveInterval);
      clearTimeout(spawnTimeout);
    };
  }, []);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setBackgroundX(prevX => (prevX - 1) % SCREEN_WIDTH);
      setForegroundX(prevX => (prevX - gameSpeed) % (SCREEN_WIDTH * 10));
    }, 16);
    return () => clearInterval(bgInterval);
  }, [gameSpeed]);

  
  const handleJump = () => {
    if (!isJumping && wordClicked.current) {
      setIsJumping(true);
    }
  };
  const handleWordClick = () => {
    wordClicked.current = true;
  };

  return (
    <View style={styles.gameContainer}>
      <Image source={BACKGROUND_IMAGE} style={[styles.background, { left: backgroundX, width: SCREEN_WIDTH * 2, height: SCREEN_HEIGHT}]} />
      <Image source={FOREGROUND_IMAGE} style={[styles.background, { left: foregroundX, width: SCREEN_WIDTH * 10, height: SCREEN_HEIGHT / 2}]} />
      <TouchableOpacity onPress={handleWordClick} style={styles.wordContainer}>
        <Text style={styles.gameWord}>{currentWord}</Text>
      </TouchableOpacity>
      <View
        style={[styles.character, {
          top: runnerY,
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
        }]}
      >
        <Image
          source={SPRITE_SHEET}
          style={{
            width: FRAME_WIDTH * 6, // Full width of the sprite sheet
            height: FRAME_HEIGHT,
            resizeMode: "cover",
            transform: [{ translateX: -frameIndex * FRAME_WIDTH }], // Shift sprite sheet left
          }}
        />
      </View>
      
      {/* Word (Word as Text) */}
      {isWordActive && wordX !== null && (
        <Text
          style={[styles.movingWord, {left: wordX, top: JUMP_HEIGHT + SCREEN_HEIGHT - GROUND_LEVEL }]}>
          {currentWord}
        </Text>
      )}
      <Text style={styles.score}>Score: {score}</Text>
    </View>
  );
};
