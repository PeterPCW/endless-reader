import React, { useState, useEffect, useRef } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Image, Dimensions, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';
import { WordType, words } from '@/app/assets/data/words';
import PauseMenuModal from '@/app/components/modals/PauseMenuModal';
import WordMissedModal from '@/app/components/modals/WordMissedModal';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BG_PANEL = SCREEN_WIDTH * 4;
const FG_PANEL = SCREEN_WIDTH * 5;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const WORD_WIDTH = 100;
const WORD_HEIGHT = 100;
const BASE_SPAWN_DELAY = 2000;
const RANDOM_EXTRA_DELAY = 2000;
const BASE_WORD_SPEED = 4;
const GRAVITY = 5;
const BASELINE_Y = SCREEN_HEIGHT * 0.8;
const WORD_HEIGHT_VARIATION = SCREEN_HEIGHT * 0.1;
const SCORE_THRESHOLD = 7;
const REVIEW_THRESHOLD = 33;

const SPRITE_SHEET = require('@/app/assets/images/runner-sprite.png');
const SPEED_CHANGE = require('@/app/assets/images/speed-effect.png')
const FRAME_WIDTH = 150;
const FRAME_HEIGHT = 150;

const RUN_FRAMES = [0, 1, 2];
const JUMP_FRAME = 3;
const FALL_FRAME = 3; // 4 once I add to the sprite sheet

const BACKGROUND_IMAGE = require('@/app/assets/images/background.png');
const FOREGROUND_IMAGE = require('@/app/assets/images/foreground.png');
type RootStackParamList = {
  ProfileSelection: undefined;
  Games: undefined;
};

