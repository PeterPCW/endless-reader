// /app/screens/Profile.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  // other routes
  ProfileSelection: undefined;
};

type ProfileType = {
  avatar: string;
  name: string;
  levels: {
    [levelId: string]: {
      highScore: number;
      completed: boolean;
    };
  };
};

export default function Profile() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    // Load profile data from AsyncStorage
    AsyncStorage.getItem('profiles').then(data => {
      const profiles = data ? JSON.parse(data) : [];
      // Assume current profile is the first one for this example
      if (profiles.length > 0) setProfile(profiles[0]);
    });
  }, []);

  if (!profile) {
    return <Button title="Switch Profile" onPress={() => navigation.navigate('ProfileSelection')} />;
  }

  return (
    <View>
      <Image source={{ uri: profile.avatar }} style={{ width: 100, height: 100 }} />
      <TextInput
        value={profile.name}
        onChangeText={name => setProfile({ ...profile, name })}
        placeholder="Profile Name"
      />
      {/* Display level progress summary */}
      {Object.entries(profile.levels).map(([levelId, data]) => (
        <Text key={levelId}>
          {levelId}: High Score {data.highScore} - {data.completed ? 'Complete' : 'Incomplete'}
        </Text>
      ))}
      <Button title="Switch Profile" onPress={() => navigation.navigate('ProfileSelection')} />
    </View>
  );
}

/*import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function Profile() {
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
*/