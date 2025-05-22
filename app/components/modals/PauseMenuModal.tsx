import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PauseMenuModalProps {
  visible: boolean;
  onResume: () => void;
  onRestart: () => void;
  onReviewMode: () => void;
  onProfileSelect: () => void;
  onGameSelect: () => void;
}

export default function PauseMenuModal({
  visible,
  onResume,
  onRestart,
  onReviewMode,
  onProfileSelect,
  onGameSelect
}: PauseMenuModalProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Game Paused</Text>
        
        <TouchableOpacity style={styles.button} onPress={onResume}>
          <Text style={styles.buttonText}>Resume</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onRestart}>
          <Text style={styles.buttonText}>Restart Level</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onReviewMode}>
          <Text style={styles.buttonText}>Toggle Review Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onProfileSelect}>
          <Text style={styles.buttonText}>Profile Selection</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onGameSelect}>
          <Text style={styles.buttonText}>Game Selection</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
  },
});