export default function Runner() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [runnerY, setRunnerY] = useState(BASELINE_Y - FRAME_HEIGHT/2);
  const [isJumping, setIsJumping] = useState(false);
  const wordClicked = useRef(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [wordX, setWordX] = useState<number | null>(null);
  const [isWordActive, setIsWordActive] = useState(false);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [currentWordHeight, setCurrentWordHeight] = useState(BASELINE_Y - WORD_HEIGHT/2);
  const [score, setScore] = useState(0);
  const [backPositions, setBackPositions] = useState({ x1: 0, x2: BG_PANEL });
  const [forePositions, setForePositions] = useState({ x1: 0, x2: FG_PANEL });
  const [gameSpeed, setGameSpeed] = useState(BASE_WORD_SPEED);
  const [speedChanging, setSpeedChanging] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<{ id: string }>({ id: "0" });
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [showWordMissed, setShowWordMissed] = useState(false);
  const [levelWords, setLevelWords] = useState<{ current: WordType[]; recent: WordType[]; past: WordType[]; ancient: WordType[]; }>({ current: [], recent: [], past: [], ancient: []});

  // Refs for intervals and timeouts
  const animIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const jumpIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fallIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const spawnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bgIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadAndInitialize = async () => {
      try {
        // Try to load saved level
        const savedLevel = await AsyncStorage.getItem('currentLevel');
        const levelToLoad = savedLevel ? JSON.parse(savedLevel) : 1;
        
        setCurrentLevel({id: levelToLoad});
        initialize(levelToLoad.id);
      } catch (error) {
        console.error('Error loading level', error);
        // Fallback to default level
        setCurrentLevel({id: "1"});
        initialize("1");
      }
    };
  
    loadAndInitialize();
  }, []);
  
  // Add another effect to save when level changes
  useEffect(() => {
    if (currentLevel.id) {
      AsyncStorage.setItem('currentLevel', JSON.stringify(currentLevel.id));
      initialize(currentLevel.id);
    }
  }, [currentLevel.id]);

  const initialize = async (levelId: string) => {
    const newLevelWords: {
      current: WordType[];
      recent: WordType[];
      past: WordType[];
      ancient: WordType[];
    } = {
      current: words.words.filter(word => word.level === parseInt(levelId, 10)),
      recent: words.words.filter(word => word.level + 2 >= parseInt(levelId, 10) && word.level < parseInt(levelId, 10)),
      past: words.words.filter(word => word.level + 10 >= parseInt(levelId, 10) && word.level + 2 < parseInt(levelId, 10)),
      ancient: words.words.filter(word => word.level + 10 < parseInt(levelId, 10)),
    };
    setLevelWords(newLevelWords);
    if (newLevelWords.current.length > 0) {
      console.log(`level ${levelId}, current ${newLevelWords.current.length}, recent+past+ancient ${newLevelWords.recent.length + newLevelWords.past.length + newLevelWords.ancient.length}`);
    } else {
      console.log(`All: ${newLevelWords}`);
    }
  }

  useEffect(() => {
    if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    if (!isJumping) {
      animIntervalRef.current = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % RUN_FRAMES.length);
      }, 100);
      if (speedChanging) {
        setTimeout(() => setSpeedChanging(false), 200);
      }
    } else {
      setFrameIndex(JUMP_FRAME);
    }
    return () => {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    };
  }, [isJumping, speedChanging]);

  useEffect(() => {
    if (isJumping) {
      if (jumpIntervalRef.current) clearInterval(jumpIntervalRef.current);
      if (fallIntervalRef.current) clearInterval(fallIntervalRef.current);

      jumpIntervalRef.current = setInterval(() => {
        setFrameIndex(JUMP_FRAME);
        setRunnerY((prevY) => {
          if (prevY > currentWordHeight - FRAME_HEIGHT/2) {
            return prevY - GRAVITY * 4;
          } else {
            if (jumpIntervalRef.current) clearInterval(jumpIntervalRef.current);
            setTimeout(() => setIsWordActive(false), 50);
            setTimeout(() => setFrameIndex(FALL_FRAME), 50);
            if (fallIntervalRef.current) clearInterval(fallIntervalRef.current);
            fallIntervalRef.current = setInterval(() => {
             setRunnerY((prevY) => {
                if (prevY < BASELINE_Y - FRAME_HEIGHT/2) {
                  return prevY + GRAVITY;
                } else {
                  if (fallIntervalRef.current) clearInterval(fallIntervalRef.current);
                  setScore((prevScore) => prevScore + 1);
                  if (score % SCORE_THRESHOLD === 0) {
                    setCurrentLevel((prevLevel) => ({ id: (parseInt(prevLevel.id) + 1).toString() }));
                  }
                  setTimeout(() => setIsJumping(false), 1000);
                  return BASELINE_Y - FRAME_HEIGHT/2;
                }
              });
            }, 16);
            return prevY;
          }
        });
      }, 16);
    }
    return () => {
      if (jumpIntervalRef.current) clearInterval(jumpIntervalRef.current);
      if (fallIntervalRef.current) clearInterval(fallIntervalRef.current);
    };
  }, [isJumping, currentWordHeight]);

  useEffect(() => {
    if (!currentLevel.id) {
      if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
      if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
      return;
    }

    const spawnWord = () => {
      const randomWord = getWeightedWord();
      if (!randomWord) return;

      setWordX(SCREEN_WIDTH);
      setIsWordActive(true);
      setCurrentWord(randomWord?.word || 'Word Runner');
      const randomOffset = -350 + (Math.random() * 2 - 1) * WORD_HEIGHT_VARIATION;
      setCurrentWordHeight(BASELINE_Y + randomOffset - WORD_HEIGHT/2);
      wordClicked.current = false;
      let speed = (1 + Math.random()) * BASE_WORD_SPEED;
      setGameSpeed(speed);
      setSpeedChanging(true);

      if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = setInterval(() => {
        setWordX((prevX) => {
          if (prevX === null) return null;
          if (prevX <= -WORD_WIDTH * 2) {
            if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
            if (isWordActive) {
              setIsWordActive(false);
              setShowWordMissed(true);
              // This modal for showWordMissed is not appearing correctly, and worse when a word is missed and it should've opened it seems to remove the ability to use handleJump or isJumping - the character can't capture any more words without the game being reset, please fix
            }
            setWordX(null);
            setIsJumping(false);
            scheduleNextSpawn();
            return null;
          }
          const newX = prevX - speed;
          if (newX <= 320 && newX >= 300 && wordClicked.current) {
            handleJump();
          }
          return newX;
        });
       }, 16);
    };

    const getWeightedWord = (): WordType | null => {
      if (!currentLevel.id) return null; 
      const currentLevelNum = parseInt(currentLevel.id, 10);
      const { current, recent, past, ancient } = levelWords;
      const allTheWords = [...current, ...recent, ...past, ...ancient];
  
      const weightedWords = allTheWords.map(word => {
        let weight = 0;
        const diff = currentLevelNum - word.level;
  
        if (diff === 0) {
          weight = 1.0;
        } else if (diff <= 2) {
          weight = 0.5;
        } else if (diff <= 10) {
          weight = 0.1;
        } else {
          weight = 0.05;
        }
        return { ...word, weight };
      });
  
      const totalWeight = weightedWords.reduce((sum, word) => sum + word.weight, 0);
  
      if (totalWeight === 0) {
        return null;
      }
  
      let random = Math.random() * totalWeight;
      let currentWeight = 0;
  
      for (let word of weightedWords) {
        currentWeight += word.weight;
        if (random < currentWeight) {
          return word;
        }
      }
  
      return null;
    };

    const scheduleNextSpawn = () => {
      const delay = BASE_SPAWN_DELAY + Math.random() * RANDOM_EXTRA_DELAY;
      if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
      spawnTimeoutRef.current = setTimeout(spawnWord, delay);
      wordClicked.current = false;
    };

    scheduleNextSpawn();

    return () => {
      if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
      if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
    };
  }, [words, levelWords, currentLevel]);

  useEffect(() => {
    if (bgIntervalRef.current) clearInterval(bgIntervalRef.current);
    bgIntervalRef.current = setInterval(() => {
      setBackPositions(({ x1, x2 }) => {
        let newX1 = x1 - 1;
        let newX2 = x2 - 1;
  
        // move whichever one is leftmost
        if (newX1 <= 0 && newX2 <= 0 && newX1 <= newX2) {
          newX1 = newX2 + BG_PANEL;
        } else if (newX2 <= 0 && newX1 <= 0 && newX2 <= newX1) {
          newX2 = newX1 + BG_PANEL;
        }

        return { x1: newX1, x2: newX2 };
      });
      setForePositions(({ x1, x2 }) => {
        let newX1 = x1 - gameSpeed;
        let newX2 = x2 - gameSpeed;
  
        // move whichever one is leftmost
        if (newX1 <= 0 && newX2 <= 0 && newX1 <= newX2) {
          newX1 = newX2 + FG_PANEL;
        } else if (newX2 <= 0 && newX1 <= 0 && newX2 <= newX1) {
          newX2 = newX1 + FG_PANEL;
        }

        return { x1: newX1, x2: newX2 };
      });
    }, 16);
    return () => {
      if (bgIntervalRef.current) clearInterval(bgIntervalRef.current);
    };
  }, [gameSpeed]);

  const reviewMode = () => {
    // Clear all intervals and timeouts
    if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    if (jumpIntervalRef.current) clearInterval(jumpIntervalRef.current);
    if (fallIntervalRef.current) clearInterval(fallIntervalRef.current);
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
    if (bgIntervalRef.current) clearInterval(bgIntervalRef.current);

    // Reset state variables
    setScore(0);
    setRunnerY(BASELINE_Y - FRAME_HEIGHT / 2);
    setIsJumping(false);
    setWordX(null);
    setIsWordActive(false);
    setCurrentWord('');
    setGameSpeed(BASE_WORD_SPEED);
    setSpeedChanging(false); // Reset speed change visual effect
    wordClicked.current = false; // Reset word click state
    setShowWordMissed(false); // Ensure word missed modal is hidden
    
    //Review mode should be setup where it changes the weights for getWeightedWord to make all current/past words evenly weighted at 1.0 while reviewMode is enabled
    //This will require changes in getWeightedWord to accept weights that are given
    //Review mode should also count the score but never advance the level for the player, instead it should automatically turn off after a set number of points (similar to how levels progress, and then it will flow back into the regular game) but that number needs to be higher than the level change count so use REVIEW_THRESHOLD
  };

  const pauseAllAnimations = () => {
    // This should be used by PauseMenuModal and WordMissedModal to stop all of the background action while the modal window is open
    //Implement the logic to freeze all of the useEffects and animation/spawn/etc refs so that they can contimnue immediately when the modal is closed but won't operate while it is open
  }

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
      <View style={styles.backgroundContainer}>
        <Image
          key="bg1"
          source={BACKGROUND_IMAGE}
          style={[styles.background, {
            left: backPositions.x1,
            width: BG_PANEL,
            height: SCREEN_HEIGHT
          }]}
        />
        <Image
          key="bg2"
          source={BACKGROUND_IMAGE}
          style={[styles.background, {
            left: backPositions.x2,
            width: BG_PANEL,
            height: SCREEN_HEIGHT
          }]}
        />
      </View>
      <View style={styles.foregroundContainer}>
        <Image
          key="fg1"
          source={FOREGROUND_IMAGE}
          style={[styles.foreground, {
            left: forePositions.x1,
            width: FG_PANEL,
            height: SCREEN_HEIGHT
          }]}
        />
        <Image
          key="fg2"
          source={FOREGROUND_IMAGE}
          style={[styles.foreground, {
            left: forePositions.x2,
            width: FG_PANEL,
            height: SCREEN_HEIGHT
          }]}
        />
      </View>
      <TouchableOpacity onPress={handleWordClick} style={styles.wordContainer}>
        <Text style={styles.gameWord}>{currentWord}</Text>
      </TouchableOpacity>
      <View style={[styles.character, {
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
            transform: [{ translateX: -frameIndex * FRAME_WIDTH }],
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

      {isWordActive && wordX !== null && (
        <Text
          style={[styles.movingWord, { left: wordX, top: currentWordHeight }]}>
          {currentWord || ''}
        </Text>
      )}
      <Text style={styles.score}>Score: {score} Level: {String(currentLevel.id ?? '1')}</Text>
    {/* Pause button */}
          <TouchableOpacity 
            style={styles.pauseButton} 
            onPress={() => setShowPauseMenu(true)}
          >
            <Text style={styles.pauseButtonText}>Pause</Text>
          </TouchableOpacity>
    
          {/* Modals */}
          <PauseMenuModal
            visible={showPauseMenu}
            onResume={() => setShowPauseMenu(false)}
            onReviewMode={() => {
              reviewMode();
              setShowPauseMenu(false);
              // Add review mode logic here
            }}
            onProfileSelect={() => {
              navigation.navigate('ProfileSelection')
              setShowPauseMenu(false);
              // Add navigation to profile selection
            }}
            onGameSelect={() => {
              navigation.navigate('Games')
              setShowPauseMenu(false);
              // Add navigation to game selection
            }}
          />
    
          <WordMissedModal
            visible={showWordMissed}
            word={currentWord}
            onContinue={() => setShowWordMissed(false)}
          />
        </View>
  );
};
