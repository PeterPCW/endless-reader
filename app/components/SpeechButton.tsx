import React from "react";
import { View, Text, Button } from "react-native";
import * as Speech from "expo-speech";

// Define syllables manually for accurate pronunciation
const syllableMap: { [key: string]: string[] } = {
  apple: ["æææ", "ppp", "lll"],
  banana: ["bbb", "əəə", "nnn", "æææ", "nnn", "əəə"],
  thought: ["θθθ", "ɔɔɔ", "t"],  // "thawt"
  through: ["θθθ", "ɹɹɹ", "uu:"],  // "throo"
};

export default function SpeechButton({ word }: { word: string }, { level }: { level: number }) {
  const syllables = syllableMap[word.toLowerCase()] || [word]; // Default to full word if missing

  const speakSyllables = async () => {
    // 1️⃣ Stretch the syllables
    for (let syllable of syllables) {
      await Speech.speak(syllable, { rate: 0.3, pitch: 1.0, language: "en-US" });
    }

    // 2️⃣ Prompt user to repeat
    await Speech.speak("Okay, your turn!", { rate: 0.8 });
    
    // 3️⃣ Pause for response
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 4️⃣ Ask them to say the word fast
    await Speech.speak(`Say it fast!`, { rate: 0.8 });

    // 5️⃣ Pause again for response
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 6️⃣ Speak the word at full speed
    await Speech.speak(word, { rate: 1.0 });
  };

  return (
    <View>
      <Text>{word}</Text>
      <Button title="🔊" onPress={speakSyllables} />
    </View>
  );
};
