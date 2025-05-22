import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Speech from "expo-speech";
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles';

export default function SpeechButton({ word }: { readonly word: string }) {

  const speakSyllables = async () => {
    //This doesn't work, need to have individual syllables to be able to stretch it correctly
    //Must use mp3s
    Speech.speak(word, { rate: 0.001 })
    
    // 5️⃣ Pause again for response
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // 6️⃣ Speak the word at full speed
    Speech.speak(word, { rate: 0.8 });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={speakSyllables}>
        <View pointerEvents="none">
          <Text style={styles.buttonStyle}>🔊</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
