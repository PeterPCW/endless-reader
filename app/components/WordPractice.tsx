import React from 'react';
import { View } from 'react-native';
import SpeechButton from '@/app/components/SpeechButton'

interface WordPracticeProps {
  visible: boolean;
  word: string;
  onClose: () => void;
}

export default function WordPractice({ visible, word, onClose }: WordPracticeProps) {
  return (
    <View>
      <div style={{ position: 'relative' }}>
      <button
        onClick={onClose}
        style={{
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'transparent',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        }}
      >
        X
      </button>
      <SpeechButton word={word} />
      </div>
    </View>
  );
}
