import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, FlatList, PanResponder, LayoutChangeEvent, PanResponderInstance } from 'react-native'; // Added PanResponderInstance
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';
import SpeechButton from '@/app/components/SpeechButton';
import { levels } from '@/app/assets/data/levels';
import { LevelContext } from '@/app/screens/Levels';
// Removed unused ThemedText import

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

// Define the state structure for each word
interface WordState {
  activePartIndex: number;
  textWidth: number;
}

export default function Practice() {
  const [words, setWords] = useState<WordType[]>([]);
  // Store state per word using word string as key
  const [wordStates, setWordStates] = useState<{ [key: string]: WordState }>({});
  const { selectedLevel } = useContext(LevelContext);
  // Store PanResponders per word using word string as key
  const panResponders = useRef<{ [key: string]: PanResponderInstance }>({}).current;

  // Define createPanResponder inside the Practice component scope
  const createPanResponder = (wordKey: string, numParts: number): PanResponderInstance => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Use functional update to get the latest state
        setWordStates((prevStates) => {
          const currentWordState = prevStates[wordKey];
          // Guard clauses
          if (!currentWordState || currentWordState.textWidth <= 0 || numParts <= 0) {
            return prevStates; // No change if state is invalid
          }

          const { textWidth } = currentWordState;
          const partWidth = textWidth / numParts;
          const relativeX = gestureState.dx; // Accumulated distance from the start

          // Calculate the index based on the relative position
          // Add a small offset (partWidth / 4) for better feel
          const newIndex = Math.min(
            Math.max(-1, Math.floor((relativeX + partWidth / 4) / partWidth)),
            numParts - 1 // Clamp to the last valid index (-1 means no part highlighted)
          );

          // Update state only if the index has changed
          if (newIndex !== currentWordState.activePartIndex) {
            return {
              ...prevStates,
              [wordKey]: { ...currentWordState, activePartIndex: newIndex },
            };
          }
          return prevStates; // No change needed
        });
      },
      onPanResponderRelease: () => {
        setWordStates((prev) => ({
          ...prev,
          [wordKey]: { ...prev[wordKey], activePartIndex: -1 }, // Reset on release
        }));
      },
      onPanResponderTerminate: () => { // Handle interruption (e.g., scroll)
        setWordStates((prev) => ({
          ...prev,
          [wordKey]: { ...prev[wordKey], activePartIndex: -1 }, // Reset on terminate
        }));
      },
    });
  };

  const initialize = async (levelId: string) => {
    try {
      const levelData: LevelData | undefined = levels[levelId];
      const wordList = levelData?.words || [];
      setWords(wordList);

      // Initialize state and PanResponder for each word
      const initialWordStates: { [key: string]: WordState } = {};
      wordList.forEach((word) => {
        initialWordStates[word.word] = { activePartIndex: -1, textWidth: 0 }; // Initialize width to 0, will be set by onLayout
        // Create and store PanResponder for each word
        if (!panResponders[word.word]) { // Avoid recreating if already exists
           panResponders[word.word] = createPanResponder(word.word, word.parts.length);
        }
      });
      setWordStates(initialWordStates);
    } catch (error) {
      console.error('Error loading level data:', error);
      setWords([]); // Clear words on error
      setWordStates({});
    }
  };

  useEffect(() => {
    if (selectedLevel) {
      initialize(selectedLevel.id);
    }
    // Optional: Cleanup function if needed when component unmounts or level changes
    // return () => { /* cleanup logic */ };
  }, [selectedLevel]); // Rerun initialize when selectedLevel changes


  const renderWord = ({ item }: { item: WordType }) => {
    const wordState = wordStates[item.word];
    const responder = panResponders[item.word]; // Get the specific PanResponder

    // Ensure wordState and responder exist before rendering
    if (!wordState || !responder) {
      // console.log(`Skipping render for ${item.word}: Missing state or responder`);
      return null; // Or a loading indicator/placeholder
    }
    const { activePartIndex } = wordState;

    const handleTextLayout = (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      // Update width only if it's different and positive
      if (width > 0 && width !== wordState.textWidth) {
        // Use functional update for safety
        setWordStates((prev) => ({
          ...prev,
          [item.word]: { ...prev[item.word], textWidth: width },
        }));
      }
    };

    return (
      <View style={styles.practiceWordContainer}>
        {/* New Wrapper View for interactive area */}
        <View style={{ flex: 1, position: 'relative' }}>
          {/* Container for the actual text parts */}
          <View style={styles.wordPartsContainer}>
            <Text onLayout={handleTextLayout}>
              {item.parts.map((part, index) => {
                let color = '#f3f4f6'; // Default off-white (inactive)
                if (index === activePartIndex) {
                  color = item.voiced[index] === 'v' ? '#891445' : '#3b82f6'; // Violet or light blue
                }
                if (index < activePartIndex) {
                  color = '#333333'; // Black for completed parts
                }
                return (
                  <Text key={`${item.word}-${part}-${index}`} style={[styles.wordPartText, { color }]}>
                    {part}
                  </Text>
                );
              })}
            </Text>
          </View>

          {/* Absolutely Positioned Overlay for PanResponder */}
          <View
            style={styles.panOverlay}
            {...responder.panHandlers}
            pointerEvents="box-only"
          />
        </View>

        {/* Adjusted SpeechButton Wrapper */}
        <View style={styles.speechButtonWrapper}>
          <SpeechButton word={item.word} />
        </View>
      </View>
    );
  };

  // Main component return
  return (
    <View style={styles.practiceContainer}>
      <Text style={styles.title}>
        Practice Words - {selectedLevel?.name || 'Select Level'}
      </Text>
      {words.length === 0 ? (
        <Text>Loading words or no words found for this level.</Text>
      ) : (
        <FlatList
          data={words}
          renderItem={renderWord}
          keyExtractor={(item) => item.word}
          contentContainerStyle={styles.listContainer}
          // Optimization: Prevent unnecessary re-renders of list items if item data hasn't changed
          extraData={wordStates} // Re-render items when wordStates changes
        />
      )}
    </View>
  );
}
