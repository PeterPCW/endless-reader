import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function ProfileScreen() {
  const [stats, setStats] = useState({
    score: 0,
    wordsCompleted: 0
  });

  useEffect(() => {
    console.log('ProfileScreen - Initializing');
    loadStats();
    return () => {
      console.log('ProfileScreen - Cleanup');
    };
  }, []);

  const loadStats = async () => {
    try {
      console.log('ProfileScreen - Loading stats from storage');
      const [score, completed] = await Promise.all([
        AsyncStorage.getItem('@game_score'),
        AsyncStorage.getItem('@completed_words')
      ]);

      setStats({
        score: score ? parseInt(score) : 0,
        wordsCompleted: completed ? JSON.parse(completed).length : 0
      });
      console.log('ProfileScreen - Stats loaded:', {
        score: score ? parseInt(score) : 0,
        completedCount: completed ? JSON.parse(completed).length : 0
      });
    } catch (error) {
      console.error('ProfileScreen - Error loading stats:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.score}</Text>
          <Text style={styles.statLabel}>High Score</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.wordsCompleted}</Text>
          <Text style={styles.statLabel}>Words Mastered</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  statCard: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 140,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 16,
    color: '#4b5563',
  },
});