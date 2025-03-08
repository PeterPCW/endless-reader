import React from 'react';
import { ThemedView } from '@/app/components/ThemedView';

interface WordPracticeProps {
  visible: boolean;
  word: string;
  onClose: () => void;
}

export default function WordPractice({ visible, word, onClose }: WordPracticeProps) {
  return (
    <ThemedView />
  );
}
