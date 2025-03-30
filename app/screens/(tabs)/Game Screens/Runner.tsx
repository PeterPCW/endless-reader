import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';
import { levels } from '@/app/assets/data/levels';
import { LevelContext } from '@/app/screens/Levels'; 

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
const SPEED_CHANGE = require('@/app/assets/images/speed-effect.png')
const FRAME_WIDTH = 150;
const FRAME_HEIGHT = 150;

const RUN_FRAMES = [0, 1, 2, 3];
const JUMP_FRAME = 3;

const BACKGROUND_IMAGE = require('@/app/assets/images/background.png');
const FOREGROUND_IMAGE = require('@/app/assets/images/foreground.png');

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

export default function Runner() {
  const [runnerY, setRunnerY] = useState(GROUND_LEVEL);
  const [isJumping, setIsJumping] = useState(false);
  const wordClicked = useRef(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [wordX, setWordX] = useState<number | null>(null);
  const [isWordActive, setIsWordActive] = useState(false);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [score, setScore] = useState(0);
  const [backgroundX, setBackgroundX] = useState(0);
  const [foregroundX, setForegroundX] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(BASE_WORD_SPEED);
  const [speedChanging, setSpeedChanging] = useState(false);
  const [words, setWords] = useState<WordType[]>([]);
  const { selectedLevel } = useContext(LevelContext);

  useEffect(() => {
    if (selectedLevel) {
      initialize(selectedLevel.id); // Ensure selectedLevel.id is used correctly
    }
  }, [selectedLevel]);

  const initialize = async (levelId: string) => {
    try {
      const levelData: LevelData | undefined = levels[levelId]; // Ensure levels[levelId] exists
      if (levelData) {
        setWords(levelData.words || []); // Set words from the level data
      } else {
        console.error(`Level data not found for id: ${levelId}`);
        setWords([]);
      }
    } catch (error) {
      console.error('Error loading level data:', error);
      setWords([]);
    }
  };

  useEffect(() => {
    let animInterval: NodeJS.Timeout;
    if (!isJumping) {
      animInterval = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % RUN_FRAMES.length);
      }, 200);
      if (speedChanging) {
        setTimeout(() => setSpeedChanging(false), 200);
      }
    } else {
      setFrameIndex(JUMP_FRAME);
    }
    return () => clearInterval(animInterval);
  }, [isJumping, speedChanging]);

  useEffect(() => {
    if (isJumping) {
      let jumpInterval = setInterval(() => {
        setFrameIndex(JUMP_FRAME);
        setRunnerY((prevY) => {
          if (prevY > GROUND_LEVEL - JUMP_HEIGHT) {
            return prevY - GRAVITY * 4;
          } else {
            clearInterval(jumpInterval);
            let fallInterval = setInterval(() => {
              setRunnerY((prevY) => {
                if (prevY < GROUND_LEVEL) {
                  return prevY + GRAVITY;
                } else {
                  clearInterval(fallInterval);
                  setScore((prevScore) => prevScore + 1);
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
      if (words.length === 0) return; // Ensure words array is not empty
      setWordX(SCREEN_WIDTH);
      setIsWordActive(true);
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setCurrentWord(randomWord?.word || 'Word Runner');
      wordClicked.current = false;
      speed = (1 + Math.random()) * BASE_WORD_SPEED;
      setGameSpeed(speed);
      setSpeedChanging(true);

      moveInterval = setInterval(() => {
        setWordX((prevX) => {
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
          if (newX <= 100 && wordClicked.current) {
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
  }, [words]);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setBackgroundX((prevX) => (prevX - 1) % SCREEN_WIDTH);
      setForegroundX((prevX) => (prevX - gameSpeed) % (SCREEN_WIDTH * 10));
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
        height: FRAME_HEIGHT,
        resizeMode: "cover",
        transform: [{ translateX: -frameIndex * FRAME_WIDTH }], // Shift sprite sheet left
          }}
        />
        {speedChanging && (
          <Image
        source={SPEED_CHANGE}
        style={{
          position: "absolute",
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
          top: 0,
          left: 0,
          resizeMode: "cover",
        }}
          />
        )}
      </View>
      
      {/* Word (Word as Text) */}
      {isWordActive && wordX !== null && (
        <Text
          style={[styles.movingWord, {left: wordX, top: JUMP_HEIGHT + SCREEN_HEIGHT - GROUND_LEVEL }]}>
          {currentWord}
        </Text>
      )}
      <Text style={styles.score}>Score: {score}</Text>
      {words.length === 0 && <Text style={styles.errorText}>No words available for this level!</Text>}
    </View>
  );
};
