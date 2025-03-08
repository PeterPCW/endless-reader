// /app/components/NewProfile.tsx
import React, { useState } from 'react';
import {
  View,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { sharedStyles as styles } from '@/app/components/styles/SharedStyles'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const avatarOptions = [
  'avatar1.png',
  'avatar2.png',
];

interface NewProfileProps {
  visible: boolean;
  onClose: () => void;
}

export default function NewProfile({ visible, onClose }: NewProfileProps) {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const saveProfile = async () => {
    if (username && selectedAvatar) {
      const newProfile = {
        id: Date.now().toString(),
        name: username,
        avatar: `assets/images/avatars/${selectedAvatar}`,
        levels: {} // Initialize with no progress
      };

      try {
        const storedProfiles = await AsyncStorage.getItem('profiles');
        const profiles = storedProfiles ? JSON.parse(storedProfiles) : [];
        profiles.push(newProfile);
        await AsyncStorage.setItem('profiles', JSON.stringify(profiles));
        // Reset fields after saving
        setUsername('');
        setSelectedAvatar(null);
        onClose();
      } catch (error) {
        console.error('Error saving profile', error);
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.newProfileTitle}>Create New Profile</Text>
          <TextInput
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <Text style={styles.subtitle}>Select an Avatar:</Text>
          <ScrollView
            horizontal
            contentContainerStyle={styles.avatarContainer}
            showsHorizontalScrollIndicator={false}
          >
            {avatarOptions.map((avatar, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedAvatar(avatar)}
                style={[
                  styles.avatarButton,
                  selectedAvatar === avatar && styles.selectedAvatar
                ]}
              >
                <Image
                  source={{ uri: `assets/images/avatars/${avatar}` }}
                  style={styles.avatarImage}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
