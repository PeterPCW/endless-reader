import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, FlatList, PanResponder, LayoutChangeEvent, PanResponderInstance, StyleSheet } from 'react-native'; // Added PanResponderInstance
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
      <View style={localStyles.practiceWordContainer}>
        {/* New Wrapper View for interactive area */}
        <View style={{ flex: 1, position: 'relative' }}>
          {/* Container for the actual text parts */}
          <View style={localStyles.wordPartsContainer}>
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
                  <Text key={`${item.word}-${part}-${index}`} style={[localStyles.wordPartText, { color }]}>
                    {part}
                  </Text>
                );
              })}
            </Text>
          </View>

          {/* Absolutely Positioned Overlay for PanResponder */}
          <View
            style={localStyles.panOverlay}
            {...responder.panHandlers}
            pointerEvents="box-only"
          />
        </View>

        {/* Adjusted SpeechButton Wrapper */}
        <View style={localStyles.speechButtonWrapper}>
          <SpeechButton word={item.word} />
        </View>
      </View>
    );
  };

  // Main component return
  return (
    <View style={localStyles.practiceContainer}>
      <Text style={localStyles.title}>
        Practice Words - {selectedLevel?.name || 'Select Level'}
      </Text>
      {words.length === 0 ? (
        <Text>Loading words or no words found for this level.</Text>
      ) : (
        <FlatList
          data={words}
          renderItem={renderWord}
          keyExtractor={(item) => item.word}
          contentContainerStyle={localStyles.listContainer}
          // Optimization: Prevent unnecessary re-renders of list items if item data hasn't changed
          extraData={wordStates} // Re-render items when wordStates changes
        />
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  practiceContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    gap: 15,
  },
  practiceWordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#858585', // Dark gray background
    paddingVertical: 20, // Keep vertical padding
    paddingLeft: 20, // Keep left padding for space before word
    paddingRight: 10, // Reduce right padding to be closer to button
    borderRadius: 10,
    marginBottom: 20,
    position: 'relative', // Needed for absolute positioning of the overlay
  },
  wordPartsContainer: {
    flexDirection: 'row', // Lay out parts horizontally
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Allow it to take up available space
  },
  wordPartText: {
    fontSize: 60, // Font size for the text inside parts
    fontWeight: 'bold',
    color: '#f3f4f6', // Default off-white
    textAlign: 'center',
  },
  panOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0, // Cover the entire parent container
    bottom: 0,
    backgroundColor: 'transparent', // Make it invisible
    zIndex: 1, // Ensure it's above the text container but below the button if needed
  },
  speechButtonWrapper: {
    justifyContent: 'center', // Center vertically
    alignItems: 'center',
    marginRight: 10, // Push the button slightly left
  },
});
